import { FileCheckContext } from '../../domain/objects/FileCheckContext';

export const createExampleFileCheckContext = () =>
  new FileCheckContext({
    projectRootDirectory: '/some/project/root',
    relativeFilePath: 'some/file/path.ts',
    projectVariables: {},
    declaredFileContents: '__DECLARED_CONTENTS__',
  });
