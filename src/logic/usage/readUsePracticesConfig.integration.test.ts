import shell from 'shelljs';

import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { readUsePracticesConfig } from './readUsePracticesConfig';

describe('readUsePracticesConfig', () => {
  it('should read usage config specifying locally declared practices, by directory', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-1-repo/declapract.use.yml`,
    });
    expect(config.useCase).toEqual('lambda-service');
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
    expect(config.useCase).toEqual('lambda-service');
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });
  it('should read usage config specifying npm module with declarations', async () => {
    // npm install the declarations module
    await shell.cd(`${testAssetsDirectoryPath}/example-service-3-repo`);
    const result = await shell.exec('npm install');
    if (result.code !== 0) throw new Error(result.stderr ?? result.stdout);

    // now read the config
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-3-repo/declapract.use.yml`,
    });
    expect(config.declared.practices.length).toBeGreaterThan(3); // should be atleast 3 defined there
    expect(config.useCase).toEqual('lambda-service');
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
