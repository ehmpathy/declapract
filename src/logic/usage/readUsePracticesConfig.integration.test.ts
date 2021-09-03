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
  it.skip('should read usage config specifying remote git repo', async () => {
    // TODO: fix this test on github actions cicd machine; probably will need to ssh into the build instance to debug, not enough time right now
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
        rootDir: expect.stringContaining('example-service-3-repo/.declapract/best-practices-typescript'), // should reference the `.declapract` dir of the example project (since that's where we clone git repos into)
      }),
    });
  });
});
