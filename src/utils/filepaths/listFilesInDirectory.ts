import globby from 'globby';

/**
 * common directories to always exclude, regardless of .gitignore presence
 *
 * .why = gitignore: true only works if .gitignore exists; these provide fallback
 */
const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
];

/**
 * .what = returns paths to all files inside this directory or its nested directories
 * .why = enables recursive file discovery for practice evaluation
 *
 * .note = respects .gitignore patterns automatically via globby, with fallback ignores
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
    ignore: DEFAULT_IGNORE_PATTERNS,
  });
