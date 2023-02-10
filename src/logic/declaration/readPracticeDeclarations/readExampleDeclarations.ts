import { ExampleDeclaration } from '../../../domain/objects/ExampleDeclaration';
import { listPathsInDirectory } from '../../../utils/filepaths/listPathsInDirectory';

export const readExampleDeclarations = async ({
  declarationsRootDirectory,
  declaredExamplesDirectory,
}: {
  declarationsRootDirectory: string;
  declaredExamplesDirectory: string;
}) => {
  const exampleDirectories = await listPathsInDirectory({
    directory: declaredExamplesDirectory,
  });
  const examples = exampleDirectories.map((directory) => {
    const name = directory;
    return new ExampleDeclaration({
      name,
      exampleRootDirectory: `${declaredExamplesDirectory}/${directory}`.replace(
        `${declarationsRootDirectory}/`,
        '',
      ),
    });
  });
  return examples;
};
