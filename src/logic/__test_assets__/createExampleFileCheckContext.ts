import { FileCheckContext } from '../../domain/objects/FileCheckContext';

export const createExampleFileCheckContext = () =>
  new FileCheckContext({
    relativeFilePath: 'some/file/path.ts',
    projectVariables: {},
    declaredFileContents: '__DECLARED_CONTENTS__',
    getProjectRootDirectory: () => '/some/project/root',
  });
