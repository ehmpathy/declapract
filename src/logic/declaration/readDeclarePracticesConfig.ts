import { config } from 'shelljs';
import { ActionDeclarePracticesConfigInput } from '../../domain/objects/ActionDeclarePracticesConfigInput';
import { DeclaredPractices } from '../../domain/objects/DeclaredPractices';
import { readYmlFile } from '../../utils/fileio/readYmlFile';
import { getDirOfPath } from '../../utils/filepaths/getDirOfPath';
import { UserInputError } from '../UserInputError';
import { readExampleDeclarations } from './readPracticeDeclarations/readExampleDeclarations';
import { readPracticeDeclarations } from './readPracticeDeclarations/readPracticeDeclarations';
import { readUseCaseDeclarations } from './readPracticeDeclarations/readUseCaseDeclarations';

export const readDeclarePracticesConfig = async ({
  configPath,
}: {
  configPath: string;
}): Promise<DeclaredPractices> => {
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
  const configInput = new ActionDeclarePracticesConfigInput(contents); // applies runtime validation

  // define the practices based on the input
  const practices = await readPracticeDeclarations({
    declaredPracticesDirectory: getAbsolutePathFromRelativeToConfigPath(configInput.declare.practices),
  });

  // define the examples based on the input
  const examples = configInput.declare.examples
    ? await readExampleDeclarations({
        declarationsRootDirectory: configDir,
        declaredExamplesDirectory: getAbsolutePathFromRelativeToConfigPath(configInput.declare.examples),
      })
    : [];

  // define the use cases based on the input
  const useCases = await readUseCaseDeclarations({
    declaredUseCasesPath: getAbsolutePathFromRelativeToConfigPath(configInput.declare['use-cases']),
    practices,
    examples,
  });

  // return the config
  return new DeclaredPractices({
    rootDir: configDir,
    practices,
    useCases,
    examples,
  });
};
