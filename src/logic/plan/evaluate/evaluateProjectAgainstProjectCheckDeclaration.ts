import { FileCheckEvaluation, ProjectCheckDeclaration } from '../../../domain';
import { evaluateProjectAgainstFileCheckDeclaration } from './evaluateProjectAgainstFileCheckDeclaration';

export const evaluteProjectAgainstProjectCheckDeclaration = async ({
  practiceRef,
  projectRootDirectory,
  declaration,
}: {
  practiceRef: string;
  projectRootDirectory: string;
  declaration: ProjectCheckDeclaration;
}): Promise<FileCheckEvaluation[]> => {
  // evaluate each declared file check
  const results = (
    await Promise.all(
      declaration.checks.map((check) =>
        evaluateProjectAgainstFileCheckDeclaration({ practiceRef, projectRootDirectory, check }),
      ),
    )
  ).flat(); // flatten, since each "FileCheckDeclaration" may actually apply to more than one file (since the check declarations reference a pathGlob -> glob can specify more than one file)
  return results;
};
