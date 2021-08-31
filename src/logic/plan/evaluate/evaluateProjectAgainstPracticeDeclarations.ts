import { PracticeDeclaration } from '../../../domain';
import { FilePracticeEvaluation } from '../../../domain/objects/FilePracticeEvaluation';
import { evaluteProjectAgainstPracticeDeclaration } from './evaluateProjectAgainstPracticeDeclaration';

/**
 * given:
 * - practice declarations
 * - directory to project
 *
 * does:
 * - check that the project conforms to the practices specified
 *
 * note: not checking against use case specifically because we may be asked to apply multiple use cases to the same project
 */
export const evaluteProjectAgainstPracticeDeclarations = async ({
  practices,
  projectRootDirectory,
}: {
  practices: PracticeDeclaration[];
  projectRootDirectory: string;
}): Promise<FilePracticeEvaluation[]> => {
  return (
    await Promise.all(
      practices.map((practice) => evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory })),
    )
  ).flat();
};
