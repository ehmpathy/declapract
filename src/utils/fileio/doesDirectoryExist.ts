import { promises as fs } from 'fs';

export const doesDirectoryExist = async ({ directory }: { directory: string }) => {
  try {
    const stat = await fs.lstat(directory);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
};
