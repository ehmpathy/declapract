import chalk from 'chalk';
import indentString from 'indent-string';

import {
  type FileActionPlan,
  hasFailed,
  isFixableCheck,
  RequiredAction,
} from '@src/domain';
import { UnexpectedCodePathError } from '@src/logic/UnexpectedCodePathError';
import { getColoredPlanTitle } from '@src/logic/usage/plan/display/color/getColoredPlanTitle';
import { sortFileCheckEvaluationsByPracticeRef } from '@src/logic/usage/plan/sortFileCheckEvaluationsByPracticeRef';
import { sortFilePracticeEvaluationsByPracticeName } from '@src/logic/usage/plan/sortFilePracticeEvaluationsByPracticeName';

import { fixFile } from './fixFile';
import { isWithinPracticeDeclarationDirectory } from './isWithinPracticeDeclarationDirectory';

/**
 * for each "fixable" and "failed" check in the plan, apply the fix
 */
export const applyPlan = async ({
  plan,
  projectRootDirectory,
}: {
  plan: FileActionPlan;
  projectRootDirectory: string;
}) => {
  // guard: never apply fixes to files within practice declaration directories
  // why? because these files define the practices themselves - modifying them would corrupt the source of truth
  if (isWithinPracticeDeclarationDirectory(plan.path)) {
    const warningToken = chalk.yellow('⚠');
    console.log(
      `  ${warningToken} skipped ${plan.path} (within practice declaration directory)`,
    ); // tslint:disable-line: no-console
    return;
  }

  // sanity check that the plan has fixable actions
  if (plan.action !== RequiredAction.FIX_AUTOMATIC)
    throw new UnexpectedCodePathError(
      'asked to apply a plan which does not have action FIX_AUTOMATIC specified',
      {
        plan,
      },
    ); // should have been filtered out by now

  // print out the title for this file
  const title = getColoredPlanTitle({ plan });
  console.log(`  * ${title}`); // tslint:disable-line: no-console

  // for each failed evaluation check, output that we're applying it
  for (const practiceEvaluation of plan.evaluations.sort(
    sortFilePracticeEvaluationsByPracticeName,
  )) {
    // grab the failed, fixable checks
    const failedFixableChecks = practiceEvaluation.checks
      .filter(hasFailed)
      .filter(isFixableCheck)
      .sort(sortFileCheckEvaluationsByPracticeRef);

    // apply each of them, one at a time sequentially
    for (const checkEvaluation of failedFixableChecks) {
      await fixFile({ evaluation: checkEvaluation, projectRootDirectory });
      const statusToken = chalk.green('✓');
      const fixabilityToken = chalk.gray('(fix:applied)');
      console.log(
        indentString(
          `${statusToken} practice:${checkEvaluation.practiceRef} ${fixabilityToken}`,
          4,
        ),
      ); // tslint:disable-line: no-console
    }
  }
};
