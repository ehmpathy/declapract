import fs from 'fs';
import path from 'path';
import { given, then, when } from 'test-fns';

import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';
import { apply } from '@src/domain.operations/commands/apply';

describe('check.minVersion integration', () => {
  given('declarations with normal check.minVersion expressions', () => {
    const projectDir = path.join(
      testAssetsDirectoryPath,
      'example-project-with-minversion',
    );
    const packageJsonPath = path.join(projectDir, 'package.json');
    const originalPackageJson = {
      name: 'test-project',
      version: '1.0.0',
      description: 'should not be modified',
      devDependencies: {
        typescript: '4.0.0', // below minVersion 5.0.0
        jest: '30.0.0', // above minVersion 29.0.0
        eslint: '8.0.0', // not in declarations
      },
    };

    beforeEach(() => {
      // reset package.json before each test
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(originalPackageJson, null, 2),
      );
    });

    when('apply is invoked', () => {
      then(
        'it should only update keys that fail the minVersion check',
        async () => {
          await apply({
            usePracticesConfigPath: path.join(projectDir, 'declapract.use.yml'),
          });

          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );

          // typescript was below minVersion, should be updated to minVersion
          expect(packageJson.devDependencies.typescript).toEqual('5.0.0');

          // jest was above minVersion, should be preserved
          expect(packageJson.devDependencies.jest).toEqual('30.0.0');

          // eslint was not in declarations, should be preserved
          expect(packageJson.devDependencies.eslint).toEqual('8.0.0');

          // other fields should be preserved
          expect(packageJson.description).toEqual('should not be modified');
        },
      );
    });
  });

  given('declarations with .ifInstalled() modifier', () => {
    const projectDir = path.join(
      testAssetsDirectoryPath,
      'example-project-with-ifinstalled-absent',
    );
    const packageJsonPath = path.join(projectDir, 'package.json');
    const originalPackageJson = {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        lodash: '4.17.21', // unrelated dep
      },
    };

    beforeEach(() => {
      // reset package.json before each test
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(originalPackageJson, null, 2),
      );
    });

    when('apply is invoked', () => {
      then(
        'it should not add dependencies that are not present (ifInstalled behavior)',
        async () => {
          await apply({
            usePracticesConfigPath: path.join(projectDir, 'declapract.use.yml'),
          });

          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );

          // cache deps should NOT be added (ifInstalled skips absent deps)
          expect(
            packageJson.dependencies['simple-in-memory-cache'],
          ).toBeUndefined();
          expect(
            packageJson.dependencies['simple-on-disk-cache'],
          ).toBeUndefined();
          expect(packageJson.dependencies['with-simple-cache']).toBeUndefined();

          // unrelated dep should be preserved
          expect(packageJson.dependencies.lodash).toEqual('4.17.21');
        },
      );
    });
  });

  given('declarations with .ifInstalled() modifier and dep present', () => {
    const projectDir = path.join(
      testAssetsDirectoryPath,
      'example-project-with-ifinstalled-present',
    );
    const packageJsonPath = path.join(projectDir, 'package.json');
    const originalPackageJson = {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'simple-in-memory-cache': '0.3.0', // below minVersion 0.4.3
        lodash: '4.17.21', // unrelated dep
      },
    };

    beforeEach(() => {
      // reset package.json before each test
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(originalPackageJson, null, 2),
      );
    });

    when('apply is invoked', () => {
      then(
        'it should update the dep that is present and below minVersion',
        async () => {
          await apply({
            usePracticesConfigPath: path.join(projectDir, 'declapract.use.yml'),
          });

          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );

          // simple-in-memory-cache was present and below minVersion, should be updated
          expect(packageJson.dependencies['simple-in-memory-cache']).toEqual(
            '0.4.3',
          );

          // other cache deps should NOT be added (ifInstalled skips absent deps)
          expect(
            packageJson.dependencies['simple-on-disk-cache'],
          ).toBeUndefined();
          expect(packageJson.dependencies['with-simple-cache']).toBeUndefined();

          // unrelated dep should be preserved
          expect(packageJson.dependencies.lodash).toEqual('4.17.21');
        },
      );
    });
  });

  given('declarations with unsupported .ifPresent() modifier', () => {
    const projectDir = path.join(
      testAssetsDirectoryPath,
      'example-project-with-ifpresent',
    );
    const packageJsonPath = path.join(projectDir, 'package.json');
    const originalPackageJson = {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'simple-in-memory-cache': '0.3.0',
      },
    };

    beforeEach(() => {
      // reset package.json before each test
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(originalPackageJson, null, 2),
      );
    });

    when('apply is invoked', () => {
      then('it should fail fast with helpful error', async () => {
        let caught: Error | null = null;
        try {
          await apply({
            usePracticesConfigPath: path.join(projectDir, 'declapract.use.yml'),
          });
        } catch (error) {
          caught = error as Error;
        }

        // should have thrown
        expect(caught).not.toBeNull();
        expect(caught?.message).toContain('unsupported declapract modifier');
        expect(caught?.message).toContain('.ifPresent()');
      });

      then('package.json should not be corrupted', () => {
        // package.json should not contain raw declapract expressions
        const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
        expect(packageJson).not.toContain('@declapract');
        expect(packageJson).not.toContain('check.minVersion');
      });
    });
  });
});
