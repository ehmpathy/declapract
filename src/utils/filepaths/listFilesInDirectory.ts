import glob from 'fast-glob';

/**
 * returns paths to all files inside this directory or its nested directories
 */
export const listFilesInDirectory = async ({ directory }: { directory: string }) =>
  glob('**/*', { cwd: directory, dot: true, onlyFiles: true });
