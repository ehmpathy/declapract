import { compile } from '../../logic/commands/compile';
import { executeCompile } from './compile';

jest.mock('../../logic/commands/compile');
const compileMock = compile as jest.Mock;

describe('executeCompile', () => {
  it('should call the compile command logic', async () => {
    await executeCompile({
      sourceDirectory: '/some/path/to/use/src',
      distributionDirectory: '/some/path/to/use/dist',
    });
    expect(compileMock).toHaveBeenCalledTimes(1);
    expect(compileMock).toHaveBeenCalledWith({
      sourceDirectory: '/some/path/to/use/src',
      distributionDirectory: '/some/path/to/use/dist',
    });
  });
});
