import { CheckFileEvaluation, CheckProjectDeclaration } from '../../domain';
import { checkProjectAgainstCheckFileDeclaration } from './checkProjectAgainstCheckFileDeclaration';

export const checkProjectAgainstCheckProjectDeclaration = async ({
  practiceRef,
  projectRootDirectory,
  declaration,
}: {
  practiceRef: string;
  projectRootDirectory: string;
  declaration: CheckProjectDeclaration;
}): Promise<CheckFileEvaluation[]> => {
  // evaluate each declared file check
  const results = (
    await Promise.all(
      declaration.checks.map((check) =>
        checkProjectAgainstCheckFileDeclaration({ practiceRef, projectRootDirectory, check }),
      ),
    )
  ).flat(); // flatten, since each "checkFileDeclaration" may actually apply to more than one file (since the check declarations reference a pathGlob -> glob can specify more than one file)
  return results;
};
