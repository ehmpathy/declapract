import { validate } from '../../logic/commands/validate';
import Declapract from './validate';

jest.mock('../../logic/commands/validate');
const validateMock = validate as jest.Mock;

describe('generate', () => {
  it('should call the validate command logic', async () => {
    await Declapract.run(['-c', '/some/path/to/use']);
    expect(validateMock).toHaveBeenCalledTimes(1);
    expect(validateMock).toHaveBeenCalledWith({
      declarePracticesConfigPath: '/some/path/to/use',
    });
  });
});
