import { compile } from '../../logic/commands/compile';
import Declapract from './compile';

jest.mock('../../logic/commands/compile');
const compileMock = compile as jest.Mock;

describe('compile', () => {
  it('should call the compile command logic', async () => {
    await Declapract.run(['-s', '/some/path/to/use/src', '-d', '/some/path/to/use/dist']);
    expect(compileMock).toBeCalledTimes(1);
    expect(compileMock).toHaveBeenCalledWith({
      sourceDirectory: '/some/path/to/use/src',
      distributionDirectory: '/some/path/to/use/dist',
    });
  });
});
