import { glob } from 'glob';

/**
 * .what = returns paths to all files inside this directory or its nested directories
 * .why = enables recursive file discovery for practice evaluation
 */
export const listFilesInDirectory = async ({
  directory,
}: {
  directory: string;
}): Promise<string[]> =>
  glob('**/*', {
    cwd: directory,
    dot: true,
    nodir: true,
  });
