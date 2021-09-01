import glob from 'glob';
import { promisify } from 'util';

import { FileCheckDeclaration, FileCheckEvaluation, FileEvaluationResult } from '../../../../domain';
import { readFileIfExistsAsync } from '../../../../utils/fileio/readFileIfExistsAsync';

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
      const fileContents = await readFileIfExistsAsync({ filePath });

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
