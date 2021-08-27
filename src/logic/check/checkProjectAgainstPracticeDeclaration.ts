import { CheckFileEvaluationResult, PracticeDeclaration, PracticeEvaluation } from '../../domain';
import { checkProjectAgainstCheckProjectDeclaration } from './checkProjectAgainstCheckProjectDeclaration';

export const checkProjectAgainstPracticeDeclaration = async ({
  practice,
  projectRootDirectory,
}: {
  practice: PracticeDeclaration;
  projectRootDirectory: string;
}) => {
  // evaluate all of the best practices checks and bad practices checks
  const bestPracticeCheckFileEvaluations = practice.bestPractice
    ? await checkProjectAgainstCheckProjectDeclaration({
        practiceRef: `${practice.name}.best-practice`,
        projectRootDirectory,
        declaration: practice.bestPractice,
      })
    : [];
  const badPracticeCheckFileEvaluations = (
    await Promise.all(
      practice.badPractices.map((badPractice) =>
        checkProjectAgainstCheckProjectDeclaration({
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
      [...bestPracticeCheckFileEvaluations, ...badPracticeCheckFileEvaluations].map((evaluation) => evaluation.path),
    ),
  ].sort();
  const evaluated = pathsEvaluated.map((path) => {
    const checkedFor = {
      bestPractice: bestPracticeCheckFileEvaluations.filter((check) => check.path === path),
      badPractices: badPracticeCheckFileEvaluations.filter((check) => check.path === path),
    };
    const failedABestPracticeCheck = checkedFor.bestPractice.some(
      (check) => check.result === CheckFileEvaluationResult.FAIL,
    );
    const passedABadPracticeCheck = checkedFor.badPractices.some(
      (check) => check.result === CheckFileEvaluationResult.PASS,
    );
    const result =
      failedABestPracticeCheck || passedABadPracticeCheck // if failed a best practice, failed overall; if passed a bad practice, failed overall
        ? CheckFileEvaluationResult.FAIL
        : CheckFileEvaluationResult.PASS;
    return { path, result, checked: checkedFor };
  });

  // and return a practice evaluation
  return new PracticeEvaluation({
    practice,
    evaluated,
  });
};
