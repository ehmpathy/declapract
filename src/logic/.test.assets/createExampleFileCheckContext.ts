import { FileCheckContext } from '@src/domain/objects/FileCheckContext';

export const createExampleFileCheckContext = () =>
  new FileCheckContext({
    relativeFilePath: 'some/file/path.ts',
    projectVariables: {},
    projectPractices: [],
    declaredFileContents: '__DECLARED_CONTENTS__',
    required: true,
    getProjectRootDirectory: () => '/some/project/root',
  });
