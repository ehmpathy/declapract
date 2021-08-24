import { CheckProjectDeclaration } from '../../domain/objects/CheckProjectDeclaration';
import { readFileAsync } from '../../utils/fileio/readFileAsync';
import { listFilesInDirectory } from '../../utils/filepaths/listFilesInDirectory';
import { UnexpectedCodePathError } from '../UnexpectedCodePathError';
import { getCheckFileDeclaration } from './getCheckFileDeclaration/getCheckFileDeclaration';

export const getCheckProjectDeclaration = async ({
  declaredProjectDirectory,
}: {
  declaredProjectDirectory: string;
}): Promise<CheckProjectDeclaration> => {
  // grab name from the directory
  const bestPracticeName = (new RegExp(/\/([\w-]+)\/best-practice$/).exec(declaredProjectDirectory) ?? [])[1] ?? null;
  const badPracticeName = (new RegExp(/bad-practices\/([\w-]+)$/).exec(declaredProjectDirectory) ?? [])[1] ?? null;
  const name = bestPracticeName ?? badPracticeName;
  if (!name)
    throw new UnexpectedCodePathError(
      `neither best-practice name nor bad-practice name was extractable from the declared project directory '${declaredProjectDirectory}'`,
    );

  // grab paths to _all_ files in this dir (not just at root level)
  const paths = await listFilesInDirectory(declaredProjectDirectory);

  // grab the meta files (i.e., path matches `${projectRoot}/.declapract.*`)
  const metaFilePaths = paths.filter((path) => new RegExp(/^\.declapract\./).test(path));

  // group all of the other files by main file name (i.e., key = filePath.replace('.declapract.ts$', ''))
  const projectFilePaths = [
    ...new Set(
      paths.filter((path) => !metaFilePaths.includes(path)).map((path) => path.replace(/\.declapract\.ts$/, '')),
    ),
  ];

  // for each "main file", get the CheckFileDefinition, now that we have all the files defined for it
  const checks = await Promise.all(
    projectFilePaths.map((declaredFileCorePath) =>
      getCheckFileDeclaration({ declaredProjectDirectory, declaredFileCorePath }),
    ),
  );

  // get readme contents, if readme defined
  const readme = metaFilePaths.includes('.declapract.readme.md')
    ? await readFileAsync({ filePath: `${declaredProjectDirectory}/.declapract.readme.md` })
    : null;

  // return the project def
  return new CheckProjectDeclaration({
    name,
    dir: declaredProjectDirectory,
    checks,
    readme,
  });
};
