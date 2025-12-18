import type { FileActionPlan } from '@src/domain.objects';
import { sortFileActionPlansByPaths } from '@src/domain.operations/usage/plan/sortFileActionPlansByPaths';

import { applyPlan } from './applyPlan';

export const applyPlans = async ({
  plans,
  projectRootDirectory,
}: {
  plans: FileActionPlan[];
  projectRootDirectory: string;
}) => {
  const sortedPlans = sortFileActionPlansByPaths({ plans });
  for (const plan of sortedPlans) {
    await applyPlan({ plan, projectRootDirectory }); // one at a time, sequentially
  }
};
