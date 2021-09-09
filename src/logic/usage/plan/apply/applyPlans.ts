import { FileActionPlan } from '../../../../domain';
import { sortFileActionPlansByPaths } from '../sortFileActionPlansByPaths';
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
