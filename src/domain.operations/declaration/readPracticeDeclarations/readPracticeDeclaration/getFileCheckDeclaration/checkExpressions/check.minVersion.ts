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
 * grabs the `x.y.z` part from strings that match the shape `@declapract{check.minVersion('x.y.z')}`
 *
 * returns null if no match
 */
export const getMinVersionFromCheckMinVersionExpression = (
  value: string,
): string | null =>
  (new RegExp(/^@declapract\{check\.minVersion\('([0-9.]+)'\)\}$/).exec(
    value,
  ) ?? [])[1] ?? null;

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
}: {
  foundValue: unknown;
  minVersion: string;
}): boolean => {
  // linked versions always satisfy minVersion checks (the repo IS the package)
  const isLinked = isLinkedDependencyVersion({ value: foundValue });
  if (isLinked) return true;

  // foundValue must be a string
  if (typeof foundValue !== 'string') return false;

  // foundValue must be a valid semver version
  const foundVersionValid = valid(foundValue);
  if (!foundVersionValid) return false;

  // use semver comparison for correct multi-digit version handling
  return gte(foundVersionValid, minVersion);
};
