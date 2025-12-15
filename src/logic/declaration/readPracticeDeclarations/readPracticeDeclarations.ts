import { PracticeDeclaration } from '@src/domain';
import { UserInputError } from '@src/logic/UserInputError';
import { listPathsInDirectory } from '@src/utils/filepaths/listPathsInDirectory';

import { readPracticeDeclaration } from './readPracticeDeclaration/readPracticeDeclaration';

export const readPracticeDeclarations = async ({
  declaredPracticesDirectory,
}: {
  declaredPracticesDirectory: string;
}) => {
  const practiceDirectories = await listPathsInDirectory({
    directory: declaredPracticesDirectory,
  });
  if (!practiceDirectories.length)
    throw new UserInputError(
      `at least one practice needs to be defined in the practices directory: '${declaredPracticesDirectory}'`,
    );
  const practicesOrErrors = await Promise.all(
    practiceDirectories.map((directory) =>
      readPracticeDeclaration({
        declaredPracticeDirectory: `${declaredPracticesDirectory}/${directory}`,
      }).catch((error: Error) => {
        console.error(error);
        console.warn(
          'experienced an error while attempting to readPracticeDeclaration ',
          {
            declaredPracticeDirectory: `${declaredPracticesDirectory}/${directory}`,
          },
        );
        return error;
      }),
    ),
  );

  // check if there were any errors
  const errors = practicesOrErrors.filter(
    (practiceOrError): practiceOrError is Error =>
      practiceOrError instanceof Error,
  );

  // if we experienced any errors, throw the last one as an example to help them debug
  if (errors.length) throw errors[0]!;

  // return the practices
  const practices = practicesOrErrors.filter(
    (practiceOrError): practiceOrError is PracticeDeclaration =>
      practiceOrError instanceof PracticeDeclaration,
  );
  return practices;
};
