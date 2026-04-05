import { checkContainsJSON } from './checkContainsJSON';

describe('checkContainsJSON', () => {
  it('should return nothing when the found json contains the declared json', () => {
    const result = checkContainsJSON({
      declaredContents: JSON.stringify({
        name: 'svc-of-awesomeness',
        scripts: { test: 'npm run test:lint && npm run test:unit' },
      }),
      foundContents: JSON.stringify({
        name: 'svc-of-awesomeness',
        private: true,
        scripts: {
          deploy: 'npm run deploy:release',
          test: 'npm run test:lint && npm run test:unit',
          preversion: 'npm run test',
        },
      }),
    });
    expect(result).not.toBeDefined();
  });
  it('should throw an error with a good looking diff when found json does not contain the declared json', () => {
    try {
      checkContainsJSON({
        declaredContents: JSON.stringify({
          name: 'svc-of-awesomeness',
          scripts: { test: 'npm run test:lint && npm run test:unit' },
        }),
        foundContents: JSON.stringify({
          name: 'svc-awesomeness',
          private: true,
          scripts: {
            deploy: 'npm run deploy:release',
            test: 'npm run test:lint && npm run test:integration',
            preversion: 'npm run test',
          },
        }),
      });
      fail('should not reach here');
    } catch (error) {
      // console.log(error.message);
      expect((error as Error).message).toContain('toContain');
      expect((error as Error).message).toMatchSnapshot(); // log example of it
    }
  });
  it('should return nothing when found json contains the declared json after evaluating check expressions', () => {
    const result = checkContainsJSON({
      declaredContents: JSON.stringify({
        name: 'svc-of-awesomeness',
        version: "@declapract{check.minVersion('1.0.0')}",
        devDependencies: {
          typescript: "@declapract{check.minVersion('4.0.0')}",
        },
      }),
      foundContents: JSON.stringify({
        name: 'svc-of-awesomeness',
        version: '1.8.21',
        private: true,
        devDependencies: {
          prettier: '2.1.0',
          typescript: '8.3.1',
        },
      }),
    });
    expect(result).not.toBeDefined();
  });
  it('should throw an error with a good looking diff when found json does not contain the declared json after evaluating check expressions', () => {
    try {
      checkContainsJSON({
        declaredContents: JSON.stringify({
          name: 'svc-of-awesomeness',
          version: "@declapract{check.minVersion('1.0.0')}",
          devDependencies: {
            typescript: "@declapract{check.minVersion('4.0.0')}",
          },
        }),
        foundContents: JSON.stringify({
          name: 'svc-of-awesomeness',
          version: '0.8.21',
          private: true,
          devDependencies: {
            prettier: '2.1.0',
            typescript: '3.3.1',
          },
        }),
      });
      fail('should not reach here');
    } catch (error) {
      // console.log(error.message);
      expect((error as Error).message).toContain('toContain');
      expect((error as Error).message).toMatchSnapshot(); // log example of it
    }
  });
  it('should return nothing when found json contains linked version for minVersion check expression', () => {
    const result = checkContainsJSON({
      declaredContents: JSON.stringify({
        name: 'the-package-itself',
        dependencies: {
          'the-package-itself': "@declapract{check.minVersion('1.0.0')}",
        },
      }),
      foundContents: JSON.stringify({
        name: 'the-package-itself',
        dependencies: {
          'the-package-itself': 'link:.',
        },
      }),
    });
    expect(result).not.toBeDefined();
  });
  it('should return nothing when found json contains linked version with relative path for minVersion check expression', () => {
    const result = checkContainsJSON({
      declaredContents: JSON.stringify({
        name: 'monorepo-package',
        devDependencies: {
          'shared-utils': "@declapract{check.minVersion('2.0.0')}",
        },
      }),
      foundContents: JSON.stringify({
        name: 'monorepo-package',
        devDependencies: {
          'shared-utils': 'link:../shared-utils',
        },
      }),
    });
    expect(result).not.toBeDefined();
  });

  // self-dep filtering tests
  describe('self-dep filtering', () => {
    it('should pass when self-dep is absent and targetPackageName is provided', () => {
      // declared wants sql-dao-generator dep, but target IS sql-dao-generator
      // so the self-dep should be filtered from comparison
      const result = checkContainsJSON({
        declaredContents: JSON.stringify({
          name: 'sql-dao-generator',
          dependencies: {
            'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
            lodash: '^4.0.0',
          },
        }),
        foundContents: JSON.stringify({
          name: 'sql-dao-generator',
          dependencies: {
            lodash: '^4.0.0',
          },
        }),
        targetPackageName: 'sql-dao-generator',
      });
      expect(result).not.toBeDefined();
    });

    it('should pass when self-dep exists with different version and targetPackageName is provided', () => {
      // target has an older version of itself, but self-dep check should be skipped
      const result = checkContainsJSON({
        declaredContents: JSON.stringify({
          name: 'my-package',
          devDependencies: {
            'my-package': "@declapract{check.minVersion('2.0.0')}",
            jest: '^29.0.0',
          },
        }),
        foundContents: JSON.stringify({
          name: 'my-package',
          devDependencies: {
            'my-package': '1.0.0', // older than declared, but should pass
            jest: '^29.0.0',
          },
        }),
        targetPackageName: 'my-package',
      });
      expect(result).not.toBeDefined();
    });

    it('should still fail when different package is absent (self-dep filter does not affect others)', () => {
      try {
        checkContainsJSON({
          declaredContents: JSON.stringify({
            name: 'sql-dao-generator',
            dependencies: {
              'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
              'domain-objects': "@declapract{check.minVersion('1.0.0')}",
            },
          }),
          foundContents: JSON.stringify({
            name: 'sql-dao-generator',
            dependencies: {
              // domain-objects is absent!
            },
          }),
          targetPackageName: 'sql-dao-generator',
        });
        fail('should not reach here');
      } catch (error) {
        expect((error as Error).message).toContain('toContain');
        expect((error as Error).message).toContain('domain-objects');
      }
    });

    it('should behave normally (fail) when targetPackageName is not provided', () => {
      // without targetPackageName, self-dep is NOT filtered
      try {
        checkContainsJSON({
          declaredContents: JSON.stringify({
            name: 'sql-dao-generator',
            dependencies: {
              'sql-dao-generator': "@declapract{check.minVersion('0.22.0')}",
            },
          }),
          foundContents: JSON.stringify({
            name: 'sql-dao-generator',
            dependencies: {},
          }),
          // no targetPackageName
        });
        fail('should not reach here');
      } catch (error) {
        expect((error as Error).message).toContain('toContain');
      }
    });
  });
});
