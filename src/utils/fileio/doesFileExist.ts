import { promises as fs } from 'fs';

export const doesFileExist = async ({ filePath }: { filePath: string }) => {
  try {
    const stat = await fs.lstat(filePath);
    return stat.isFile();
  } catch (error) {
    return false;
  }
};
