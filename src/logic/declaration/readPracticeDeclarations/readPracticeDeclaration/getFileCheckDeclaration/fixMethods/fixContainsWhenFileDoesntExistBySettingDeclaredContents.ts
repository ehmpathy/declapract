import { FileFixFunction } from '../../../../../../domain';

export const fixContainsWhenFileDoesntExistBySettingDeclaredContents: FileFixFunction =
  (contents, context) => {
    if (contents) return {}; // do nothing if it already has contents; we can't actually fix it in this case
    return { contents: context.declaredFileContents }; // i.e., create a file with that content when file doesn't exist
  };
