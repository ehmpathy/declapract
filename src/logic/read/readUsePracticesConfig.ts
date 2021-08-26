import { promises as fs } from 'fs';

import { ActionUsePracticesConfig } from '../../domain/objects/ActionUsePracticesConfig';
import { ActionUsePracticesConfigInput } from '../../domain/objects/ActionUsePracticesConfigInput';
import { readYmlFile } from '../../utils/fileio/readYmlFile';
import { getDirOfPath } from '../../utils/filepaths/getDirOfPath';
import { UserInputError } from '../UserInputError';
import { readDeclarePracticesConfig } from './readDeclarePracticesConfig';

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
    // support ssh loading of a git repo
    // TODO

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
