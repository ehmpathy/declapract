import glob from 'fast-glob';

import {
  Awaited,
  FileCheckDeclaration,
  FileCheckEvaluation,
  FileCheckPurpose,
  FileEvaluationResult,
  FileFixFunction,
  ProjectVariablesImplementation,
} from '../../../domain';
import { FileCheckContext } from '../../../domain/objects/FileCheckContext';
import { readFileIfExistsAsync } from '../../../utils/fileio/readFileIfExistsAsync';
import { withDurationReporting } from '../../../utils/wrappers/withDurationReporting';
import { UnexpectedCodePathError } from '../../UnexpectedCodePathError';
import { replaceProjectVariablesInDeclaredFileContents } from './projectVariableExpressions/replaceProjectVariablesInDeclaredFileContents';

const checkApplyingFixWouldChangeSomething = ({
  fixResults,
  foundContents,
  context,
}: {
  fixResults: Awaited<ReturnType<FileFixFunction>>;
  foundContents: string | null;
  context: FileCheckContext;
}): boolean => {
  // determine whether user declared a new value for each option - or whether they omitted them
  const declaredNewContents = fixResults.contents !== undefined;
  const declaredNewPath = fixResults.relativeFilePath !== undefined;

  // now determine whether they changed anything with what they declared
  if (declaredNewContents && fixResults.contents !== foundContents) return true; // if they declared new contents - and the contents are different than what they are now - then changed
  if (
    declaredNewPath &&
    fixResults.relativeFilePath !== context.relativeFilePath
  )
    return true; // if they declared a path - and the path is different than what it is now - then changed
  return false; // otherwise, no change
};

export const evaluateProjectAgainstFileCheckDeclaration = async ({
  practiceRef,
  purpose,
  projectRootDirectory,
  check,
  projectVariables,
}: {
  practiceRef: string;
  purpose: FileCheckPurpose;
  projectRootDirectory: string;
  check: FileCheckDeclaration;
  projectVariables: ProjectVariablesImplementation;
}): Promise<FileCheckEvaluation[]> => {
  // lookup the gitignore file for the directory

  // define the absolute file paths to check, dereferencing the check.path glob pattern
  const pathsFoundByGlob = await withDurationReporting(
    `glob:${check.pathGlob}`,
    () =>
      glob(check.pathGlob, {
        cwd: projectRootDirectory, // relative to project root,
        dot: true, // include dot files,
        onlyFiles: true, // only files, no directories (these are file checks, directories are not files)
        ignore: ['node_modules'], // ignore all files in these specific directories, too
      }),
  )();
  const pathsToCheck = pathsFoundByGlob.length
    ? pathsFoundByGlob
    : [check.pathGlob]; // if no paths found for the glob pattern, then just use the glob pattern and check against it (i.e., run the "exists" checks against that path)

  // for each file found by the glob pattern, evaluate it
  return await Promise.all(
    pathsToCheck.map(async (relativePath) => {
      // define the absolute file path
      const filePath = `${projectRootDirectory}/${relativePath}`;

      // grab the contents of the file
      const foundContents = await readFileIfExistsAsync({ filePath });

      // define the context of this file check
      const context = new FileCheckContext({
        relativeFilePath: relativePath,
        projectVariables,
        declaredFileContents: check.contents
          ? replaceProjectVariablesInDeclaredFileContents({
              projectVariables,
              fileContents: check.contents,
            })
          : null,
        required: check.required,
        getProjectRootDirectory: () => projectRootDirectory,
      });

      // check the file contents against declared check
      try {
        // run the check
        await check.check(foundContents, context);

        // determine the result of the check based on the context
        const result = (() => {
          if (purpose === FileCheckPurpose.BEST_PRACTICE)
            return FileEvaluationResult.PASS;
          if (purpose === FileCheckPurpose.BAD_PRACTICE)
            return FileEvaluationResult.FAIL; // if it matches a bad practice, then it failed the check
          throw new UnexpectedCodePathError(
            'context was not bet practice or bad practice',
          );
        })();

        // determine whether can fix, if failed
        const canFix =
          result === FileEvaluationResult.FAIL &&
          // fixable only if fix fn is defined and it would have changed something
          check.fix &&
          checkApplyingFixWouldChangeSomething({
            fixResults: await check.fix(foundContents, context),
            foundContents,
            context,
          });

        // build the evaluation
        return new FileCheckEvaluation({
          practiceRef,
          purpose,
          type: check.type,
          required: check.required,
          fix: canFix ? check.fix : null,
          path: relativePath,
          result,
          reason: null,
          context,
        });
      } catch (error) {
        // determine the result of the check based on the context
        const result = (() => {
          if (purpose === FileCheckPurpose.BEST_PRACTICE)
            return FileEvaluationResult.FAIL;
          if (purpose === FileCheckPurpose.BAD_PRACTICE)
            return FileEvaluationResult.PASS; // if it throws an error (i.e., does not match) a bad practice, then it passes the check
          throw new UnexpectedCodePathError(
            'context was not bet practice or bad practice',
          );
        })();

        // determine whether can fix, if failed
        const canFix =
          result === FileEvaluationResult.FAIL &&
          // fixable only if fix fn is defined and it would have changed something
          check.fix &&
          checkApplyingFixWouldChangeSomething({
            fixResults: await check.fix(foundContents, context),
            foundContents,
            context,
          });

        // build the evaluation
        return new FileCheckEvaluation({
          practiceRef,
          purpose,
          type: check.type,
          required: check.required,
          fix: canFix ? check.fix : null,
          path: relativePath,
          result,
          reason: error.message,
          context,
        });
      }
    }),
  );
};
