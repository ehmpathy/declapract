import { ExampleDeclaration } from '../../../domain/objects/ExampleDeclaration';
import { listPathsInDirectory } from '../../../utils/filepaths/listPathsInDirectory';

export const readExampleDeclarations = async ({ declaredExamplesDirectory }: { declaredExamplesDirectory: string }) => {
  const exampleDirectories = await listPathsInDirectory(declaredExamplesDirectory);
  const examples = exampleDirectories.map((directory) => {
    const name = directory;
    return new ExampleDeclaration({
      name,
    });
  });
  return examples;
};
