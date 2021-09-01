import { FileActionPlan } from '../../../domain';
import { applyPlan } from './applyPlan';

export const applyPlans = async ({
  plans,
  projectRootDirectory,
}: {
  plans: FileActionPlan[];
  projectRootDirectory: string;
}) => {
  const sortedPlans = plans.sort((a, b) => (a.path < b.path ? -1 : 1));
  for (const plan of sortedPlans) {
    await applyPlan({ plan, projectRootDirectory }); // one at a time, sequentially
  }
};
