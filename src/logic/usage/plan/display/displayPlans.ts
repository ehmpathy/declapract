import type { FileActionPlan } from '@src/domain';
import { sortFileActionPlansByPaths } from '@src/logic/usage/plan/sortFileActionPlansByPaths';

import { displayPlan } from './displayPlan';

export const displayPlans = async ({ plans }: { plans: FileActionPlan[] }) => {
  const sortedPlans = sortFileActionPlansByPaths({ plans });
  for (const plan of sortedPlans) {
    await displayPlan({ plan }); // one at a time, sequentially
  }
};
