import { validate } from '../../logic/commands/validate';
import { executeValidate } from './validate';

jest.mock('../../logic/commands/validate');
const validateMock = validate as jest.Mock;

describe('executeValidate', () => {
  it('should call the validate command logic', async () => {
    await executeValidate({ config: '/some/path/to/use' });
    expect(validateMock).toHaveBeenCalledTimes(1);
    expect(validateMock).toHaveBeenCalledWith({
      declarePracticesConfigPath: '/some/path/to/use',
    });
  });
});
