import { doesFileExist } from './doesFileExist';
import { readFileAsync } from './readFileAsync';

export const readFileIfExistsAsync = async ({ filePath }: { filePath: string }) => {
  const fileExists = await doesFileExist({ filePath });
  const fileContents = fileExists ? await readFileAsync({ filePath }) : null; // if file does not exist, we know contents are non existent (i.e., null)
  return fileContents;
};
