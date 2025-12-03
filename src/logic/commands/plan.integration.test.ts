import { log } from '../../utils/logger';
import { testAssetsDirectoryPath } from '../.test.assets/dirPath';
import { plan } from './plan';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => log.debug); // swap to log debug so its not displaying during tests by default

describe('plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to plan for an example project', async () => {
    await plan({
      usePracticesConfigPath: `${testAssetsDirectoryPath}/example-best-practices-repo/src/examples/lambda-service/declapract.use.yml`,
    });
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
});
