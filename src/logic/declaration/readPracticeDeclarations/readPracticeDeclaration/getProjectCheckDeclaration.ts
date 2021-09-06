import { FileCheckPurpose, FileCheckDeclaration } from '../../../../domain';
import { ProjectCheckDeclaration } from '../../../../domain/objects/ProjectCheckDeclaration';
import { readFileAsync } from '../../../../utils/fileio/readFileAsync';
import { listFilesInDirectory } from '../../../../utils/filepaths/listFilesInDirectory';
import { UnexpectedCodePathError } from '../../../UnexpectedCodePathError';
import { getFileCheckDeclaration } from './getFileCheckDeclaration/getFileCheckDeclaration';

export const getProjectCheckDeclaration = async ({
  purpose,
  declaredProjectDirectory,
}: {
  purpose: FileCheckPurpose;
  declaredProjectDirectory: string;
}): Promise<ProjectCheckDeclaration> => {
  // grab name from the directory
  const name = (() => {
    if (purpose === FileCheckPurpose.BEST_PRACTICE)
      return (new RegExp(/\/([\w-]+)\/best-practice$/).exec(declaredProjectDirectory) ?? [])[1] ?? null;
    if (purpose === FileCheckPurpose.BAD_PRACTICE)
      return (new RegExp(/bad-practices\/([\w-]+)$/).exec(declaredProjectDirectory) ?? [])[1] ?? null;
  })();
  if (!name)
    throw new UnexpectedCodePathError(
      `neither best-practice name nor bad-practice name was extractable from the declared project directory '${declaredProjectDirectory}'`,
    );

  // grab paths to _all_ files in this dir (not just at root level)
  const paths = await listFilesInDirectory({ directory: declaredProjectDirectory });

  // grab the meta files (i.e., path matches `${projectRoot}/.declapract.*`)
  const metaFilePaths = paths.filter((path) => new RegExp(/^\.declapract\./).test(path));

  // group all of the other files by main file name (i.e., key = filePath.replace('.declapract.ts$', ''))
  const projectFilePaths = [
    ...new Set(
      paths.filter((path) => !metaFilePaths.includes(path)).map((path) => path.replace(/\.declapract\.ts$/, '')),
    ),
  ];

  // for each "main file", get the FileCheckDefinition, now that we have all the files defined for it
  const checksAndErrors = await Promise.all(
    projectFilePaths.map((declaredFileCorePath) =>
      getFileCheckDeclaration({ purpose, declaredProjectDirectory, declaredFileCorePath }).catch((error) => error),
    ),
  );
  const anError = checksAndErrors.find((checkOrError) => checkOrError instanceof Error);
  if (anError) throw anError;
  const checks: FileCheckDeclaration[] = checksAndErrors.filter((checkOrError) => !(checkOrError instanceof Error));
  if (!checks.length) {
    console.log({ anError });
    console.log({
      declaredProjectDirectory,
      projectFilePaths,
      checksAndErrorsLength: checksAndErrors.length,
      checksLength: checks.length,
    });
  }

  // get readme contents, if readme defined
  const readme = metaFilePaths.includes('.declapract.readme.md')
    ? await readFileAsync({ filePath: `${declaredProjectDirectory}/.declapract.readme.md` })
    : null;

  // return the project def
  return new ProjectCheckDeclaration({
    name,
    checks,
    readme,
  });
};
