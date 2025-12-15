import {
  FileCheckDeclaration,
  type FileCheckFunction,
  FileCheckPurpose,
  FileCheckType,
  type FileContentsFunction,
  type FileFixFunction,
} from '@src/domain';
import { deserializeGlobPathFromNpmPackaging } from '@src/logic/commands/compile';
import { UnexpectedCodePathError } from '@src/logic/UnexpectedCodePathError';
import { doesFileExist } from '@src/utils/fileio/doesFileExist';
import { readFileAsync } from '@src/utils/fileio/readFileAsync';

import { containsCheck } from './checkMethods/containsCheck';
import { existsCheck } from './checkMethods/existsCheck';
import { strictEqualsCheck } from './checkMethods/strictEqualsCheck';
import { fixContainsJSONByReplacingAndAddingKeyValues } from './fixMethods/fixContainsJSONByReplacingAndAddingKeyValues';
import { fixContainsWhenFileDoesntExistBySettingDeclaredContents } from './fixMethods/fixContainsWhenFileDoesntExistBySettingDeclaredContents';
import { fixEqualsBySettingDeclaredContents } from './fixMethods/fixEqualsBySettingDeclaredContents';
import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';

export const getFileCheckDeclaration = async ({
  purpose,
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  purpose: FileCheckPurpose;
  declaredProjectDirectory: string;
  declaredFileCorePath: string;
}): Promise<FileCheckDeclaration> => {
  // get check inputs, if declared
  const { declaredCheckInputs, declaredFixFunction, declaredContentsFunction } =
    await getHydratedCheckInputsForFile({
      declaredFileCorePath,
      declaredProjectDirectory,
    });

  // get declared best practice contents, if declared
  const contentsFilePath = `${declaredProjectDirectory}/${declaredFileCorePath}`; // its the same path. i.e., the contents for `tsconfig.ts` are declared under `tsconfig.ts`)
  const contentsFileExists = await doesFileExist({
    filePath: contentsFilePath,
  });
  const declaredContents: FileContentsFunction | null = await (async () => {
    if (declaredContentsFunction) return declaredContentsFunction;
    if (contentsFileExists)
      return () => readFileAsync({ filePath: contentsFilePath });
    return null;
  })();

  // define the common attributes
  const pathGlob = deserializeGlobPathFromNpmPackaging(declaredFileCorePath); // its the path relative to the project root (note that this path can is technically a glob (e.g., can be `src/**/*.ts`))
  const required = !declaredCheckInputs?.optional; // if not explicitly opted-in to be optional, then its required

  // define the check fns
  // define the fix fns
  const strictEqualsFix: FileFixFunction | null =
    purpose === FileCheckPurpose.BEST_PRACTICE
      ? fixEqualsBySettingDeclaredContents
      : null; // TODO: think of a fix for bad practice case
  const containsFix: FileFixFunction | null = (() => {
    if (!declaredContents) return null; // contains fixes can only be defined when declared contents are defined (side note: we shouldn't be needing a contains fix otherwise, since contains type only occurs if there is a file)
    if (purpose === FileCheckPurpose.BEST_PRACTICE) {
      if (pathGlob.endsWith('.json'))
        return fixContainsJSONByReplacingAndAddingKeyValues;
      return fixContainsWhenFileDoesntExistBySettingDeclaredContents;
    }
    return null; // otherwise, no fix
  })();
  const existsFix: FileFixFunction | null =
    purpose === FileCheckPurpose.BAD_PRACTICE
      ? () => ({ contents: null }) // to fix it for BAD_PRACTICE, just make the file not exist
      : null;

  // define what check type it is, based on the inputs + defaults
  const type: FileCheckType = (() => {
    // if no input file, then default to equals check
    if (!declaredCheckInputs) {
      if (!declaredContents)
        throw new UnexpectedCodePathError(
          'no hydrated input but also no contents. why are we even evaluating this file then?',
        );
      return FileCheckType.EQUALS; // default to "equals";
    }

    // if a custom check fn was defined, then check type = custom
    if (declaredCheckInputs.function) return FileCheckType.CUSTOM;

    // if user specified a type, use it
    if (declaredCheckInputs.type) return declaredCheckInputs.type;

    // since user did not specify a type, see if we can default to equals
    if (declaredContents) return FileCheckType.EQUALS;

    // otherwise, default to an existence check
    return FileCheckType.EXISTS;
  })();

  // define the check and fix based on the type
  const checkForType: FileCheckFunction = (() => {
    if (type === FileCheckType.EQUALS) return strictEqualsCheck;
    if (type === FileCheckType.CUSTOM) return declaredCheckInputs!.function!;
    if (type === FileCheckType.CONTAINS) return containsCheck;
    if (type === FileCheckType.EXISTS) return existsCheck;
    throw new UnexpectedCodePathError(
      'should have a check for each type defined',
    );
  })();
  const fixForType: FileFixFunction | null = (() => {
    if (type === FileCheckType.EQUALS) return strictEqualsFix;
    if (type === FileCheckType.CONTAINS) return containsFix;
    if (type === FileCheckType.EXISTS) return existsFix;
    return null;
  })();

  // return the check based on what we've found for it
  return new FileCheckDeclaration({
    pathGlob,
    required,
    purpose,
    type,
    check: checkForType,
    fix: declaredFixFunction ?? fixForType,
    contents: declaredContents,
  });
};
