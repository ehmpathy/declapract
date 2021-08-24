import fs from 'fs';

export const doesFileExist = async ({ filePath }: { filePath: string }) => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};
