import { UseCaseDeclaration } from '../../domain';
import { UseCasesDeclarationInput } from '../../domain/objects/UseCasesDeclarationInput';
import { readYmlFile } from '../../utils/fileio/readYmlFile';
import { listPathsInDirectory } from '../../utils/filepaths/listPathsInDirectory';
import { UserInputError } from '../UserInputError';
import { readPracticeDeclaration } from './getPracticeDeclaration';

export const readDeclarations = async ({ declarationsDir }: { declarationsDir: string }) => {
  // look at all of the file paths in this directory
  const files = await listPathsInDirectory(declarationsDir);

  // check that there's a `practices` directory
  if (!files.includes('practices'))
    throw new UserInputError('a `practices/` directory must be present in your declarations directory');

  // read practices from each practices directory
  const practiceDirectories = await listPathsInDirectory(`${declarationsDir}/practices`);
  if (!practiceDirectories.length)
    throw new UserInputError('at least one practice needs to be defined in the `practices/` directory');
  const practices = await Promise.all(
    practiceDirectories.map((directory) =>
      readPracticeDeclaration({ declaredPracticeDirectory: `${declarationsDir}/practices/${directory}` }),
    ),
  );

  // check that there's a `use-cases.yml` file
  if (!files.includes('useCases.yml'))
    throw new UserInputError('a `useCases.yml` file must be present in your declarations directory');

  // read and validate the useCases yml file
  const useCasesInput = await (async () => {
    const useCasesYml = await readYmlFile({ filePath: `${declarationsDir}/useCases.yml` });
    try {
      return new UseCasesDeclarationInput(useCasesYml);
    } catch (error) {
      throw new UserInputError('`useCases.yml` file contents failed validation', { potentialSolution: error.message });
    }
  })();

  // now build up the use cases
  const useCases = Object.entries(useCasesInput['use-cases']).map(
    ([name, requestedPractices]) =>
      new UseCaseDeclaration({
        name,
        practices: requestedPractices.map((requestedPracticeKey) => {
          if (!new RegExp('^practice:').test(requestedPracticeKey))
            throw new UserInputError(
              `practice key does not match pattern 'practice:\${practiceName}' for use-case:${name}. key: ${requestedPracticeKey}`,
            );
          const requestedPracticeName = requestedPracticeKey.replace(/^practice:/, '');
          const foundPractice = practices.find((practice) => practice.name === requestedPracticeName);
          if (!foundPractice)
            throw new UserInputError(
              `A use-case specified a practices that was not defined: 'use-case:${name}' specified 'practice:${requestedPracticeName}', but no practice with name '${requestedPracticeName}' has been defined`,
              {
                potentialSolution: 'Have you checked that there is not a typo in the practice name?',
              },
            );
          return foundPractice;
        }),
      }),
  );

  // and return both
  return { useCases, practices };
};
