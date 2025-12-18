import type { FileCheckContext, FileCheckFunction } from '@src/domain.objects';

import { checkEqualsString } from './composableActions/checkEqualsString';
import { checkExists } from './composableActions/checkExists';
import { withOptionalityCheck } from './withOptionalityCheck';

export const strictEqualsCheck: FileCheckFunction = withOptionalityCheck(
  (foundContents: string | null, context: FileCheckContext) => {
    checkExists(foundContents);
    checkEqualsString({
      declaredContents: context.declaredFileContents!,
      foundContents: foundContents!,
    });
  },
);
