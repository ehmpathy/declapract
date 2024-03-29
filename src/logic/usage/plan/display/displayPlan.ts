import chalk from 'chalk';
import indentString from 'indent-string';

import {
  FileActionPlan,
  hasFailed,
  isFixableCheck,
  RequiredAction,
} from '../../../../domain';
import { sortFileCheckEvaluationsByPracticeRef } from '../sortFileCheckEvaluationsByPracticeRef';
import { getColoredPlanTitle } from './color/getColoredPlanTitle';

export const displayPlan = async ({ plan }: { plan: FileActionPlan }) => {
  // print out the title for this file
  const title = getColoredPlanTitle({ plan });
  console.log(`  * ${title}`); // tslint:disable-line: no-console

  // if there is nothing to do, then don't show more details for this file
  if (plan.action === RequiredAction.NO_CHANGE) return;

  // if there was any failed evaluations, display each practice and show each practice that failed and why
  plan.evaluations.filter(hasFailed).forEach((evaluation) => {
    // display the reasons of the practices that failed
    evaluation.checks
      .filter(hasFailed)
      .sort(sortFileCheckEvaluationsByPracticeRef)
      .forEach((failedCheck) => {
        const statusToken = isFixableCheck(failedCheck)
          ? chalk.yellow('✕')
          : chalk.red('✕');
        const fixabilityToken = isFixableCheck(failedCheck)
          ? chalk.gray('(fix:appliable)')
          : '';
        console.log(
          indentString(
            `${statusToken} practice:${failedCheck.practiceRef} ${fixabilityToken}`,
            4,
          ),
        ); // tslint:disable-line: no-console
        if (failedCheck.reason)
          console.log(indentString(failedCheck.reason, 6), '\n'); // tslint:disable-line: no-console
      });
  });
};
