import glob from 'glob';
import { promisify } from 'util';

import { FileCheckDeclaration, FileCheckEvaluation, FileEvaluationResult } from '../../../domain';
import { doesFileExist } from '../../../utils/fileio/doesFileExist';
import { readFileAsync } from '../../../utils/fileio/readFileAsync';

const promisifiedGlob = promisify(glob);

export const evaluateProjectAgainstFileCheckDeclaration = async ({
  practiceRef,
  projectRootDirectory,
  check,
}: {
  practiceRef: string;
  projectRootDirectory: string;
  check: FileCheckDeclaration;
}): Promise<FileCheckEvaluation[]> => {
  // define the absolute file paths to check, dereferencing the check.path glob pattern
  const pathsFoundByGlob = await promisifiedGlob(check.pathGlob, { cwd: projectRootDirectory, dot: true, nodir: true }); // relative to project root,  include dot files, ignore directories (these are file checks, directories are not files)
  const pathsToCheck = pathsFoundByGlob.length ? pathsFoundByGlob : [check.pathGlob]; // if no paths found for the glob pattern, then just use the glob pattern and check against it (i.e., run the "exists" checks against that path)

  // for each file found by the glob pattern, evaluate it
  return await Promise.all(
    pathsToCheck.map(async (relativePath) => {
      // define the absolute file path
      const filePath = `${projectRootDirectory}/${relativePath}`;

      // grab the contents of the file
      // TODO: handle wildcard paths with globby -> could be many files that need evaluated on this same check
      // note: if "check exists dao/**/*.ts" file returns no file paths, we still want to report that it failed if existance was required
      // i.e., _either_ we run it on all files returned by globby - or on the path itself and say file does not exist.
      const fileExists = await doesFileExist({ filePath });
      const fileContents = fileExists ? await readFileAsync({ filePath }) : null; // if file does not exist, we know contents are non existent (i.e., null)

      // check the file contents against declared check
      try {
        // run the check
        await check.check(fileContents);

        // if it succeeds, then the file passed
        return new FileCheckEvaluation({
          practiceRef,
          check,
          path: relativePath,
          result: FileEvaluationResult.PASS,
          reason: null,
        });
      } catch (error) {
        // if it threw an error, it failed
        return new FileCheckEvaluation({
          practiceRef,
          check,
          path: relativePath,
          result: FileEvaluationResult.FAIL,
          reason: error.message,
        });
      }
    }),
  );
};
