import { defineMinPackageVersionRegex } from './defineMinPackageVersionRegex';

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
