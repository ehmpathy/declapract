import { withNot } from 'type-fns';

import {
  type FilePracticeEvaluation,
  hasPassed,
  isFixablePractice,
  RequiredAction,
} from '../../../domain';

/**
 * returns what the required action is for a file, based on all of the evaluations for that file
 */
export const getRequiredActionForFile = ({
  evaluations,
}: {
  evaluations: FilePracticeEvaluation[];
}) => {
  // if the file passed all of the practice evaluations, then no change
  const passedAll = evaluations.every(hasPassed);
  if (passedAll) return RequiredAction.NO_CHANGE; // nothing to do if passed everything

  // if the file failed some evaluations, see if all of the failed ones are fixable
  const failedEvaluations = evaluations.filter(withNot(hasPassed));
  const allFailedEvaluationsAreAutomaticallyFixable =
    failedEvaluations.every(isFixablePractice);
  if (allFailedEvaluationsAreAutomaticallyFixable)
    return RequiredAction.FIX_AUTOMATIC;
  return RequiredAction.FIX_MANUAL;
};
