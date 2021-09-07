import { promises as fs } from 'fs';

export const doesDirectoryExist = async ({ directory }: { directory: string }) => {
  try {
    const stat = await fs.lstat(`${directory.replace('/$', '')}/`); // make sure there's a `/` at the end, so that symbolic links are dereferenced
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
};
