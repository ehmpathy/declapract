import { RequiredAction } from '@src/domain.objects';
import { applyPlans } from '@src/domain.operations/usage/plan/apply/applyPlans';
import { filterPracticeEvaluationsFromPlans } from '@src/domain.operations/usage/plan/filterPracticeEvaluationsFromPlans';
import { getPlansForProject } from '@src/domain.operations/usage/plan/getPlansForProject';
import { readUsePracticesConfig } from '@src/domain.operations/usage/readUsePracticesConfig';

import { getDesiredPractices } from './getScopedPractices';

export const apply = async ({
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

  // get plans for this project
  console.log('🔬️ evaluating project...'); // tslint:disable-line: no-console
  const plans = await getPlansForProject({
    practices,
    projectRootDirectory: config.rootDir,
    projectVariables: config.variables,
  });

  // filter out the practices to the ones that can be automatically applied + for the practices specified
  const plansToApply = (
    await filterPracticeEvaluationsFromPlans({
      plans,
      filter: {
        byFixable: true,
        byPracticeNames: filter?.practiceNames ?? undefined,
        byFilePaths: filter?.filePaths ?? undefined,
      },
    })
  ).filter((plan) => plan.action === RequiredAction.FIX_AUTOMATIC);

  // display the plans
  console.log('🔧 applying fixes...'); // tslint:disable-line: no-console
  await applyPlans({
    plans: plansToApply,
    projectRootDirectory: config.rootDir,
  });
};
