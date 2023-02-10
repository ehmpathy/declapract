import { sort as sortFilePaths } from 'cross-path-sort';

import { FileActionPlan } from '../../../domain';

export const sortFileActionPlansByPaths = ({
  plans,
}: {
  plans: FileActionPlan[];
}) =>
  plans.sort((a, b) =>
    sortFilePaths([a.path, b.path], { deepFirst: true })[0] === a.path ? -1 : 1,
  );
