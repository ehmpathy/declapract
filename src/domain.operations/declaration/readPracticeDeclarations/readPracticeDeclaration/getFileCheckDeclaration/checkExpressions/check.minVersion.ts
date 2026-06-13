/**
 * .what = parses a semver version string into components
 * .why = enables proper version comparison with prerelease support
 *
 * .note = replaces semver.valid() to avoid semver package which has internal cycles
 */
const parseVersion = (
  version: string,
): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
} | null => {
  // match x.y.z with optional prerelease (-alpha, -beta.1) and build metadata (+build.123)
  // must be exactly 3 parts (no 1.2.3.4), but prerelease/build metadata allowed
  const match =
    /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.]+))?(?:\+[a-zA-Z0-9.]+)?$/.exec(
      version,
    );
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  };
};

/**
 * .what = validates and normalizes a semver version string
 * .why = ensures the version is a valid x.y.z format before comparison
 *
 * .note = replaces semver.valid() to avoid semver package which has internal cycles
 *         preserves prerelease suffix for proper comparison
 */
const valid = (version: string): string | null => {
  const parsed = parseVersion(version);
  if (!parsed) return null;
  const base = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  return parsed.prerelease ? `${base}-${parsed.prerelease}` : base;
};

/**
 * .what = compares two semver versions for greater-than-or-equal
 * .why = enables version comparison without external dependency
 *
 * .note = replaces semver.gte() to avoid semver package which has internal cycles
 *         handles prerelease per semver spec: 1.0.0-alpha < 1.0.0
 */
const gte = (version1: string, version2: string): boolean => {
  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);
  if (!v1 || !v2) return false;

  // compare major.minor.patch
  if (v1.major !== v2.major) return v1.major > v2.major;
  if (v1.minor !== v2.minor) return v1.minor > v2.minor;
  if (v1.patch !== v2.patch) return v1.patch > v2.patch;

  // equal major.minor.patch: prerelease compare
  // per semver: release > prerelease (1.0.0 > 1.0.0-alpha)
  if (v1.prerelease === null && v2.prerelease === null) return true; // both release, equal
  if (v1.prerelease === null && v2.prerelease !== null) return true; // v1 release > v2 prerelease
  if (v1.prerelease !== null && v2.prerelease === null) return false; // v1 prerelease < v2 release

  // both prerelease: lexicographic comparison (simplified; beta > alpha)
  return v1.prerelease! >= v2.prerelease!;
};

/**
 * .what = checks if a version string is a linked dependency version
 * .why = linked versions (link:. or file:.) indicate the repo IS the package,
 *        so they satisfy any minVersion check by definition
 */
export const isLinkedDependencyVersion = (input: {
  value: unknown;
}): boolean => {
  if (typeof input.value !== 'string') return false;
  return input.value.startsWith('link:') || input.value.startsWith('file:');
};

/**
 * regex for check.minVersion expressions with optional .ifInstalled() modifier
 *
 * matches:
 * - @declapract{check.minVersion('1.2.3')}
 * - @declapract{check.minVersion('1.2.3').ifInstalled()}
 *
 * .note = exact match version (anchored) for single expression validation
 */
export const CHECK_MIN_VERSION_REGEX =
  /^@declapract\{check\.minVersion\('([0-9.]+)'\)(\.ifInstalled\(\))?\}$/;

/**
 * regex for check.minVersion expressions (global, unanchored) for bulk replacement
 *
 * matches all occurrences in a string, not just exact matches
 */
export const CHECK_MIN_VERSION_REGEX_GLOBAL =
  /@declapract\{check\.minVersion\('([0-9.]+)'\)(\.ifInstalled\(\))?\}/g;

/**
 * regex to detect @declapract expressions with unsupported modifiers
 *
 * matches expressions that look like check.minVersion but have unknown modifiers
 *
 * .note = the negative lookahead includes \} to account for the closing brace
 */
export const CHECK_MIN_VERSION_UNSUPPORTED_MODIFIER_REGEX =
  /^@declapract\{check\.minVersion\('[0-9.]+'\)\.(?!ifInstalled\(\)\}$)(\w+)\(/;

/**
 * .what = throws if expression contains unsupported modifier
 * .why = fail fast when declarations use modifiers this version cannot handle,
 *        rather than silently writing raw expressions to output files
 */
export const assertNoUnsupportedModifiers = (value: string): void => {
  const match = CHECK_MIN_VERSION_UNSUPPORTED_MODIFIER_REGEX.exec(value);
  if (!match) return;
  const modifier = match[1];
  throw new Error(
    `unsupported declapract modifier '.${modifier}()' in expression: ${value}. ` +
      `supported modifiers: .ifInstalled(). ` +
      `hint: upgrade declapract or fix the declarations package.`,
  );
};

/**
 * grabs the `x.y.z` part from strings that match the shape `@declapract{check.minVersion('x.y.z')}` or `@declapract{check.minVersion('x.y.z').ifInstalled()}`
 *
 * returns null if no match
 */
export const getMinVersionFromCheckMinVersionExpression = (
  value: string,
): string | null => (CHECK_MIN_VERSION_REGEX.exec(value) ?? [])[1] ?? null;

/**
 * checks if the expression has the .ifInstalled() modifier
 *
 * returns true if .ifInstalled() is present
 */
export const hasIfInstalledModifier = (value: string): boolean =>
  (CHECK_MIN_VERSION_REGEX.exec(value) ?? [])[2] !== undefined;

/**
 * checks whether the string matches the form "@declapract{check.minVersion('x.y.z')}" (exact match only)
 */
export const isCheckMinVersionExpression = (value: string) =>
  !!getMinVersionFromCheckMinVersionExpression(value);

/**
 * .what = evaluates a foundValue against a minVersion, to check if it passes it or not
 * .why = enables validation of package versions against minimum requirements
 *
 * .note = uses semver library for correct version comparison instead of regex,
 *         which failed for multi-digit version components (e.g., 1.27.12 vs 1.17.20)
 */
export const checkDoesFoundValuePassesMinVersionCheck = ({
  foundValue,
  minVersion,
  ifInstalled,
}: {
  foundValue: unknown;
  minVersion: string;
  ifInstalled?: boolean;
}): boolean => {
  // linked versions always satisfy minVersion checks (the repo IS the package)
  const isLinked = isLinkedDependencyVersion({ value: foundValue });
  if (isLinked) return true;

  // if ifInstalled and foundValue is absent (undefined or null), skip the check
  if (ifInstalled && (foundValue === undefined || foundValue === null))
    return true;

  // foundValue must be a string
  if (typeof foundValue !== 'string') return false;

  // foundValue must be a valid semver version
  const foundVersionValid = valid(foundValue);
  if (!foundVersionValid) return false;

  // use semver comparison for correct multi-digit version handle
  return gte(foundVersionValid, minVersion);
};
