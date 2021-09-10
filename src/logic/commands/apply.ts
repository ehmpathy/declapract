import { RequiredAction } from '../../domain';
import { UnexpectedCodePathError } from '../UnexpectedCodePathError';
import { applyPlans } from '../usage/plan/apply/applyPlans';
import { filterPracticeEvaluationsFromPlans } from '../usage/plan/filterPracticeEvaluationsFromPlans';
import { getPlansForProject } from '../usage/plan/getPlansForProject';
import { readUsePracticesConfig } from '../usage/readUsePracticesConfig';

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
  const config = await readUsePracticesConfig({ configPath: usePracticesConfigPath });

  // grab the selected use case's practices
  const useCase = config.declared.useCases.find((useCase) => useCase.name === config.useCase);
  if (!useCase)
    throw new UnexpectedCodePathError(
      'requested use case was not defined on config. should have thrown an error when processing the config by now',
    );

  // get plans for this project
  console.log('🔬️ evaluating project...'); // tslint:disable-line: no-console
  const plans = await getPlansForProject({
    practices: useCase.practices,
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
  await applyPlans({ plans: plansToApply, projectRootDirectory: config.rootDir });
};
