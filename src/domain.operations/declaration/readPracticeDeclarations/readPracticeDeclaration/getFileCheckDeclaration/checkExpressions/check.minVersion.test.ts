import {
  checkDoesFoundValuePassesMinVersionCheck,
  isLinkedDependencyVersion,
} from './check.minVersion';

const testCases = [
  // linked versions should return true
  { value: 'link:.', expected: true, description: 'link:. (current dir)' },
  { value: 'link:..', expected: true, description: 'link:.. (parent dir)' },
  {
    value: 'link:../sibling-package',
    expected: true,
    description: 'link:../sibling-package (relative path)',
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
    description: 'leading space (strict prefix)',
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

  describe('semver versions', () => {
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

    it('should return false for caret range (ranges are not matched)', () => {
      const result = checkDoesFoundValuePassesMinVersionCheck({
        foundValue: '^2.0.0',
        minVersion: '1.0.0',
      });
      expect(result).toEqual(false);
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
  });
});
