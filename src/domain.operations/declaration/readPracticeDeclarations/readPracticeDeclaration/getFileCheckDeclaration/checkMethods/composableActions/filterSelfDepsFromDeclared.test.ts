import { filterSelfDepsFromDeclared } from './filterSelfDepsFromDeclared';

describe('filterSelfDepsFromDeclared', () => {
  const TEST_CASES = [
    {
      description: 'self-dep in dependencies → filtered out',
      given: {
        declared: {
          name: 'sql-dao-generator',
          dependencies: {
            'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
            'other-package': '^1.0.0',
          },
        },
        targetPackageName: 'sql-dao-generator',
      },
      expect: {
        name: 'sql-dao-generator',
        dependencies: {
          'other-package': '^1.0.0',
        },
      },
    },
    {
      description: 'self-dep in devDependencies → filtered out',
      given: {
        declared: {
          name: 'my-package',
          devDependencies: {
            'my-package': '^1.0.0',
            jest: '^29.0.0',
          },
        },
        targetPackageName: 'my-package',
      },
      expect: {
        name: 'my-package',
        devDependencies: {
          jest: '^29.0.0',
        },
      },
    },
    {
      description: 'self-dep in peerDependencies → filtered out',
      given: {
        declared: {
          name: 'my-plugin',
          peerDependencies: {
            'my-plugin': '>=1.0.0',
            react: '^18.0.0',
          },
        },
        targetPackageName: 'my-plugin',
      },
      expect: {
        name: 'my-plugin',
        peerDependencies: {
          react: '^18.0.0',
        },
      },
    },
    {
      description: 'self-dep in optionalDependencies → filtered out',
      given: {
        declared: {
          name: 'my-tool',
          optionalDependencies: {
            'my-tool': '1.0.0',
            fsevents: '^2.0.0',
          },
        },
        targetPackageName: 'my-tool',
      },
      expect: {
        name: 'my-tool',
        optionalDependencies: {
          fsevents: '^2.0.0',
        },
      },
    },
    {
      description: 'different package → preserved',
      given: {
        declared: {
          name: 'other-project',
          dependencies: {
            'sql-dao-generator': '^0.22.0',
          },
        },
        targetPackageName: 'other-project',
      },
      expect: {
        name: 'other-project',
        dependencies: {
          'sql-dao-generator': '^0.22.0',
        },
      },
    },
    {
      description: 'scoped package self-dep → filtered out',
      given: {
        declared: {
          name: '@ehmpathy/sql-dao-generator',
          dependencies: {
            '@ehmpathy/sql-dao-generator': '^0.22.0',
            '@ehmpathy/other-package': '^1.0.0',
          },
        },
        targetPackageName: '@ehmpathy/sql-dao-generator',
      },
      expect: {
        name: '@ehmpathy/sql-dao-generator',
        dependencies: {
          '@ehmpathy/other-package': '^1.0.0',
        },
      },
    },
    {
      description: 'only self-dep in deps → remove deps key entirely',
      given: {
        declared: {
          name: 'lonely-package',
          dependencies: {
            'lonely-package': '^1.0.0',
          },
        },
        targetPackageName: 'lonely-package',
      },
      expect: {
        name: 'lonely-package',
      },
    },
    {
      description: 'no dependencies keys → unchanged',
      given: {
        declared: {
          name: 'simple-package',
          version: '1.0.0',
        },
        targetPackageName: 'simple-package',
      },
      expect: {
        name: 'simple-package',
        version: '1.0.0',
      },
    },
    {
      description: 'self-deps in multiple dep types → all filtered',
      given: {
        declared: {
          name: 'multi-dep-package',
          dependencies: {
            'multi-dep-package': '^1.0.0',
            lodash: '^4.0.0',
          },
          devDependencies: {
            'multi-dep-package': '^1.0.0',
            jest: '^29.0.0',
          },
        },
        targetPackageName: 'multi-dep-package',
      },
      expect: {
        name: 'multi-dep-package',
        dependencies: {
          lodash: '^4.0.0',
        },
        devDependencies: {
          jest: '^29.0.0',
        },
      },
    },
  ];

  TEST_CASES.forEach((testCase) => {
    it(testCase.description, () => {
      const result = filterSelfDepsFromDeclared(testCase.given);
      expect(result).toEqual(testCase.expect);
    });
  });
});
