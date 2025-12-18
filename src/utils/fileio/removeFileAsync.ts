import fs from 'fs';
import util from 'util';

const unlink = util.promisify(fs.unlink);

export const removeFileAsync = async ({ path }: { path: string }) => {
  try {
    await unlink(path);
  } catch (error: unknown) {
    // if file doesn't exist, treat as successful no-op (idempotent)
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return;
    throw error;
  }
};
