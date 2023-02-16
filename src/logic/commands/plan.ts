import { UnexpectedCodePathError } from '../UnexpectedCodePathError';
import { displayPlans } from '../usage/plan/display/displayPlans';
import { filterPracticeEvaluationsFromPlans } from '../usage/plan/filterPracticeEvaluationsFromPlans';
import { getPlansForProject } from '../usage/plan/getPlansForProject';
import { readUsePracticesConfig } from '../usage/readUsePracticesConfig';

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

  // grab the selected use case's practices
  const useCase = config.declared.useCases.find(
    (thisUseCase) => thisUseCase.name === config.useCase,
  );
  if (!useCase)
    throw new UnexpectedCodePathError(
      'requested use case was not defined on config. should have thrown an error when processing the config by now',
    );

  // get the plans
  console.log('🔬️ evaluating project...'); // tslint:disable-line: no-console
  const plans = await getPlansForProject({
    practices: useCase.practices.filter(
      (practice) =>
        filter?.practiceNames
          ? filter?.practiceNames.includes(practice.name) // if practice.name filter was defined, ensure practice.name is included
          : true, // otherwise, all are included
    ),
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
