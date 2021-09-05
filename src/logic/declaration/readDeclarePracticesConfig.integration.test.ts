import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { readDeclarePracticesConfig } from './readDeclarePracticesConfig';

describe('readDeclarePracticesConfig', () => {
  it('should be able to read a declared practices from example declarations repo config', async () => {
    const config = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    // console.log(config);
    expect(config.practices.length).toBeGreaterThanOrEqual(7);
    expect(config.useCases.length).toEqual(2);
    expect(config).toMatchSnapshot({ rootDir: expect.any(String) }); // log an example
  });
});
