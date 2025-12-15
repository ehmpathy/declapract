import {
  FileCheckType,
  type FileContentsFunction,
  type FileFixFunction,
  isOfFileCheckType,
} from '@src/domain';
import { FileCheckDeclarationInput } from '@src/domain/objects/FileCheckDeclarationInput';
import { UserInputError } from '@src/logic/UserInputError';
import { doesFileExist } from '@src/utils/fileio/doesFileExist';
import { importExportsFromFile } from '@src/utils/fileio/importExportsFromFile';

export const getHydratedCheckInputsForFile = async ({
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  declaredProjectDirectory: string;
  declaredFileCorePath: string;
}): Promise<{
  declaredCheckInputs: FileCheckDeclarationInput | null;
  declaredFixFunction: null | FileFixFunction;
  declaredContentsFunction: null | FileContentsFunction;
}> => {
  // check if user declared input for this file-check
  const inputFilePath = `${declaredProjectDirectory}/${declaredFileCorePath}.declapract.ts`; // e.g., the metadata for `tsconfig.ts` is found under `tsconfig.ts.declapract.ts`
  const inputFileExists = await doesFileExist({ filePath: inputFilePath });
  if (!inputFileExists)
    return {
      declaredCheckInputs: null,
      declaredFixFunction: null,
      declaredContentsFunction: null,
    };

  // grab the input file exports
  const declaredExports: { check?: any; fix?: any; contents?: any } =
    await importExportsFromFile({ filePath: inputFilePath });
  if (!declaredExports)
    return {
      declaredCheckInputs: null,
      declaredFixFunction: null,
      declaredContentsFunction: null,
    };

  // make sure that check is defined
  if (!declaredExports.check)
    throw new UserInputError(
      `a '*.declapract.ts' file was defined for '${declaredFileCorePath}' but it did not export a 'check' variable`,
      {
        potentialSolution: `please 'export const check: FileCheckType | FileCheckFunction = ...' from '${inputFilePath}'`,
      },
    );

  // determine the check inputs user requested
  const declaredCheckInputs = (() => {
    // handle shorthand of the check type defined
    if (isOfFileCheckType(declaredExports.check)) {
      if (declaredExports.check === FileCheckType.CUSTOM)
        // complain if user defined the type in shorthand as CUSTOM - since we dont know what the custom function is then!
        throw new UserInputError(
          'file check type can not be CUSTOM without the function being specified',
          {
            potentialSolution:
              'consider defining the check function, type FileCheckFunction, instead',
          },
        );
      return new FileCheckDeclarationInput({
        type: declaredExports.check,
      });
    }

    // handle shorthand of custom function defined
    if (typeof declaredExports.check === 'function') {
      return new FileCheckDeclarationInput({
        type: FileCheckType.CUSTOM,
        function: declaredExports.check,
      });
    }

    // check that user did not try to define a custom function with a non CUSTOM type
    if (
      declaredExports.check.type && // type is defined
      declaredExports.check.function && // and custom function is defined
      declaredExports.check.type !== FileCheckType.CUSTOM // but type is not custom
    )
      throw new UserInputError(
        'if check.function is defined then the type can not be defined as anything but FileCheckType.CUSTOM',
        {
          potentialSolution:
            'you can remove the check.type declaration, specify check.type = FileCheckType.CUSTOM explicitly, or not use a custom check function',
        },
      );

    // handle the remaining case, object was defined in full
    try {
      return new FileCheckDeclarationInput(declaredExports.check);
    } catch (error) {
      throw new UserInputError(
        `The 'check' variable exported from '*.declapract.ts' for '${declaredFileCorePath}' was not a supported shorthand definition and is not a correctly defined 'FileCheckDeclarationInput'`,
        {
          potentialSolution: `Please fix the 'export const check = ...' export in '${inputFilePath}'. If you are trying to specify a FileCheckDeclarationInput check object, here is why it was invalid: ${(error as Error).message}`,
        },
      );
    }
  })();

  // determine if a fix function is defined
  const declaredFixFunction: FileFixFunction | null = (() => {
    if (!declaredExports.fix) return null;
    if (typeof declaredExports.fix !== 'function')
      throw new UserInputError(
        `a custom fix function was declared for '${declaredFileCorePath}' but it was not a function`,
        {
          potentialSolution: `please make sure that 'export const fix: FileFixFunction = ...' exports a function from '${inputFilePath}'`,
        },
      );
    return declaredExports.fix;
  })();

  // determine if a content function is defined
  const declaredContentsFunction: FileContentsFunction | null = (() => {
    if (!declaredExports.contents) return null;
    if (typeof declaredExports.contents !== 'function')
      throw new UserInputError(
        `a custom 'content' function was declared for '${declaredFileCorePath}' but it was not a function`,
        {
          potentialSolution: `please make sure that 'export const content: FileContentFunction = ...' exports a function from '${inputFilePath}'`,
        },
      );
    return declaredExports.contents;
  })();

  // return both the check inputs and the fix function
  return { declaredCheckInputs, declaredFixFunction, declaredContentsFunction };
};
