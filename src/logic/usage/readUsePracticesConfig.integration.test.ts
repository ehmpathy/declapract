import shell from 'shelljs';

import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { readUsePracticesConfig } from './readUsePracticesConfig';

describe('readUsePracticesConfig', () => {
  it('should read usage config specifying locally declared practices, by directory', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-1-repo/declapract.use.yml`,
    });
    expect(config.scope.usecase).toEqual('lambda-service');
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });
  it('should read usage config specifying locally declared practices, by custom config path', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-2-repo/declapract.use.yml`,
    });
    expect(config.scope.usecase).toEqual('lambda-service');
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });
  it('should read usage config with explicit practices scope', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-project-passes-uses-practices-directly/declapract.use.yml`,
    });
    expect(config.scope.usecase).toEqual('lambda-service');
    expect(config.scope.practices).toEqual([
      'cicd-common',
      'conventional-commits',
      'husky',
    ]);
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });
  it('should read usage config with exclusively practices scope', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-project-passes-uses-practices-exclusively/declapract.use.yml`,
    });
    expect(config.scope.usecase).toEqual(null);
    expect(config.scope.practices).toEqual([
      'cicd-common',
      'conventional-commits',
      'husky',
    ]);
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });

  // TODO: make this test work again, after we create a simple declapract package for testing (live ones get too many type errors w/ this project's settings + being nested in src/)
  it.skip('should read usage config specifying npm module with declarations', async () => {
    // npm install the declarations module
    await shell.cd(`${testAssetsDirectoryPath}/example-service-3-repo`);
    const result = await shell.exec('npm install');
    if (result.code !== 0) throw new Error(result.stderr ?? result.stdout);

    // now read the config
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-3-repo/declapract.use.yml`,
    });
    expect(config.declared.practices.length).toBeGreaterThan(3); // should be atleast 3 defined there
    expect(config.scope.usecase).toEqual('lambda-service');
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({
        rootDir: expect.stringContaining(
          'example-service-3-repo/node_modules/best-practices-typescript',
        ), // should reference the `.declapract` dir of the example project (since that's where we clone git repos into)
      }),
    });
  });
});
