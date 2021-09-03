import { FileActionPlan, ProjectVariablesImplementation } from '../../../../domain';
import { applyPlan } from './applyPlan';

export const applyPlans = async ({
  plans,
  projectRootDirectory,
  projectVariables,
}: {
  plans: FileActionPlan[];
  projectRootDirectory: string;
  projectVariables: ProjectVariablesImplementation;
}) => {
  const sortedPlans = plans.sort((a, b) => (a.path < b.path ? -1 : 1));
  for (const plan of sortedPlans) {
    await applyPlan({ plan, projectRootDirectory, projectVariables }); // one at a time, sequentially
  }
};
