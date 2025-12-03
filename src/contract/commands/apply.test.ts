import { apply } from '../../logic/commands/apply';
import Declapract from './apply';

jest.mock('../../logic/commands/apply');
const applyMock = apply as jest.Mock;

describe('generate', () => {
  it('should call the apply command logic', async () => {
    await Declapract.run(['-c', '/some/path/to/use']);
    expect(applyMock).toHaveBeenCalledTimes(1);
    expect(applyMock).toHaveBeenCalledWith({
      usePracticesConfigPath: '/some/path/to/use',
    });
  });
});
