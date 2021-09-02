import glob from 'glob';
import { promisify } from 'util';

import { FileCheckDeclaration, FileCheckEvaluation, FileCheckContext, FileEvaluationResult } from '../../../../domain';
import { readFileIfExistsAsync } from '../../../../utils/fileio/readFileIfExistsAsync';
import { UnexpectedCodePathError } from '../../../UnexpectedCodePathError';

const promisifiedGlob = promisify(glob);

export const evaluateProjectAgainstFileCheckDeclaration = async ({
  practiceRef,
  context,
  projectRootDirectory,
  check,
}: {
  practiceRef: string;
  context: FileCheckContext;
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

        // determine the result of the check based on the context
        const result = (() => {
          if (context === FileCheckContext.BEST_PRACTICE) return FileEvaluationResult.PASS;
          if (context === FileCheckContext.BAD_PRACTICE) return FileEvaluationResult.FAIL; // if it matches a bad practice, then it failed the check
          throw new UnexpectedCodePathError('context was not bet practice or bad practice');
        })();

        // determine whether can fix, if failed
        const canFix = result === FileEvaluationResult.FAIL && check.fix && check.fix(fileContents) !== fileContents; // fixable only if the fix function is defined AND it would return a different result

        // build the evaluation
        return new FileCheckEvaluation({
          practiceRef,
          context,
          type: check.type,
          required: check.required,
          fix: canFix ? check.fix : null,
          path: relativePath,
          result,
          reason: null,
        });
      } catch (error) {
        // determine the result of the check based on the context
        const result = (() => {
          if (context === FileCheckContext.BEST_PRACTICE) return FileEvaluationResult.FAIL;
          if (context === FileCheckContext.BAD_PRACTICE) return FileEvaluationResult.PASS; // if it throws an error (i.e., does not match) a bad practice, then it passes the check
          throw new UnexpectedCodePathError('context was not bet practice or bad practice');
        })();

        // determine whether can fix, if failed
        const canFix = result === FileEvaluationResult.FAIL && check.fix && check.fix(fileContents) !== fileContents; // fixable only if the fix function is defined AND it would return a different result

        // build the evaluation
        return new FileCheckEvaluation({
          practiceRef,
          context,
          type: check.type,
          required: check.required,
          fix: canFix ? check.fix : null,
          path: relativePath,
          result,
          reason: error.message,
        });
      }
    }),
  );
};
