import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';
import { log } from '@src/utils/logger';

import { plan } from './plan';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => log.debug); // swap to log debug so its not displaying during tests by default

describe('plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to plan for an example project', async () => {
    await plan({
      usePracticesConfigPath: `${testAssetsDirectoryPath}/example-best-practices-repo/src/examples/lambda-service/declapract.use.yml`,
    });
    // filter out duration lines which vary between runs
    const callsWithoutDurations = logSpy.mock.calls.filter(
      (call) =>
        !call.some((arg) => typeof arg === 'string' && arg.includes('> took')),
    );
    expect(callsWithoutDurations).toMatchSnapshot();
  });
});
