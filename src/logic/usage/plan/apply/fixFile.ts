import { FileCheckEvaluation, ProjectVariablesImplementation } from '../../../../domain';
import { FileCheckContext } from '../../../../domain/objects/FileCheckContext';
import { readFileIfExistsAsync } from '../../../../utils/fileio/readFileIfExistsAsync';
import { removeFileAsync } from '../../../../utils/fileio/removeFileAsync';
import { writeFileAsync } from '../../../../utils/fileio/writeFileAsync';
import { UnexpectedCodePathError } from '../../../UnexpectedCodePathError';

/**
 * fix a file using the fix function of a check, based on an evaluation of the file
 *
 * input is a "checkEvaluation", because:
 * - it tells us this file _was_ checked before this was called
 * - it has the exact "path" that the check was evaluated on (instead of just a glob, like on the path)
 * - it has the reference to the declared check, which has the fix function
 */
export const fixFile = async ({
  evaluation,
  projectRootDirectory,
}: {
  evaluation: FileCheckEvaluation;
  projectRootDirectory: string;
}) => {
  if (!evaluation.fix) throw new UnexpectedCodePathError('fixFile called on an eval that doesnt have a fix defined');

  // define the current state
  const relativeFilePath = evaluation.path;
  const filePath = `${projectRootDirectory}/${evaluation.path}`;
  const fileContents = await readFileIfExistsAsync({ filePath });

  // define the desired, "fixed", state
  const {
    contents: desiredContents = fileContents, // if contents not returned from fix function, then desired contents = current contents
    relativeFilePath: desiredRelativeFilePath = relativeFilePath, // if relative file path not returned from fix function, then desired relative file path = current relative file path
  } = await evaluation.fix(fileContents, evaluation.context);
  const desiredFilePath = `${projectRootDirectory}/${desiredRelativeFilePath}`;

  // define what we need to do to get there
  if (desiredContents)
    // if they still desired contents, then write it to the desired path
    await writeFileAsync({ path: desiredFilePath, content: desiredContents });
  if (desiredFilePath !== filePath || !desiredContents)
    // if the file path changed - or they no longer desire contents, then remove the orig file
    await removeFileAsync({ path: filePath });
};
