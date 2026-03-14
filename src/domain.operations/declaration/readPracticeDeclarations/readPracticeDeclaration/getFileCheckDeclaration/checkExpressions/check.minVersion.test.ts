import {
  checkDoesFoundValuePassesMinVersionCheck,
  isLinkedDependencyVersion,
} from './check.minVersion';

const testCases = [
  // linked versions should return true
  { value: 'link:.', expected: true, description: 'link:. (current dir)' },
  { value: 'link:..', expected: true, description: 'link:.. (parent dir)' },
  {
    value: 'link:../peer-package',
    expected: true,
    description: 'link:../peer-package (relative path)',
  },
  {
    value: 'link:/absolute/path',
    expected: true,
    description: 'link:/absolute/path (absolute path)',
  },
  {
    value: 'link:./nested/path',
    expected: true,
    description: 'link:./nested/path (nested relative)',
  },

  // semver versions should return false
  { value: '1.0.0', expected: false, description: 'semver 1.0.0' },
  { value: '^1.0.0', expected: false, description: 'caret semver ^1.0.0' },
  { value: '~1.0.0', expected: false, description: 'tilde semver ~1.0.0' },
  { value: '>=1.0.0', expected: false, description: 'range semver >=1.0.0' },

  // other protocols should return false
  { value: 'file:../path', expected: false, description: 'file: protocol' },
  { value: 'git://...', expected: false, description: 'git: protocol' },
  { value: 'npm:package', expected: false, description: 'npm: protocol' },
  { value: 'workspace:*', expected: false, description: 'workspace: protocol' },

  // non-string values should return false
  { value: null, expected: false, description: 'null' },
  { value: undefined, expected: false, description: 'undefined' },
  { value: 123, expected: false, description: 'number' },
  { value: {}, expected: false, description: 'object' },
  { value: [], expected: false, description: 'array' },

  // edge cases
  { value: '', expected: false, description: 'empty string' },
  { value: 'link', expected: false, description: 'just "link" without colon' },
  {
    value: 'LINK:.',
    expected: false,
    description: 'uppercase LINK (case sensitive)',
  },
  {
    value: ' link:.',
    expected: false,
    description: 'prefix space (strict prefix)',
  },
];

describe('isLinkedDependencyVersion', () => {
  testCases.forEach((testCase) =>
    it(`should return ${testCase.expected} for ${testCase.description}`, () => {
      const result = isLinkedDependencyVersion({ value: testCase.value });
      expect(result).toEqual(testCase.expected);
    }),
  );
});

