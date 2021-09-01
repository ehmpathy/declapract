import { plan } from '../../logic/commands/plan';
import Declapract from './plan';

jest.mock('../../logic/commands/plan');
const planMock = plan as jest.Mock;

describe('generate', () => {
  it('should call the plan command logic', async () => {
    await Declapract.run(['-c', '/some/path/to/use']);
    expect(planMock).toBeCalledTimes(1);
    expect(planMock).toHaveBeenCalledWith({
      usePracticesConfigPath: '/some/path/to/use',
    });
  });
});
