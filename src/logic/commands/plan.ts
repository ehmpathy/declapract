import { displayPlans } from '@src/logic/usage/plan/display/displayPlans';
import { filterPracticeEvaluationsFromPlans } from '@src/logic/usage/plan/filterPracticeEvaluationsFromPlans';
import { getPlansForProject } from '@src/logic/usage/plan/getPlansForProject';
import { readUsePracticesConfig } from '@src/logic/usage/readUsePracticesConfig';

import { getDesiredPractices } from './getScopedPractices';

export const plan = async ({
  usePracticesConfigPath,
  filter,
}: {
  usePracticesConfigPath: string;
  filter?: {
    practiceNames?: string[];
    filePaths?: string[];
  };
}) => {
  // read the usage config
  console.log('🔎 reading configs and declarations...'); // tslint:disable-line: no-console
  const config = await readUsePracticesConfig({
    configPath: usePracticesConfigPath,
  });

  // grab the desired practices
  const practices = getDesiredPractices({ config, filter });

  // get the plans
  console.log('🔬️ evaluating project...'); // tslint:disable-line: no-console
  const plans = await getPlansForProject({
    practices,
    projectRootDirectory: config.rootDir,
    projectVariables: config.variables,
  });

  // filter the plans
  console.log('📖 displaying results...'); // tslint:disable-line: no-console
  const plansToDisplay = await filterPracticeEvaluationsFromPlans({
    plans,
    filter: {
      byPracticeNames: filter?.practiceNames ?? undefined,
      byFilePaths: filter?.filePaths ?? undefined,
    },
  });

  // display the plans
  await displayPlans({ plans: plansToDisplay });
};
