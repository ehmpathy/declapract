import { defineMinPackageVersionRegex } from '@src/domain.operations/declaration/publicFileCheckFunctionUtilities/defineMinPackageVersionRegex';

/**
 * .what = checks if a version string is a linked dependency version
 * .why = linked versions (link:.) indicate the repo IS the package,
 *        so they satisfy any minVersion check by definition
 */
export const isLinkedDependencyVersion = (input: {
  value: unknown;
}): boolean => {
  if (typeof input.value !== 'string') return false;
  return input.value.startsWith('link:');
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
 * checks whether the string matches the form "@declapract{check.minVersion('x.y.z')}" (with nothing before and nothing after, too)
 */
export const isCheckMinVersionExpression = (value: string) =>
  !!getMinVersionFromCheckMinVersionExpression(value);

/**
 * .what = evaluates a foundValue against a minVersion, to check if it passes it or not
 * .why = enables validation of package versions against minimum requirements
 */
export const checkDoesFoundValuePassesMinVersionCheck = ({
  foundValue,
  minVersion,
}: {
  foundValue: any;
  minVersion: string;
}): boolean => {
  // linked versions always satisfy minVersion checks (the repo IS the package)
  const isLinked = isLinkedDependencyVersion({ value: foundValue });
  if (isLinked) return true;

  // define the regex to check against
  const minVersionRegexp = defineMinPackageVersionRegex(minVersion);

  // if foundValue does not match it, return the error message
  if (typeof foundValue !== 'string') return false;
  return minVersionRegexp.test(foundValue);
};
