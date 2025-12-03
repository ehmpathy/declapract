import type {
  FileCheckEvaluation,
  FileCheckPurpose,
  ProjectCheckDeclaration,
} from '../../../domain';
import type { ProjectCheckContext } from '../../../domain/objects/ProjectCheckContext';
import { withDurationReporting } from '../../../utils/wrappers/withDurationReporting';
import { evaluateProjectAgainstFileCheckDeclaration } from './evaluateProjectAgainstFileCheckDeclaration';

export const evaluteProjectAgainstProjectCheckDeclaration = async ({
  practiceRef,
  purpose,
  project,
  declaration,
}: {
  practiceRef: string;
  purpose: FileCheckPurpose;
  project: ProjectCheckContext;
  declaration: ProjectCheckDeclaration;
}): Promise<FileCheckEvaluation[]> => {
  // evaluate each declared file check
  const results = (
    await Promise.all(
      declaration.checks.map((check) =>
        withDurationReporting(
          `evaluateFileCheckDeclaration.${practiceRef}.${check.pathGlob}`,
          () =>
            evaluateProjectAgainstFileCheckDeclaration({
              practiceRef,
              project,
              purpose,
              check,
            }),
        )(),
      ),
    )
  ).flat(); // flatten, since each "FileCheckDeclaration" may actually apply to more than one file (since the check declarations reference a pathGlob -> glob can specify more than one file)
  return results;
};
