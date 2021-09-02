import { FileCheckEvaluation } from '../../../domain';
import { readFileIfExistsAsync } from '../../../utils/fileio/readFileIfExistsAsync';
import { removeFileAsync } from '../../../utils/fileio/removeFileAsync';
import { writeFileAsync } from '../../../utils/fileio/writeFileAsync';
import { UnexpectedCodePathError } from '../../UnexpectedCodePathError';

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
  const filePath = `${projectRootDirectory}/${evaluation.path}`;
  const fileContents = await readFileIfExistsAsync({ filePath });
  const desiredContents = await evaluation.fix(fileContents);
  desiredContents
    ? await writeFileAsync({ path: filePath, content: desiredContents })
    : await removeFileAsync({ path: filePath });
};
