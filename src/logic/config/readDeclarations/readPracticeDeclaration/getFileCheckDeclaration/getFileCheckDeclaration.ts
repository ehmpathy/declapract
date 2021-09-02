import expect from 'expect';
import { FileCheckContext, FileCheckDeclaration, FileCheckType } from '../../../../../domain';
import { doesFileExist } from '../../../../../utils/fileio/doesFileExist';
import { readFileAsync } from '../../../../../utils/fileio/readFileAsync';
import { UnexpectedCodePathError } from '../../../../UnexpectedCodePathError';
import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';

export const getFileCheckDeclaration = async ({
  context,
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  context: FileCheckContext;
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

  // define the check fns
  const withOptionalityCheck = (
    logic: (foundContents: string | null) => void,
  ): ((foundContents: string | null) => void) => {
    return async (foundContents: string | null) => {
      if (!required && foundContents === null) return; // if this file is optional, then just return here
      await logic(foundContents);
    };
  };
  const strictEqualsCheck = withOptionalityCheck((foundContents: string | null) => {
    expect(foundContents).not.toBeNull();
    expect(foundContents).toEqual(declaredContents);
  });
  const containsCheck = withOptionalityCheck(async (foundContents: string | null) => {
    expect(foundContents).not.toBeNull();
    expect(foundContents).toContain(declaredContents);
  });
  const existsCheck = withOptionalityCheck(async (contents: string | null) => expect(contents).not.toBeNull());

  // define the fix fns
  const strictEqualsFix =
    context === FileCheckContext.BEST_PRACTICE
      ? () => declaredContents // i.e., replace the file with the expected contents, to fix in best practice context
      : null; // no fix defined for this check in badPractice context
  const containsFix = (() => {
    if (!declaredContents) return null; // contains fixes can only be defined when declared contents are defined (side note: we shouldn't be needing a contains fix otherwise, since contains type only occurs if there is a file)
    if (context === FileCheckContext.BEST_PRACTICE) {
      return (foundContents: string | null) => {
        if (foundContents) return foundContents; // do nothing if it already has contents; we can't actually fix it in this case
        return declaredContents; // i.e., create a file with that content when file doesn't exist
      };
    }
    // TODO: find a use case for the contains bad practice check fix:
    // if (context === FileCheckContext.BAD_PRACTICE) {
    //   return (foundContents: string | null) => {
    //     if (!foundContents) return foundContents; // do nothing if the file doesn't exist; this should never have been called in this case (since it can't contain the bad practice content if theres no content)
    //     return foundContents.replaceAll(declaredContents, ''); // remove each occurrence of the declared contents from the file
    //   };
    // }
    return null; // otherwise, no fix
  })();
  const existsFix =
    context === FileCheckContext.BAD_PRACTICE
      ? () => null // to fix it in the BAD_PRACTICE context, just make the file not exist
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
      context,
      type: FileCheckType.EQUALS, // default when input not specified is exact equals
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }

  // handle custom check functions
  if (declaredCheckInputs.function)
    return new FileCheckDeclaration({
      pathGlob,
      context,
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
      context,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });

  // handle "type = contains"
  if (declaredCheckInputs.type === FileCheckType.CONTAINS)
    return new FileCheckDeclaration({
      pathGlob,
      required,
      context,
      type: FileCheckType.CONTAINS,
      check: containsCheck,
      fix: containsFix,
    });

  // handle "type = exists"
  if (declaredCheckInputs.type === FileCheckType.EXISTS) {
    return new FileCheckDeclaration({
      pathGlob,
      required,
      context,
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
      context,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }
  return new FileCheckDeclaration({
    pathGlob,
    required,
    context,
    type: FileCheckType.EXISTS,
    check: existsCheck,
    fix: existsFix,
  });
};
