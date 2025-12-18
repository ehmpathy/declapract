import type { FileActionPlan } from '@src/domain.objects';

import { getColoredActionTitle } from './getColoredActionTitle';
import { getColoredActionToken } from './getColoredActionToken';

export const getColoredPlanTitle = ({ plan }: { plan: FileActionPlan }) => {
  // get the action token
  const actionToken = getColoredActionToken({ action: plan.action });

  // return the action title
  return getColoredActionTitle({ actionToken, relativeFilePath: plan.path });
};
