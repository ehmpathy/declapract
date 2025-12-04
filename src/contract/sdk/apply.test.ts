import { apply } from '../../logic/commands/apply';
import { executeApply } from './apply';

jest.mock('../../logic/commands/apply');
const applyMock = apply as jest.Mock;

describe('executeApply', () => {
  it('should call the apply command logic', async () => {
    await executeApply({ config: '/some/path/to/use' });
    expect(applyMock).toHaveBeenCalledTimes(1);
    expect(applyMock).toHaveBeenCalledWith({
      usePracticesConfigPath: '/some/path/to/use',
    });
  });
});
