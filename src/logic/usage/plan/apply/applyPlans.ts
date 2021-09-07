import { FileActionPlan, ProjectVariablesImplementation } from '../../../../domain';
import { sortFileActionPlansByPaths } from '../sortFileActionPlansByPaths';
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
  const sortedPlans = sortFileActionPlansByPaths({ plans });
  for (const plan of sortedPlans) {
    await applyPlan({ plan, projectRootDirectory, projectVariables }); // one at a time, sequentially
  }
};
