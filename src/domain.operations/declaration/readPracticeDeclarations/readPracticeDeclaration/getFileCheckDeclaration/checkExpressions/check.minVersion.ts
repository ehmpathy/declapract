import { gte, valid } from 'semver';

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
