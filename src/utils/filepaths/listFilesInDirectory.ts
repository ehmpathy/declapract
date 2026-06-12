import globby from 'globby';

/**
 * .what = returns paths to all files inside this directory or its nested directories
 * .why = enables recursive file discovery for practice evaluation
 *
 * .note = respects .gitignore patterns automatically via globby
 */
export const listFilesInDirectory = async ({
  directory,
}: {
  directory: string;
}): Promise<string[]> =>
  globby('**/*', {
    cwd: directory,
    dot: true,
    onlyFiles: true,
    gitignore: true,
  });
