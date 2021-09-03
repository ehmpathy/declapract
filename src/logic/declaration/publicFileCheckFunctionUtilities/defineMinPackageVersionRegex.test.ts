import { defineMinPackageVersionRegex, defineRegexPartForNumberGreaterThan } from './defineMinPackageVersionRegex';

const testCases = [
  { minVersion: '0.8.21', versionToCheck: '0.1.21', correctResult: false },
  { minVersion: '0.8.21', versionToCheck: '0.9.21', correctResult: true },
  { minVersion: '0.8.21', versionToCheck: '0.8.21', correctResult: true },
  { minVersion: '0.8.21', versionToCheck: '0.8.20', correctResult: false },
  { minVersion: '0.8.21', versionToCheck: '1.0.0', correctResult: true },
  { minVersion: '0.8.21', versionToCheck: '0.0.0', correctResult: false },
  { minVersion: '0.0.21', versionToCheck: '0.1.0', correctResult: true },
  { minVersion: '0.0.21', versionToCheck: '0.0.0', correctResult: false },
  { minVersion: '0', versionToCheck: '0.0.0', correctResult: true },
  { minVersion: '0', versionToCheck: '0.0.1', correctResult: true },
  { minVersion: '0', versionToCheck: '0.1.0', correctResult: true },
  { minVersion: '1', versionToCheck: '0.1.0', correctResult: false },
  { minVersion: '1', versionToCheck: '1.0.0', correctResult: true },
  { minVersion: '0.7', versionToCheck: '1.0.0', correctResult: true },
  { minVersion: '0.7', versionToCheck: '0.5.0', correctResult: false },
  { minVersion: '0.7', versionToCheck: '0.7.1', correctResult: true },
  { minVersion: '2.0.0', versionToCheck: '0.7.1', correctResult: false },
  { minVersion: '2.0.0', versionToCheck: '2.0.0', correctResult: true },
  { minVersion: '2.0.0', versionToCheck: '8.0.0', correctResult: true },
  { minVersion: '2.0.0', versionToCheck: '8.21.0', correctResult: true },
];

describe('defineMinPackageVersionRegex', () => {
  testCases.forEach((testCase) =>
    it(`should create a regexp that finds '${testCase.minVersion} <= ${testCase.versionToCheck}' is '${testCase.correctResult}'`, () => {
      const regexp = defineMinPackageVersionRegex(testCase.minVersion);
      const result = regexp.test(testCase.versionToCheck);
      expect(result).toEqual(testCase.correctResult);
    }),
  );
});

const subTestCases = [
  { minNumber: '7', numberToCheck: '6', correctResult: false },
  { minNumber: '7', numberToCheck: '7', correctResult: true },
  { minNumber: '7', numberToCheck: '8', correctResult: true },
  { minNumber: '7', numberToCheck: '11', correctResult: true },
  { minNumber: '21', numberToCheck: '11', correctResult: false },
  { minNumber: '21', numberToCheck: '21', correctResult: true },
  { minNumber: '21', numberToCheck: '23', correctResult: true },
  { minNumber: '21', numberToCheck: '123', correctResult: true },
  { minNumber: '821', numberToCheck: '23', correctResult: false },
  { minNumber: '821', numberToCheck: '821', correctResult: true },
  { minNumber: '821', numberToCheck: '921', correctResult: true },
  { minNumber: '821', numberToCheck: '1821', correctResult: true },
];
describe('defineRegexPartForNumberGreaterThan', () => {
  subTestCases.forEach((testCase) =>
    it(`should create a regexp that finds '${testCase.minNumber} <= ${testCase.numberToCheck}' is '${testCase.correctResult}'`, () => {
      const regexpPart = defineRegexPartForNumberGreaterThan(testCase.minNumber);
      const result = new RegExp(`^${regexpPart}$`).test(testCase.numberToCheck);
      expect(result).toEqual(testCase.correctResult);
    }),
  );
});
