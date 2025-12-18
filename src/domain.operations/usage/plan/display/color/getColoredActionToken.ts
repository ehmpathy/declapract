import chalk from 'chalk';

import { RequiredAction } from '@src/domain.objects';

export const getColoredActionToken = ({
  action,
}: {
  action: RequiredAction;
}) => {
  // define action color
  const actionChalk = {
    [RequiredAction.NO_CHANGE]: chalk.gray,
    [RequiredAction.FIX_AUTOMATIC]: chalk.yellow,
    [RequiredAction.FIX_MANUAL]: chalk.red,
  }[action];

  // return the token
  return chalk.bold(actionChalk(`[${action}]`));
};
