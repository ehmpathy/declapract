import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { readUsePracticesConfig } from './readUsePracticesConfig';

describe('readUsePracticesConfig', () => {
  it('should read usage config specifying locally declared practices, by directory', async () => {
    const config = await readUsePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-service-repo/declapract.use.yml`,
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
      configPath: `${testAssetsDirectoryPath}/example-other-service-repo/declapract.use.yml`,
    });
    expect(config.useCase).toEqual('lambda-service');
    expect(config.variables).toHaveProperty('organizationName');
    expect(config.declared.practices.length);
    expect(config).toMatchSnapshot({
      rootDir: expect.any(String),
      declared: expect.objectContaining({ rootDir: expect.any(String) }),
    });
  });
});
