import { FileCheckType } from '@src/domain.objects';
import { FileCheckDeclarationInput } from '@src/domain.objects/FileCheckDeclarationInput';
import { UserInputError } from '@src/domain.operations/UserInputError';
import { doesFileExist } from '@src/utils/fileio/doesFileExist';
import { importExportsFromFile } from '@src/utils/fileio/importExportsFromFile';

import { getHydratedCheckInputsForFile } from './getHydratedCheckInputsForFile';

jest.mock('../../../../../utils/fileio/doesFileExist');
const doesFileExistMock = doesFileExist as jest.Mock;

jest.mock('../../../../../utils/fileio/importExportsFromFile');
const importExportsFromFileMock = importExportsFromFile as jest.Mock;

describe('getHydratedCheckInputsForFile', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // reset to remove inter test state
    doesFileExistMock.mockReturnValue(false); // default to file does not exist
    importExportsFromFileMock.mockReturnValue({}); // default to no exports specified
  });
  it('should lookup the file at the correct file path', async () => {
    await getHydratedCheckInputsForFile({
      declaredProjectDirectory: '__dir__',
      declaredFileCorePath: '__path__',
    });
    expect(doesFileExistMock).toHaveBeenCalledTimes(1);
    expect(doesFileExistMock).toHaveBeenCalledWith({
      filePath: '__dir__/__path__.declapract.ts',
    });
  });
  it('should return null if the file does not exist', async () => {
    const result = await getHydratedCheckInputsForFile({
      declaredProjectDirectory: '__dir__',
      declaredFileCorePath: '__path__',
    });
    expect(result).toEqual({
      declaredCheckInputs: null,
      declaredContentsFunction: null,
      declaredFixFunction: null,
    });
  });
  it('should throw an error if file exists but check was not exported', async () => {
    doesFileExistMock.mockReturnValue(true);
    try {
      await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      fail('should not reach here');
    } catch (error) {
      expect(error).toBeInstanceOf(UserInputError);
    }
  });
  describe('shorthands', () => {
    it('should define correctly when type shorthand is used', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: FileCheckType.CONTAINS,
      });
      const result = await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      expect(result).toEqual({
        declaredCheckInputs: new FileCheckDeclarationInput({
          type: FileCheckType.CONTAINS,
        }),
        declaredContentsFunction: null,
        declaredFixFunction: null,
      });
    });
    it('should throw an error if CUSTOM was used as a type shorthand', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: FileCheckType.CUSTOM,
      });
      try {
        await getHydratedCheckInputsForFile({
          declaredProjectDirectory: '__dir__',
          declaredFileCorePath: '__path__',
        });
        fail('should not reach here');
      } catch (error) {
        expect(error).toBeInstanceOf(UserInputError);
        expect((error as Error).message).toContain(
          'File check type can not be CUSTOM without the function being specified',
        );
      }
    });
    it('should define correctly when function shorthand is used', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({ check: async () => {} });
      const result = await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      expect(result).toEqual({
        declaredCheckInputs: {
          type: FileCheckType.CUSTOM,
          function: expect.any(Function),
        },
        declaredContentsFunction: null,
        declaredFixFunction: null,
      });
    });
  });
  describe('full definitions', () => {
    it('should allow user to specify an optional check', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: { optional: true },
      });
      const result = await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      expect(result).toEqual({
        declaredCheckInputs: { optional: true },
        declaredContentsFunction: null,
        declaredFixFunction: null,
      });
    });
    it('should allow user to specify an optional contains check', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: { type: FileCheckType.CONTAINS, optional: true },
      });
      const result = await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      expect(result).toEqual({
        declaredCheckInputs: { type: FileCheckType.CONTAINS, optional: true },
        declaredContentsFunction: null,
        declaredFixFunction: null,
      });
    });
    it('should allow user to specify an optional custom check', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: { optional: true, function: () => {} },
      });
      const result = await getHydratedCheckInputsForFile({
        declaredProjectDirectory: '__dir__',
        declaredFileCorePath: '__path__',
      });
      expect(result).toEqual({
        declaredCheckInputs: { optional: true, function: expect.any(Function) },
        declaredContentsFunction: null,
        declaredFixFunction: null,
      });
    });
    it('should throw an error if user tries to specify type other than CUSTOM and also provides a custom function', async () => {
      doesFileExistMock.mockReturnValue(true);
      importExportsFromFileMock.mockResolvedValue({
        check: { type: FileCheckType.EQUALS, function: () => {} },
        declaredFixFunction: null,
      });
      try {
        await getHydratedCheckInputsForFile({
          declaredProjectDirectory: '__dir__',
          declaredFileCorePath: '__path__',
        });
        fail('should not reach here');
      } catch (error) {
        expect(error).toBeInstanceOf(UserInputError);
        expect((error as Error).message).toContain(
          'If check.function is defined then the type can not be defined as anything but FileCheckType.CUSTOM',
        );
      }
    });
  });
});
