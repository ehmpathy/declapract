import {
  FileCheckEvaluation,
  FileCheckPurpose,
  ProjectCheckDeclaration,
  ProjectVariablesImplementation,
} from '../../../domain';
import { withDurationReporting } from '../../../utils/wrappers/withDurationReporting';
import { evaluateProjectAgainstFileCheckDeclaration } from './evaluateProjectAgainstFileCheckDeclaration';

export const evaluteProjectAgainstProjectCheckDeclaration = async ({
  practiceRef,
  purpose,
  projectRootDirectory,
  declaration,
  projectVariables,
}: {
  practiceRef: string;
  purpose: FileCheckPurpose;
  projectRootDirectory: string;
  declaration: ProjectCheckDeclaration;
  projectVariables: ProjectVariablesImplementation;
}): Promise<FileCheckEvaluation[]> => {
  // evaluate each declared file check
  const results = (
    await Promise.all(
      declaration.checks.map((check) =>
        withDurationReporting(`evaluateFileCheckDeclaration.${practiceRef}.${check.pathGlob}`, () =>
          evaluateProjectAgainstFileCheckDeclaration({
            practiceRef,
            purpose,
            projectRootDirectory,
            check,
            projectVariables,
          }),
        )(),
      ),
    )
  ).flat(); // flatten, since each "FileCheckDeclaration" may actually apply to more than one file (since the check declarations reference a pathGlob -> glob can specify more than one file)
  return results;
};
