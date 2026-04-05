import { isSelfDependency } from './isSelfDependency';

describe('isSelfDependency', () => {
  const TEST_CASES = [
    {
      description: 'exact name match → true',
      given: {
        packageName: 'sql-dao-generator',
        dependencyKey: 'sql-dao-generator',
      },
      expect: true,
    },
    {
      description: 'different name → false',
      given: {
        packageName: 'sql-dao-generator',
        dependencyKey: 'sql-schema-generator',
      },
      expect: false,
    },
    {
      description: 'null name → false',
      given: { packageName: null, dependencyKey: 'sql-dao-generator' },
      expect: false,
    },
    {
      description: 'scoped @org/pkg match → true',
      given: {
        packageName: '@ehmpathy/sql-dao-generator',
        dependencyKey: '@ehmpathy/sql-dao-generator',
      },
      expect: true,
    },
    {
      description: 'scoped vs unscoped → false',
      given: {
        packageName: '@ehmpathy/sql-dao-generator',
        dependencyKey: 'sql-dao-generator',
      },
      expect: false,
    },
  ];

  TEST_CASES.forEach((testCase) => {
    it(testCase.description, () => {
      const result = isSelfDependency(testCase.given);
      expect(result).toEqual(testCase.expect);
    });
  });
});
