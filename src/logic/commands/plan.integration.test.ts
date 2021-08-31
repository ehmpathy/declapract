import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { plan } from './plan';

const logSpy = jest.spyOn(console, 'log');

describe('plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to plan for an example project', async () => {
    await plan({
      usePracticesConfigPath: `${testAssetsDirectoryPath}/example-best-practices-repo/src/examples/lambda-service/declapract.use.yml`,
    });
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
});
