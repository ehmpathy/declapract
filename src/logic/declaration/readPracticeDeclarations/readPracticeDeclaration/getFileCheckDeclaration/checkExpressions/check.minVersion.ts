import { defineMinPackageVersionRegex } from '../../../../publicFileCheckFunctionUtilities/defineMinPackageVersionRegex';

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
 * evaluates a foundValue against a minVersion, to check if it passes it or not
 */
export const checkDoesFoundValuePassesMinVersionCheck = ({
  foundValue,
  minVersion,
}: {
  foundValue: any;
  minVersion: string;
}): boolean => {
  // define the regex to check against
  const minVersionRegexp = defineMinPackageVersionRegex(minVersion);

  // if foundValue does not match it, return the error message
  if (typeof foundValue !== 'string') return false;
  return minVersionRegexp.test(foundValue);
};
