import { isOfFileCheckType, FileCheckType } from '../../../domain';
import { CheckFileDeclarationInput } from '../../../domain/objects/CheckFileDeclarationInput';
import { doesFileExist } from '../../../utils/fileio/doesFileExist';
import { importExportsFromFile } from '../../../utils/fileio/importExportsFromFile';
import { UserInputError } from '../../UserInputError';

export const getHydratedCheckInputsForFile = async ({
  declaredProjectDirectory,
  declaredFileCorePath,
}: {
  declaredProjectDirectory: string;
  declaredFileCorePath: string;
}) => {
  // check if user declared input for this file-check
  const inputFilePath = `${declaredProjectDirectory}/${declaredFileCorePath}.declapract.ts`; // e.g., the metadata for `tsconfig.ts` is found under `tsconfig.ts.declapract.ts`
  const inputFileExists = await doesFileExist({ filePath: inputFilePath });
  if (!inputFileExists) return null;

  // grab the input file exports
  const declaredCheckInputs: { check?: any } = await importExportsFromFile({ filePath: inputFilePath });
  if (!declaredCheckInputs) return null;

  // make sure that check is defined
  if (!declaredCheckInputs.check)
    throw new UserInputError(
      `a '*.declapract.ts' file was defined for '${declaredFileCorePath}' but it did not export a 'check' variable`,
      { potentialSolution: `please 'export const check = ...' from '${inputFilePath}'` },
    );

  // handle shorthand of the check type defined
  if (isOfFileCheckType(declaredCheckInputs.check)) {
    if (declaredCheckInputs.check === FileCheckType.CUSTOM)
      // complain if user defined the type in shorthand as CUSTOM - since we dont know what the custom function is then!
      throw new UserInputError('file check type can not be CUSTOM without the function being specified', {
        potentialSolution: 'consider defining the check function, type FileCheckFunction, instead',
      });
    return new CheckFileDeclarationInput({
      type: declaredCheckInputs.check,
    });
  }

  // handle shorthand of custom function defined
  if (typeof declaredCheckInputs.check === 'function') {
    return new CheckFileDeclarationInput({
      type: FileCheckType.CUSTOM,
      function: declaredCheckInputs.check,
    });
  }

  // check that user did not try to define a custom function with a non CUSTOM type
  if (
    declaredCheckInputs.check.type && // type is defined
    declaredCheckInputs.check.function && // and custom function is defined
    declaredCheckInputs.check.type !== FileCheckType.CUSTOM // but type is not custom
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
    return new CheckFileDeclarationInput(declaredCheckInputs.check);
  } catch (error) {
    throw new UserInputError(
      `The 'check' variable exported from '*.declapract.ts' for '${declaredFileCorePath}' was not a supported shorthand definition and is not a correctly defined 'CheckFileDeclarationInput'`,
      {
        potentialSolution: `Please fix the 'export const check = ...' export in '${inputFilePath}'. If you are trying to specify a CheckFileDeclarationInput check object, here is why it was invalid: ${error.message}`,
      },
    );
  }
};
