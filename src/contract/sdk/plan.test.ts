import { plan } from '@src/domain.operations/commands/plan';

import { executePlan } from './plan';

jest.mock('../../domain.operations/commands/plan');
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
