import { FileEvaluationResult, PracticeDeclaration } from '../../../../domain';
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
        projectRootDirectory,
        declaration: practice.bestPractice,
      })
    : [];
  const badPracticeFileCheckEvaluations = (
    await Promise.all(
      practice.badPractices.map((badPractice) =>
        evaluteProjectAgainstProjectCheckDeclaration({
          practiceRef: `${practice.name}.bad-practice.${badPractice.name}`,
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
    const checked = {
      bestPractice: bestPracticeFileCheckEvaluations.filter((check) => check.path === path),
      badPractices: badPracticeFileCheckEvaluations.filter((check) => check.path === path),
    };
    const failedABestPracticeCheck = checked.bestPractice.some((check) => check.result === FileEvaluationResult.FAIL);
    const passedABadPracticeCheck = checked.badPractices.some((check) => check.result === FileEvaluationResult.PASS);
    const result =
      failedABestPracticeCheck || passedABadPracticeCheck // if failed a best practice, failed overall; if passed a bad practice, failed overall
        ? FileEvaluationResult.FAIL
        : FileEvaluationResult.PASS;
    return new FilePracticeEvaluation({
      path,
      result,
      checked,
      practice,
    });
  });
  return evaluations;
};
