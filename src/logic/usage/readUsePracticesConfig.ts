import { findNearestPackageJson } from 'find-nearest-package-json';
import { promises as fs } from 'fs';

import { ActionUsePracticesConfig } from '../../domain/objects/ActionUsePracticesConfig';
import { ActionUsePracticesConfigInput } from '../../domain/objects/ActionUsePracticesConfigInput';
import { doesDirectoryExist } from '../../utils/fileio/doesDirectoryExist';
import { doesFileExist } from '../../utils/fileio/doesFileExist';
import { readYmlFile } from '../../utils/fileio/readYmlFile';
import { getDirOfPath } from '../../utils/filepaths/getDirOfPath';
import { withDurationReporting } from '../../utils/wrappers/withDurationReporting';
import { readDeclarePracticesConfig } from '../declaration/readDeclarePracticesConfig';
import { UserInputError } from '../UserInputError';

export const readUsePracticesConfig = withDurationReporting(
  'readUsePracticesConfig',
  async ({ configPath }: { configPath: string }): Promise<ActionUsePracticesConfig> => {
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
      // support npm module loading of declarations
      if (configInput.declarations.startsWith('npm:')) {
        // package name
        const packageName = configInput.declarations.slice('npm:'.length);

        // if it starts with npm, then make sure that it is installed in package.json
        const { data: packageJsonContents } = await findNearestPackageJson(configDir); // nearest to the config
        if (!(packageJsonContents.devDependencies ?? {})[packageName])
          throw new UserInputError(
            `specified declarations in npm module, but module is not specified as a devDependency: '${configInput.declarations}'`,
            { potentialSolution: `try installing the module, for example: 'npm install --save-dev ${packageName}'` },
          );

        // now check that it is actually in node_modules dir
        const expectedDirectoryRelativePath = `node_modules/${packageName}`;
        const directoryExists = await doesDirectoryExist({
          directory: getAbsolutePathFromRelativeToConfigPath(expectedDirectoryRelativePath),
        });
        if (!directoryExists)
          throw new UserInputError(
            `declarations module not found in the node_modules directory: '${packageName}' (checked '${expectedDirectoryRelativePath}')`,
            {
              potentialSolution: "make sure you've ran npm install in this project already. e.g., 'npm install'",
            },
          );

        // now check that the file exists in the expected spot in that module
        const expectedDeclarationsConfigRelativeFilePath = `${expectedDirectoryRelativePath}/declapract.declare.yml`;
        const declarationsConfigFileExists = await doesFileExist({
          filePath: getAbsolutePathFromRelativeToConfigPath(expectedDeclarationsConfigRelativeFilePath),
        });
        if (!declarationsConfigFileExists)
          throw new UserInputError(
            `declarations module was found in node_modules directory, but it does not have a 'declapract.declare.yml' file inside of it: '${expectedDeclarationsConfigRelativeFilePath}'`,
          );

        // now read declarations from that file
        return readDeclarePracticesConfig({
          configPath: getAbsolutePathFromRelativeToConfigPath(expectedDeclarationsConfigRelativeFilePath),
        });
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
  },
);
