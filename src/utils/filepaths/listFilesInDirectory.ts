import glob from 'glob';
import { promisify } from 'util';

const promisifiedGlob = promisify(glob);

/**
 * returns paths to all files inside this directory or its nested directories
 */
export const listFilesInDirectory = async ({ directory }: { directory: string }) =>
  promisifiedGlob('**/*', { cwd: directory, dot: true, nodir: true });
