import { checkExists } from './composableActions/checkExists';
import { withOptionalityCheck } from './withOptionalityCheck';

export const existsCheck = withOptionalityCheck(
  async (foundContents: string | null) => {
    checkExists(foundContents);
  },
);
