import type { FileActionPlan } from '@src/domain.objects';
import { sortFileActionPlansByPaths } from '@src/domain.operations/usage/plan/sortFileActionPlansByPaths';

import { displayPlan } from './displayPlan';

export const displayPlans = async ({ plans }: { plans: FileActionPlan[] }) => {
  const sortedPlans = sortFileActionPlansByPaths({ plans });
  for (const plan of sortedPlans) {
    await displayPlan({ plan }); // one at a time, sequentially
  }
};
