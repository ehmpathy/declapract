import { displayPlans } from '../display/displayPlans';
import { getPlansForProject } from '../plan/getPlansForProject';
import { readUsePracticesConfig } from '../read/readUsePracticesConfig';
import { UnexpectedCodePathError } from '../UnexpectedCodePathError';

export const plan = async ({ usePracticesConfigPath }: { usePracticesConfigPath: string }) => {
  // read the usage config
  const config = await readUsePracticesConfig({ configPath: usePracticesConfigPath });

  // grab the selected use case's practices
  const useCase = config.declared.useCases.find((useCase) => useCase.name === config.useCase);
  if (!useCase)
    throw new UnexpectedCodePathError(
      'requested use case was not defined on config. should have thrown an error when processing the config by now',
    );

  // get the plans
  const plans = await getPlansForProject({ practices: useCase.practices, projectRootDirectory: config.rootDir });

  // display the plans
  await displayPlans({ plans });
};
