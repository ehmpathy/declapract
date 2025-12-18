import { validate } from '@src/domain.operations/commands/validate';

import { executeValidate } from './validate';

jest.mock('../../domain.operations/commands/validate');
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
