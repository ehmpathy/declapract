import { plan } from '../../logic/commands/plan';
import { executePlan } from './plan';

jest.mock('../../logic/commands/plan');
const planMock = plan as jest.Mock;

describe('executePlan', () => {
  it('should call the plan command logic', async () => {
    await executePlan({ config: '/some/path/to/use' });
    expect(planMock).toHaveBeenCalledTimes(1);
    expect(planMock).toHaveBeenCalledWith({
      usePracticesConfigPath: '/some/path/to/use',
    });
  });
});
