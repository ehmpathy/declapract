import { promises as fs } from 'fs';
import shell from 'shelljs';

import { ActionUsePracticesConfig } from '../../domain/objects/ActionUsePracticesConfig';
import { ActionUsePracticesConfigInput } from '../../domain/objects/ActionUsePracticesConfigInput';
import { doesDirectoryExist } from '../../utils/fileio/doesDirectoryExist';
import { readYmlFile } from '../../utils/fileio/readYmlFile';
import { getDirOfPath } from '../../utils/filepaths/getDirOfPath';
import { readDeclarePracticesConfig } from '../declaration/readDeclarePracticesConfig';
import { UnexpectedCodePathError } from '../UnexpectedCodePathError';
import { UserInputError } from '../UserInputError';

export const readUsePracticesConfig = async ({
  configPath,
}: {
  configPath: string;
}): Promise<ActionUsePracticesConfig> => {
  const configDir = getDirOfPath(configPath);
  const getAbsolutePathFromRelativeToConfigPath = (relpath: string) => `${configDir}/${relpath}`;

  // get the yml
  const contents = await (async () => {
    try {
      return await readYmlFile({ filePath: configPath });
    } catch (error) {
      throw new UserInputError(`could not read config. ${error.message}. See '${configPath}'`);
    }
  })();

  // validate it into an input object
  const configInput = new ActionUsePracticesConfigInput(contents); // applies runtime validation

  // lookup the declared practices using the path specified
  const declaredPractices = await (async () => {
    // support ssh loading of a git repo containing declarations
    if (configInput.declarations.startsWith('git@github.com')) {
      const [_, repoName] = new RegExp(/git@github.com:\w+\/([\w-\d]+).git$/).exec(configInput.declarations) ?? []; // tslint:disable-line: no-unused
      if (!repoName)
        throw new UnexpectedCodePathError(`could not extract repo name from git path ${configInput.declarations}`);
      const outputDir = getAbsolutePathFromRelativeToConfigPath(`.declapract/${repoName}`);
      const directoryAlreadyExists = await doesDirectoryExist({ directory: outputDir });
      if (!directoryAlreadyExists) {
        // if dir not already exists, then clone it
        const cloneResult = await shell.exec(`git clone ${configInput.declarations} ${outputDir}`);
        if (cloneResult.code !== 0)
          throw new UserInputError(
            `could not clone declarations repo '${configInput.declarations}'. ${cloneResult.stderr ??
              cloneResult.stdout}`,
            {
              potentialSolution: `are you able to run 'git clone ${configInput.declarations}'?`,
            },
          );
      }
      await shell.cd(outputDir);
      await shell.exec('git checkout $(git tag --contains | tail -1)', { silent: true });
      const installResult = await shell.exec('npm install', { silent: true });
      if (installResult.code !== 0)
        throw new UserInputError(
          `could not npm install in repo in '${outputDir}'. ${installResult.stderr ?? installResult.stdout}`,
          {
            potentialSolution: `are you able to run 'npm install' inside of '${outputDir}'?`,
          },
        );
      return readDeclarePracticesConfig({ configPath: `${outputDir}/declapract.declare.yml` });
    }

    // support specifying a relative path
    const specifiedPath = getAbsolutePathFromRelativeToConfigPath(configInput.declarations);
    const specifiedPathStat = await fs.lstat(specifiedPath);
    const path = specifiedPathStat.isDirectory() ? `${specifiedPath}/declapract.declare.yml` : specifiedPath; // if the `declarations` path is a directory, assume that the config file has the default name; otherwise, assume that they specified the whole name
    if (!path.endsWith('.yml'))
      throw new UserInputError(
        `path to declarations must reference a yml file or a directory that has a 'declapract.declare.yml' file. found '${path}' instead`,
      );
    const pathStat = await fs.lstat(path);
    if (!pathStat.isFile())
      throw new UserInputError(`path to declarations does not reference a real file. '${path}' does not exist`);
    return readDeclarePracticesConfig({ configPath: path });
  })();

  // return the config
  return new ActionUsePracticesConfig({
    rootDir: configDir,
    declared: declaredPractices,
    useCase: configInput.useCase,
    variables: configInput.variables ?? {},
  });
};
