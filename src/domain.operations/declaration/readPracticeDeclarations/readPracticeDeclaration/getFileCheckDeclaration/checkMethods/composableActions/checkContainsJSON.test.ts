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
});