describe('checkDoesFoundValuePassesMinVersionCheck', () => {
  describe('linked versions', () => {
    const linkedVersionCases = [
      { foundValue: 'link:.', minVersion: '1.0.0', description: 'link:.' },
      { foundValue: 'link:..', minVersion: '2.0.0', description: 'link:..' },
      {
        foundValue: 'link:../other-pkg',
        minVersion: '99.0.0',
        description: 'link:../other-pkg',
      },
      {
        foundValue: 'link:/absolute/path',
        minVersion: '5.0.0',
        description: 'link:/absolute/path',
      },
    ];

    linkedVersionCases.forEach((testCase) =>
      it(`should return true for ${testCase.description} regardless of minVersion ${testCase.minVersion}`, () => {
        const result = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: testCase.foundValue,
          minVersion: testCase.minVersion,
        });
        expect(result).toEqual(true);
      }),
    );
  });

  describe('semver versions - basic', () => {
    it('should return true when version meets minimum', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: '2.0.0',
        minVersion: '1.0.0',
      });
      expect(result).toEqual(true);
    });

    it('should return true when version equals minimum', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: '1.0.0',
        minVersion: '1.0.0',
      });
      expect(result).toEqual(true);
    });

    it('should return false when version is below minimum', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: '1.0.0',
        minVersion: '2.0.0',
      });
      expect(result).toEqual(false);
    });

    it('should return false for caret range (ranges are not matched)', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: '^2.0.0',
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });
  });

  describe('semver versions - multi-digit components (regression tests)', () => {
    /**
     * .what = tests for the regex bug where multi-digit version components failed
     * .why = the old regex [1-9][7-9] for "17" rejected valid versions like "20"
     *        because "0" is not in [7-9], even though 20 > 17
     */
    const multiDigitCases = [
      // the original bug case: 1.27.12 vs 1.17.20
      {
        foundValue: '1.27.12',
        minVersion: '1.17.20',
        expected: true,
        description:
          '1.27.12 >= 1.17.20 (higher minor compensates for lower patch)',
      },
      // minor version with "carry" scenarios
      {
        foundValue: '1.20.0',
        minVersion: '1.17.0',
        expected: true,
        description: '1.20.0 >= 1.17.0 (20 > 17, second digit 0 vs 7)',
      },
      {
        foundValue: '1.20.5',
        minVersion: '1.17.9',
        expected: true,
        description: '1.20.5 >= 1.17.9 (higher minor, lower patch)',
      },
      {
        foundValue: '1.30.0',
        minVersion: '1.29.9',
        expected: true,
        description: '1.30.0 >= 1.29.9 (30 > 29)',
      },
      // patch version with "carry" scenarios
      {
        foundValue: '1.17.30',
        minVersion: '1.17.29',
        expected: true,
        description: '1.17.30 >= 1.17.29 (30 > 29)',
      },
      {
        foundValue: '1.17.100',
        minVersion: '1.17.99',
        expected: true,
        description: '1.17.100 >= 1.17.99 (100 > 99)',
      },
      // major version with multi-digit
      {
        foundValue: '10.0.0',
        minVersion: '9.99.99',
        expected: true,
        description: '10.0.0 >= 9.99.99 (major version bump)',
      },
      {
        foundValue: '20.0.0',
        minVersion: '19.0.0',
        expected: true,
        description: '20.0.0 >= 19.0.0 (20 > 19)',
      },
      // three digit versions
      {
        foundValue: '1.100.0',
        minVersion: '1.99.0',
        expected: true,
        description: '1.100.0 >= 1.99.0 (100 > 99)',
      },
      {
        foundValue: '1.0.100',
        minVersion: '1.0.99',
        expected: true,
        description: '1.0.100 >= 1.0.99 (100 > 99)',
      },
      // edge cases that should fail
      {
        foundValue: '1.17.19',
        minVersion: '1.17.20',
        expected: false,
        description: '1.17.19 < 1.17.20 (patch is lower)',
      },
      {
        foundValue: '1.16.99',
        minVersion: '1.17.0',
        expected: false,
        description: '1.16.99 < 1.17.0 (minor is lower, high patch not enough)',
      },
      {
        foundValue: '0.99.99',
        minVersion: '1.0.0',
        expected: false,
        description: '0.99.99 < 1.0.0 (major is lower)',
      },
    ];

    multiDigitCases.forEach((testCase) =>
      it(`should return ${testCase.expected} for ${testCase.description}`, () => {
        const result = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: testCase.foundValue,
          minVersion: testCase.minVersion,
        });
        expect(result).toEqual(testCase.expected);
      }),
    );
  });

  describe('semver versions - exhaustive component comparisons', () => {
    const exhaustiveCases = [
      // major version dominates
      { foundValue: '2.0.0', minVersion: '1.99.99', expected: true },
      { foundValue: '3.0.0', minVersion: '2.50.50', expected: true },
      { foundValue: '1.0.0', minVersion: '2.0.0', expected: false },

      // minor version comparison (same major)
      { foundValue: '1.5.0', minVersion: '1.4.99', expected: true },
      { foundValue: '1.10.0', minVersion: '1.9.0', expected: true },
      { foundValue: '1.4.0', minVersion: '1.5.0', expected: false },

      // patch version comparison (same major.minor)
      { foundValue: '1.5.10', minVersion: '1.5.9', expected: true },
      { foundValue: '1.5.9', minVersion: '1.5.10', expected: false },

      // exact equality
      { foundValue: '1.2.3', minVersion: '1.2.3', expected: true },
      { foundValue: '0.0.0', minVersion: '0.0.0', expected: true },
      { foundValue: '99.99.99', minVersion: '99.99.99', expected: true },

      // zeros in various positions
      { foundValue: '0.0.1', minVersion: '0.0.0', expected: true },
      { foundValue: '0.1.0', minVersion: '0.0.99', expected: true },
      { foundValue: '1.0.0', minVersion: '0.99.99', expected: true },
    ];

    exhaustiveCases.forEach((testCase) =>
      it(`should return ${testCase.expected} for ${testCase.foundValue} >= ${testCase.minVersion}`, () => {
        const result = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: testCase.foundValue,
          minVersion: testCase.minVersion,
        });
        expect(result).toEqual(testCase.expected);
      }),
    );
  });

  describe('invalid version formats', () => {
    const invalidCases = [
      {
        foundValue: 'not-a-version',
        minVersion: '1.0.0',
        description: 'plain string',
      },
      {
        foundValue: '1.2',
        minVersion: '1.0.0',
        description: 'two-part version',
      },
      {
        foundValue: '1.2.3.4',
        minVersion: '1.0.0',
        description: 'four-part version',
      },
      { foundValue: '~1.0.0', minVersion: '1.0.0', description: 'tilde range' },
      { foundValue: '^1.0.0', minVersion: '1.0.0', description: 'caret range' },
      { foundValue: '>=1.0.0', minVersion: '1.0.0', description: 'gte range' },
      { foundValue: '1.x.x', minVersion: '1.0.0', description: 'x-range' },
      { foundValue: '*', minVersion: '1.0.0', description: 'wildcard' },
      { foundValue: 'latest', minVersion: '1.0.0', description: 'latest tag' },
    ];

    invalidCases.forEach((testCase) =>
      it(`should return false for invalid version format: ${testCase.description}`, () => {
        const result = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: testCase.foundValue,
          minVersion: testCase.minVersion,
        });
        expect(result).toEqual(false);
      }),
    );

    // v-prefixed version is accepted by semver (coerced to valid version)
    it('should accept v-prefixed version (semver coerces v1.0.0 to 1.0.0)', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: 'v1.0.0',
        minVersion: '1.0.0',
      });
      expect(result).toEqual(true);
    });
  });

  describe('non-string values', () => {
    it('should return false for null', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: null,
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });

    it('should return false for undefined', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: undefined,
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });

    it('should return false for number', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: 123,
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });

    it('should return false for object', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: { version: '1.0.0' },
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });

    it('should return false for array', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: ['1.0.0'],
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
    });
  });

  describe('prerelease and build metadata', () => {
    const prereleaseCases = [
      // prerelease versions are lower than release versions
      { foundValue: '1.0.0-alpha', minVersion: '1.0.0', expected: false },
      { foundValue: '1.0.0-beta.1', minVersion: '1.0.0', expected: false },
      { foundValue: '1.0.0-rc.1', minVersion: '1.0.0', expected: false },

      // prerelease to prerelease comparison
      { foundValue: '1.0.0-beta', minVersion: '1.0.0-alpha', expected: true },
      {
        foundValue: '1.0.0-alpha.2',
        minVersion: '1.0.0-alpha.1',
        expected: true,
      },

      // release version satisfies prerelease min
      { foundValue: '1.0.0', minVersion: '1.0.0-alpha', expected: true },
      { foundValue: '1.0.0', minVersion: '1.0.0-rc.1', expected: true },

      // build metadata is ignored in comparison
      { foundValue: '1.0.0+build.123', minVersion: '1.0.0', expected: true },
      { foundValue: '1.0.0', minVersion: '1.0.0+build.456', expected: true },
    ];

    prereleaseCases.forEach((testCase) =>
      it(`should return ${testCase.expected} for ${testCase.foundValue} >= ${testCase.minVersion}`, () => {
        const result = checkDoesFoundValuePassesMinVersionCheck({
          foundValue: testCase.foundValue,
          minVersion: testCase.minVersion,
        });
        expect(result).toEqual(testCase.expected);
      }),
    );
  });
});
