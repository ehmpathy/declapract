import { listPathsInDirectory } from '../../../utils/filepaths/listPathsInDirectory';
import { UserInputError } from '../../UserInputError';
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
  const practices = await Promise.all(
    practiceDirectories.map((directory) =>
      readPracticeDeclaration({
        declaredPracticeDirectory: `${declaredPracticesDirectory}/${directory}`,
      }),
    ),
  );
  return practices;
};
