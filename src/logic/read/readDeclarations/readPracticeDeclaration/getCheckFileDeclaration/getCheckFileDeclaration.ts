import { CheckFileDeclaration, FileCheckType } from '../../../../../domain';
import { doesFileExist } from '../../../../../utils/fileio/doesFileExist';
import { readFileAsync } from '../../../../../utils/fileio/readFileAsync';
import { UnexpectedCodePathError } from '../../../../UnexpectedCodePathError';
import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';

export const getCheckFileDeclaration = async ({
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  declaredProjectDirectory: string;
  declaredFileCorePath: string;
}): Promise<CheckFileDeclaration> => {
  // get declared best practice contents, if declared
  const contentsFilePath = `${declaredProjectDirectory}/${declaredFileCorePath}`; // its the same path. i.e., the contents for `tsconfig.ts` are declared under `tsconfig.ts`)
  const contentsFileExists = await doesFileExist({ filePath: contentsFilePath });
  const declaredBestPracticeContents = contentsFileExists ? await readFileAsync({ filePath: contentsFilePath }) : null;

  // get check inputs, if declared
  const declaredCheckInputs = await getHydratedCheckInputsForFile({ declaredFileCorePath, declaredProjectDirectory });

  // define the common attributes
  const path = declaredFileCorePath; // its the path relative to the project root
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
  const strictEqualsCheck = withOptionalityCheck((foundContents: string | null) =>
    expect(foundContents).toEqual(declaredBestPracticeContents),
  );
  const containsCheck = withOptionalityCheck(async (foundContents: string | null) =>
    expect(foundContents).toContain(declaredBestPracticeContents),
  );
  const existsCheck = withOptionalityCheck(async (contents: string | null) => expect(contents).not.toEqual(null));

  // define the fix fns
  const strictEqualsFix = () => declaredBestPracticeContents; // i.e., replace the file with the expected contents

  // if check inputs were not explicitly declared, then the check is an exact equals
  if (!declaredCheckInputs) {
    if (!declaredBestPracticeContents)
      throw new UnexpectedCodePathError(
        'no hydrated input but also no contents. why are we even evaluating this file then?',
      );
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.EQUALS, // default when input not specified is exact equals
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }

  // handle custom check functions
  if (declaredCheckInputs.function)
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.CUSTOM,
      check: declaredCheckInputs.function,
      fix: null, // TODO: allow custom fixes
    });

  // handle "type = equals"
  if (declaredCheckInputs.type === FileCheckType.EQUALS)
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });

  // handle "type = contains"
  if (declaredCheckInputs.type === FileCheckType.CONTAINS)
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.CONTAINS,
      check: containsCheck,
      fix: null, // TODO: define a fix for "contains"
    });

  // handle "type = exists"
  if (declaredCheckInputs.type === FileCheckType.EXISTS) {
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.EXISTS,
      check: existsCheck,
      fix: null, // TODO: define a fix for "exists" (maybe just create the file? but then that's like a hack... maybe use the "strictEqualsFix" if it exists?)
    });
  }

  // handle type not explicitly specified
  if (contentsFileExists) {
    return new CheckFileDeclaration({
      path,
      required,
      type: FileCheckType.EQUALS,
      check: strictEqualsCheck,
      fix: strictEqualsFix,
    });
  }
  return new CheckFileDeclaration({
    path,
    required,
    type: FileCheckType.EXISTS,
    check: existsCheck,
    fix: null, // TODO: define a fix file for exists, like mentioned above
  });
};
