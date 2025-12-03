import type { FileActionPlan } from '../../../../domain';
import { sortFileActionPlansByPaths } from '../sortFileActionPlansByPaths';
import { displayPlan } from './displayPlan';

export const displayPlans = async ({ plans }: { plans: FileActionPlan[] }) => {
  const sortedPlans = sortFileActionPlansByPaths({ plans });
  for (const plan of sortedPlans) {
    await displayPlan({ plan }); // one at a time, sequentially
  }
};
