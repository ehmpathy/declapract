import { diff } from 'jest-diff';
import expect from 'expect';
import {
  FileCheckPurpose,
  FileCheckDeclaration,
  FileCheckType,
  FileCheckFunction,
  FileFixFunction,
} from '../../../../../domain';
import { FileCheckContext } from '../../../../../domain/objects/FileCheckContext';
import { doesFileExist } from '../../../../../utils/fileio/doesFileExist';
import { readFileAsync } from '../../../../../utils/fileio/readFileAsync';
import { UnexpectedCodePathError } from '../../../../UnexpectedCodePathError';
import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';
import { replaceProjectVariablesInDeclaredFileContents } from '../../../replaceProjectVariablesInDeclaredFileContents';

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
  const declaredCheckInputs = await getHydratedCheckInputsForFile({ declaredFileCorePath, declaredProjectDirectory });

  // define the common attributes
  const pathGlob = declaredFileCorePath; // its the path relative to the project root (note that this path can be a glob (e.g., `src/**/*.ts`))
  const required = !declaredCheckInputs?.optional; // if not explicitly opted-in to be optional, then its required

  // define how to get the parsed declared contents
  const getParsedDeclaredContents = (context: FileCheckContext) => {
    const projectVariables = context.projectVariables; // grab the project variables
    const declaredContentsPostVariableReplacement = declaredContents
      ? replaceProjectVariablesInDeclaredFileContents({
          projectVariables,
          fileContents: declaredContents,
        })
      : null;
    return declaredContentsPostVariableReplacement;
  };

  // define the check fns
  const withOptionalityCheck = (logic: FileCheckFunction): FileCheckFunction => {
    return async (foundContents: string | null, context: FileCheckContext) => {
      if (!required && foundContents === null) return; // if this file is optional, then just return here
      await logic(foundContents, context);
    };
  };
  const strictEqualsCheck: FileCheckFunction = withOptionalityCheck(
    (foundContents: string | null, context: FileCheckContext) => {
      expect(foundContents).not.toBeNull();
      const parsedDeclaredContents = getParsedDeclaredContents(context);
      try {
        expect(foundContents).toEqual(parsedDeclaredContents);
      } catch (error) {
        // if the above check failed, run diff on the string directly to show a better string diff message
        const difference = diff(parsedDeclaredContents, foundContents, { aAnnotation: 'Expected toEqual' });
        if (!difference)
          throw new UnexpectedCodePathError(
            'expect().toEqual() threw an error, but no difference was detected in the strings',
          );
        throw new Error(difference);
      }
    },
  );
  const containsCheck = withOptionalityCheck(async (foundContents: string | null, context: FileCheckContext) => {
    expect(foundContents).not.toBeNull();
    const parsedDeclaredContents = getParsedDeclaredContents(context);
    try {
      expect(foundContents).toContain(parsedDeclaredContents);
    } catch (error) {
      // if the above check failed, run diff on the string directly to show a better string diff message
      const difference = diff(parsedDeclaredContents, foundContents, { aAnnotation: 'Expected toContain' });
      if (!difference)
        throw new UnexpectedCodePathError(
          'expect().toContain() threw an error, but no difference was detected in the strings',
        );
      throw new Error(difference);
    }
  });
  const existsCheck = withOptionalityCheck(async (contents: string | null) => {
    expect(contents).not.toBeNull();
  });

  // define the fix fns
  const strictEqualsFix: FileFixFunction | null =
    purpose === FileCheckPurpose.BEST_PRACTICE
      ? (_, context) => getParsedDeclaredContents(context) // i.e., replace the file with the expected contents, to fix for best practice
      : null; // no fix defined for this check for badPractice
  const containsFix: FileFixFunction | null = (() => {
    if (!declaredContents) return null; // contains fixes can only be defined when declared contents are defined (side note: we shouldn't be needing a contains fix otherwise, since contains type only occurs if there is a file)
    if (purpose === FileCheckPurpose.BEST_PRACTICE) {
      return (foundContents: string | null, context: FileCheckContext) => {
        if (foundContents) return foundContents; // do nothing if it already has contents; we can't actually fix it in this case
        const parsedDeclaredContents = getParsedDeclaredContents(context);
        return parsedDeclaredContents; // i.e., create a file with that content when file doesn't exist
      };
    }
    // TODO: find a use case for the contains bad practice check fix:
    // if (purpose === FileCheckPurpose.BAD_PRACTICE) {
    //   return (foundContents: string | null) => {
    //     if (!foundContents) return foundContents; // do nothing if the file doesn't exist; this should never have been called in this case (since it can't contain the bad practice content if theres no content)
    //     return foundContents.replaceAll(declaredContents, ''); // remove each occurrence of the declared contents from the file
    //   };
    // }
    return null; // otherwise, no fix
  })();
  const existsFix =
    purpose === FileCheckPurpose.BAD_PRACTICE
      ? () => null // to fix it for BAD_PRACTICE, just make the file not exist
      : null;

  // if check inputs were not explicitly declared, then the check is an exact equals
  if (!declaredCheckInputs) {
    if (!declaredContents)
      throw new UnexpectedCodePathError(
        'no hydrated input but also no contents. why are we even evaluating this file then?',
      );
    return new FileCheckDeclaration({
      pathGlob,
      required,
      purpose,
      type: FileCheckType.EQUALS, // default when input not specified is exact equals
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }

  // handle custom check functions
  if (declaredCheckInputs.function)
    return new FileCheckDeclaration({
      pathGlob,
      purpose,
      required,
      type: FileCheckType.CUSTOM,
      check: declaredCheckInputs.function,
      fix: null, // TODO: allow custom fixes
    });

  // handle "type = equals"
  if (declaredCheckInputs.type === FileCheckType.EQUALS)
    return new FileCheckDeclaration({
      pathGlob,
      required,
      purpose,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });

  // handle "type = contains"
  if (declaredCheckInputs.type === FileCheckType.CONTAINS)
    return new FileCheckDeclaration({
      pathGlob,
      required,
      purpose,
      type: FileCheckType.CONTAINS,
      check: containsCheck,
      fix: containsFix,
    });

  // handle "type = exists"
  if (declaredCheckInputs.type === FileCheckType.EXISTS) {
    return new FileCheckDeclaration({
      pathGlob,
      required,
      purpose,
      type: FileCheckType.EXISTS,
      check: existsCheck,
      fix: existsFix,
    });
  }

  // handle type not explicitly specified
  if (contentsFileExists) {
    return new FileCheckDeclaration({
      pathGlob,
      required,
      purpose,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }
  return new FileCheckDeclaration({
    pathGlob,
    required,
    purpose,
    type: FileCheckType.EXISTS,
    check: existsCheck,
    fix: existsFix,
  });
};
