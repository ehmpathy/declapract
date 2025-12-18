import type { FileCheckContext } from '@src/domain.objects';

import { checkContainsJSON } from './composableActions/checkContainsJSON';
import { checkContainsSubstring } from './composableActions/checkContainsSubstring';
import { checkExists } from './composableActions/checkExists';
import { withOptionalityCheck } from './withOptionalityCheck';

export const containsCheck = withOptionalityCheck(
  async (foundContents: string | null, context: FileCheckContext) => {
    checkExists(foundContents);
    if (context.relativeFilePath.endsWith('.json')) {
      checkContainsJSON({
        declaredContents: context.declaredFileContents!,
        foundContents: foundContents!,
      });
    } else {
      checkContainsSubstring({
        declaredContents: context.declaredFileContents!,
        foundContents: foundContents!,
      });
    }
  },
);
