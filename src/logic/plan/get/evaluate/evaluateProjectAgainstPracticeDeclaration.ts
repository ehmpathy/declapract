import { FileCheckContext, FileEvaluationResult, hasPassed, PracticeDeclaration } from '../../../../domain';
import { FilePracticeEvaluation } from '../../../../domain/objects/FilePracticeEvaluation';
import { evaluteProjectAgainstProjectCheckDeclaration } from './evaluateProjectAgainstProjectCheckDeclaration';

export const evaluteProjectAgainstPracticeDeclaration = async ({
  practice,
  projectRootDirectory,
}: {
  practice: PracticeDeclaration;
  projectRootDirectory: string;
}) => {
  // evaluate all of the best practices checks and bad practices checks
  const bestPracticeFileCheckEvaluations = practice.bestPractice
    ? await evaluteProjectAgainstProjectCheckDeclaration({
        practiceRef: `${practice.name}.best-practice`,
        context: FileCheckContext.BEST_PRACTICE,
        projectRootDirectory,
        declaration: practice.bestPractice,
      })
    : [];
  const badPracticeFileCheckEvaluations = (
    await Promise.all(
      practice.badPractices.map((badPractice) =>
        evaluteProjectAgainstProjectCheckDeclaration({
          practiceRef: `${practice.name}.bad-practice.${badPractice.name}`,
          context: FileCheckContext.BAD_PRACTICE,
          projectRootDirectory,
          declaration: badPractice,
        }),
      ),
    )
  ).flat();

  // merge the results per file (i.e., if a file passes best practices (or does not exist there) but fails bad practices, just report it as failed once... but if it exists in either and passes all, then report as passed once)
  const pathsEvaluated = [
    ...new Set(
      [...bestPracticeFileCheckEvaluations, ...badPracticeFileCheckEvaluations].map((evaluation) => evaluation.path),
    ),
  ].sort();
  const evaluations = pathsEvaluated.map((path) => {
    const checks = [...bestPracticeFileCheckEvaluations, ...badPracticeFileCheckEvaluations].filter(
      (check) => check.path === path,
    );
    const result = checks.every(hasPassed) ? FileEvaluationResult.PASS : FileEvaluationResult.FAIL;
    return new FilePracticeEvaluation({
      path,
      result,
      checks,
      practice,
    });
  });
  return evaluations;
};
