import Joi from 'joi';

import { UserInputError } from '@src/domain.operations/UserInputError';

export const defineRegexPartForNumberGreaterThan = (greaterThan: string) => {
  // check that its an integer
  const validationResult = Joi.number()
    .integer()
    .positive()
    .allow(0)
    .validate(greaterThan);
  if (validationResult.error)
    throw new Error(`not a positive integer: '${greaterThan}'`);

  // build the regex string
  const sameNumberOfDigitsPart = [...greaterThan]
    .map((digitChar) => {
      if (digitChar === '9') return '9';
      return `[${digitChar}-9]`;
    })
    .join('');
  const moreDigitsPart = [
    Array.from({ length: greaterThan.length + 1 }, () => '[0-9]').join(''),
    '+', // + to say ("or more" digits)
  ].join('');
  return `(${moreDigitsPart}|${sameNumberOfDigitsPart})`;
};

export const defineMinPackageVersionRegex = (minVersion: string) => {
  try {
    // for each part of the semver version, specify the regexp
    const [major, minor = '0', patch = '0', ...more] = minVersion.split(
      '.',
    ) as [string, string | undefined, string | undefined, ...string[]]; // default minor and patch to zero
    if (more.length)
      // fail fast if not a valid semver
      throw new Error(
        `semver versions should only have three parts. '${minVersion}' has ${minVersion.split.length} parts`,
      );

    // define regex for greater or equal to the patch version
    const greaterThanOrEqualToPatchRegex = [
      defineRegexPartForNumberGreaterThan(major),
      defineRegexPartForNumberGreaterThan(minor),
      defineRegexPartForNumberGreaterThan(patch),
    ].join('.');

    // define regex for greater or equal to the minor version
    const greaterThanOrEqualToMinorRegex = [
      defineRegexPartForNumberGreaterThan(major),
      defineRegexPartForNumberGreaterThan(`${parseInt(minor, 10) + 1}`),
      defineRegexPartForNumberGreaterThan('0'),
    ].join('.');

    // define regex for greater or equal to the major version
    const greaterThanOrEqualToMajorRegex = [
      defineRegexPartForNumberGreaterThan(`${parseInt(major, 10) + 1}`),
      defineRegexPartForNumberGreaterThan('0'),
      defineRegexPartForNumberGreaterThan('0'),
    ].join('.');

    // define regexp for greater or equal to the minor version
    return new RegExp(
      `^(${greaterThanOrEqualToMajorRegex}|${greaterThanOrEqualToMinorRegex}|${greaterThanOrEqualToPatchRegex})$`,
    );
  } catch (error) {
    throw new UserInputError(
      `input to defineMinPackageVersionRegex was not a valid semver version number: ${(error as Error).message}`,
      {
        potentialSolution: `change '${minVersion}' to a valid semver version number. (e.g., '0.8.21' or '7.0.0')`,
      },
    );
  }
};
