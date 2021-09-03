import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { validate } from './validate';

const logSpy = jest.spyOn(console, 'log');

describe('plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to plan for an example declarations directory', async () => {
    await validate({
      declarePracticesConfigPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
});
