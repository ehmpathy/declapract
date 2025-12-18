import chalk from 'chalk';

import {
  FileCheckPurpose,
  FileEvaluationResult,
  hasPassed,
  type PracticeDeclaration,
} from '@src/domain.objects';
import { FilePracticeEvaluation } from '@src/domain.objects/FilePracticeEvaluation';
import type { ProjectCheckContext } from '@src/domain.objects/ProjectCheckContext';

import { evaluteProjectAgainstProjectCheckDeclaration } from './evaluateProjectAgainstProjectCheckDeclaration';

export const evaluteProjectAgainstPracticeDeclaration = async ({
  practice,
  project,
}: {
  practice: PracticeDeclaration;
  project: ProjectCheckContext;
}) => {
  // evaluate all of the best practices checks and bad practices checks
  const bestPracticeFileCheckEvaluations = practice.bestPractice
    ? await evaluteProjectAgainstProjectCheckDeclaration({
        practiceRef: `${practice.name}.best-practice`,
        purpose: FileCheckPurpose.BEST_PRACTICE,
        declaration: practice.bestPractice,
        project,
      })
    : [];
  const badPracticeFileCheckEvaluations = (
    await Promise.all(
      practice.badPractices.map((badPractice) =>
        evaluteProjectAgainstProjectCheckDeclaration({
          practiceRef: `${practice.name}.bad-practice.${badPractice.name}`,
          purpose: FileCheckPurpose.BAD_PRACTICE,
          declaration: badPractice,
          project,
        }),
      ),
    )
  ).flat();

  // merge the results per file (i.e., if a file passes best practices (or does not exist there) but fails bad practices, just report it as failed once... but if it exists in either and passes all, then report as passed once)
  const pathsEvaluated = [
    ...new Set(
      [
        ...bestPracticeFileCheckEvaluations,
        ...badPracticeFileCheckEvaluations,
      ].map((evaluation) => evaluation.path),
    ),
  ].sort();
  const evaluations = pathsEvaluated.map((path) => {
    const checks = [
      ...bestPracticeFileCheckEvaluations,
      ...badPracticeFileCheckEvaluations,
    ].filter((check) => check.path === path);
    const result = checks.every(hasPassed)
      ? FileEvaluationResult.PASS
      : FileEvaluationResult.FAIL;
    return new FilePracticeEvaluation({
      path,
      result,
      checks,
      practice,
    });
  });
  console.log(chalk.gray(`  ✓ evaluated practice:${practice.name}`)); // tslint:disable-line: no-console
  return evaluations;
};
