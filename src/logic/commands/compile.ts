import { copyFileAsync } from '@src/utils/fileio/copyFileAsync';
import { listFilesInDirectory } from '@src/utils/filepaths/listFilesInDirectory';

export const serializeGlobPathForNpmPackaging = (path: string) =>
  path.replace(/\*/g, '<star>');
export const deserializeGlobPathFromNpmPackaging = (path: string) =>
  path.replace(/<star>/g, '*');

/**
 *
 * compiles declarations from a `sourceDirectory` into `distributionDirectory`, making sure that they can be packaged and used with npm successfully
 *
 * specifically, while copying each file from `sourceDirectory` to `distributionDirectory`:
 * - replaces file path `*` chars to `<star>` chars (https://github.com/uladkasach/declapract/issues/5)
 *
 * note: this is expected to be temporarily required functionality
 * - hopefully, we will be able to remove this when npm supports `*` in path names itself
 * - https://github.com/npm/cli/issues/3722
 */
export const compile = async ({
  sourceDirectory,
  distributionDirectory,
}: {
  sourceDirectory: string;
  distributionDirectory: string;
}) => {
  // list all the files in the source dir
  const filePaths = await listFilesInDirectory({ directory: sourceDirectory });
  const relevantFilePaths = filePaths.filter(
    (filePath) =>
      !filePath.endsWith('.declapract.test.ts') &&
      !filePath.endsWith('.declapract.test.ts.snap'), // no metafile test files // no metafile snapshot files,
  ); // skip the test files
  console.log(`📝 compiling ${relevantFilePaths.length} files...`); // tslint:disable-line: no-console

  // write each one to the distribution directory
  await Promise.all(
    relevantFilePaths.map((filePath) =>
      copyFileAsync({
        from: `${sourceDirectory}/${filePath}`,
        to: `${distributionDirectory}/${serializeGlobPathForNpmPackaging(
          filePath,
        )}`,
      }),
    ),
  );
};
