import {
  FileCheckDeclaration,
  FileCheckFunction,
  FileCheckPurpose,
  FileCheckType,
  FileFixFunction,
} from '../../../../../domain';
import { FileCheckContext } from '../../../../../domain/objects/FileCheckContext';
import { doesFileExist } from '../../../../../utils/fileio/doesFileExist';
import { readFileAsync } from '../../../../../utils/fileio/readFileAsync';
import { deserializeGlobPathFromNpmPackaging } from '../../../../commands/compile';
import { UnexpectedCodePathError } from '../../../../UnexpectedCodePathError';
import { checkContainsJSON } from './checkMethods/checkContainsJSON';
import { checkContainsSubstring } from './checkMethods/checkContainsSubstring';
import { checkEqualsString } from './checkMethods/checkEqualsString';
import { checkExists } from './checkMethods/checkExists';
import { fixContainsJSONByReplacingKeyValues } from './fixMethods/fixContainsJSONByReplacingKeyValues';
import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';
import { getParsedDeclaredContentsFromContext } from './checkExpressions/getParsedDeclaredContentsFromContext';

export const getFileCheckDeclaration = async ({
  purpose,
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  purpose: FileCheckPurpose;
  declaredProjectDirectory: string;
  declaredFileCorePath: string;
}): Promise<FileCheckDeclaration> => {
  // get declared best practice contents, if declared
  const contentsFilePath = `${declaredProjectDirectory}/${declaredFileCorePath}`; // its the same path. i.e., the contents for `tsconfig.ts` are declared under `tsconfig.ts`)
  const contentsFileExists = await doesFileExist({ filePath: contentsFilePath });
  const declaredContents = contentsFileExists ? await readFileAsync({ filePath: contentsFilePath }) : null;

  // get check inputs, if declared
  const { declaredCheckInputs, declaredFixFunction } = await getHydratedCheckInputsForFile({
    declaredFileCorePath,
    declaredProjectDirectory,
  });

  // define the common attributes
  const pathGlob = deserializeGlobPathFromNpmPackaging(declaredFileCorePath); // its the path relative to the project root (note that this path can is technically a glob (e.g., can be `src/**/*.ts`))
  const required = !declaredCheckInputs?.optional; // if not explicitly opted-in to be optional, then its required

  // define the check fns
  const withOptionalityCheck = (logic: FileCheckFunction): FileCheckFunction => {
    return async (foundContents: string | null, context: FileCheckContext) => {
      if (!required && foundContents === null) return; // if this file is optional, then just return here
      await logic(foundContents, context);
    };
  };
  const strictEqualsCheck: FileCheckFunction = withOptionalityCheck(
    (foundContents: string | null, context: FileCheckContext) => {
      checkExists(foundContents);
      const parsedDeclaredContents = getParsedDeclaredContentsFromContext(context);
      checkEqualsString({ declaredContents: parsedDeclaredContents!, foundContents: foundContents! });
    },
  );
  const containsCheck = withOptionalityCheck(async (foundContents: string | null, context: FileCheckContext) => {
    checkExists(foundContents);
    const parsedDeclaredContents = getParsedDeclaredContentsFromContext(context);
    if (declaredFileCorePath.endsWith('.json')) {
      checkContainsJSON({ declaredContents: parsedDeclaredContents!, foundContents: foundContents! });
    } else {
      checkContainsSubstring({ declaredContents: parsedDeclaredContents!, foundContents: foundContents! });
    }
  });
  const existsCheck = withOptionalityCheck(async (foundContents: string | null) => {
    checkExists(foundContents);
  });

  // define the fix fns
  const strictEqualsFix: FileFixFunction | null =
    purpose === FileCheckPurpose.BEST_PRACTICE
      ? (_, context) => ({
          contents: getParsedDeclaredContentsFromContext(context), // i.e., replace the file with the expected contents, to fix for best practice
        })
      : null; // no fix defined for this check for badPractice
  const containsFix: FileFixFunction | null = (() => {
    if (!declaredContents) return null; // contains fixes can only be defined when declared contents are defined (side note: we shouldn't be needing a contains fix otherwise, since contains type only occurs if there is a file)
    if (purpose === FileCheckPurpose.BEST_PRACTICE) {
      if (pathGlob.endsWith('.json')) return fixContainsJSONByReplacingKeyValues;
      return (foundContents: string | null, context: FileCheckContext) => {
        if (foundContents) return { contents: foundContents }; // do nothing if it already has contents; we can't actually fix it in this case
        const parsedDeclaredContents = getParsedDeclaredContentsFromContext(context);
        return { contents: parsedDeclaredContents }; // i.e., create a file with that content when file doesn't exist
      };
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
    throw new UnexpectedCodePathError('should have a check for each type defined');
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
