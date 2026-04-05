import path from 'path';

import type { FileCheckContext } from '@src/domain.objects';
import { readFileIfExistsAsync } from '@src/utils/fileio/readFileIfExistsAsync';
import { parseJSON } from '@src/utils/json/parseJSON';

import { checkContainsJSON } from './composableActions/checkContainsJSON';
import { checkContainsSubstring } from './composableActions/checkContainsSubstring';
import { checkExists } from './composableActions/checkExists';
import { withOptionalityCheck } from './withOptionalityCheck';

/**
 * .what = gets the target package name from the project root package.json
 * .why = needed to detect and filter self-deps in check phase
 */
const getTargetPackageName = async (
  context: FileCheckContext,
): Promise<string | null> => {
  const projectRoot = context.getProjectRootDirectory();
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const contents = await readFileIfExistsAsync({ filePath: packageJsonPath });
  if (!contents) return null;
  const parsed = parseJSON<{ name?: unknown }>(contents);
  return typeof parsed?.name === 'string' ? parsed.name : null;
};

export const containsCheck = withOptionalityCheck(
  async (foundContents: string | null, context: FileCheckContext) => {
    checkExists(foundContents);
    if (context.relativeFilePath.endsWith('.json')) {
      // for package.json, get target package name to filter self-deps
      const targetPackageName =
        context.relativeFilePath === 'package.json'
          ? await getTargetPackageName(context)
          : null;

      checkContainsJSON({
        declaredContents: context.declaredFileContents!,
        foundContents: foundContents!,
        targetPackageName,
      });
    } else {
      checkContainsSubstring({
        declaredContents: context.declaredFileContents!,
        foundContents: foundContents!,
      });
    }
  },
);
