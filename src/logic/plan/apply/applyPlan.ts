import chalk from 'chalk';
import indentString from 'indent-string';
import { withNot } from 'simple-type-guards';
import { FileActionPlan, hasFailed, isFixableCheck, RequiredAction } from '../../../domain';
import { UnexpectedCodePathError } from '../../UnexpectedCodePathError';
import { getColoredPlanTitle } from '../display/color/getColoredPlanTitle';
import { sortFileCheckEvaluationsByPracticeRef } from '../sortFileCheckEvaluationsByPracticeRef';
import { sortFilePracticeEvaluationsByPracticeName } from '../sortFilePracticeEvaluationsByPracticeName';
import { fixFile } from './fixFile';

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
  // sanity check that the plan has fixable actions
  if (plan.action !== RequiredAction.FIX_AUTOMATIC)
    throw new UnexpectedCodePathError('asked to apply a plan which does not have action FIX_AUTOMATIC specified', {
      plan,
    }); // should have been filtered out by now

  // print out the title for this file
  const title = getColoredPlanTitle({ plan });
  console.log(`  * ${title}`); // tslint:disable-line: no-console

  // for each failed evaluation check, output that we're applying it
  for (const evaluation of plan.evaluations.sort(sortFilePracticeEvaluationsByPracticeName)) {
    // grab the failed, fixable checks
    const failedFixableChecks = evaluation.checks
      .filter(hasFailed)
      .filter(isFixableCheck)
      .sort(sortFileCheckEvaluationsByPracticeRef);

    // apply each of them
    await Promise.all(
      failedFixableChecks.map(async (evaluation) => {
        await fixFile({ evaluation, projectRootDirectory });
        const statusToken = chalk.green('✓');
        const fixabilityToken = chalk.gray('(fix:applied)');
        console.log(indentString(`${statusToken} practice:${evaluation.practiceRef} ${fixabilityToken}`, 4)); // tslint:disable-line: no-console
      }),
    );
  }
};
