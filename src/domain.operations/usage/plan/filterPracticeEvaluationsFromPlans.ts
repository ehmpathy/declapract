import { isPresent } from 'type-fns';

import { FileActionPlan, isFixablePractice } from '@src/domain.objects';

import { getRequiredActionForFile } from './getRequiredActionForFile';

export const filterPracticeEvaluationsFromPlans = async ({
  plans,
  filter,
}: {
  plans: FileActionPlan[];
  filter: {
    byPracticeNames?: string[];
    byFilePaths?: string[];
    byFixable?: boolean;
  };
}) => {
  // define initial set of plans
  let filteredPlans = plans;

  // apply practice name filter, if asked for
  if (filter.byPracticeNames)
    filteredPlans = filteredPlans
      .map((plan) => {
        const filteredEvaluations = plan.evaluations.filter((evaluation) =>
          filter.byPracticeNames!.includes(evaluation.practice.name),
        );
        if (!filteredEvaluations.length) return null;
        return new FileActionPlan({
          path: plan.path,
          evaluations: filteredEvaluations,
          action: getRequiredActionForFile({
            evaluations: filteredEvaluations,
          }),
        });
      })
      .filter(isPresent);

  // apply file path filter, if asked for
  if (filter.byFilePaths)
    filteredPlans = filteredPlans
      .map((plan) => {
        const filteredEvaluations = plan.evaluations.filter((evaluation) =>
          filter.byFilePaths!.includes(evaluation.path),
        );
        if (!filteredEvaluations.length) return null;
        return new FileActionPlan({
          path: plan.path,
          evaluations: filteredEvaluations,
          action: getRequiredActionForFile({
            evaluations: filteredEvaluations,
          }),
        });
      })
      .filter(isPresent);

  // apply fixable filter, if asked for
  if (filter.byFixable)
    filteredPlans = filteredPlans
      .map((plan) => {
        const filteredEvaluations = plan.evaluations.filter(isFixablePractice);
        if (!filteredEvaluations.length) return null;
        return new FileActionPlan({
          path: plan.path,
          evaluations: filteredEvaluations,
          action: getRequiredActionForFile({
            evaluations: filteredEvaluations,
          }),
        });
      })
      .filter(isPresent);

  // return the final set of filtered plans
  return filteredPlans;
};
