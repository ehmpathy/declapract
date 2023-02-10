import { readDeclarePracticesConfig } from '../declaration/readDeclarePracticesConfig';

export const validate = async ({
  declarePracticesConfigPath,
}: {
  declarePracticesConfigPath: string;
}) => {
  // read the usage config
  await readDeclarePracticesConfig({ configPath: declarePracticesConfigPath });

  // check that each use case's example passes it's checks; // TODO
  // await Promise.all(
  //   config.useCases.map(async (useCase) => {
  //     if (!useCase.example) return;
  //     const evaluations = await evaluateProjectAgainstPracticeDeclarations({
  //       practices: useCase.practices,
  //       projectRootDirectory: useCase.example.projectRootDirectory,
  //       projectVariables: mockProjectVariablesProxyObject,
  //     });
  //   }),
  // );

  // if it passes all of the above, then its good to go
  console.log('Declarations have validated successfully 🎉'); // tslint:disable-line no-console
};
