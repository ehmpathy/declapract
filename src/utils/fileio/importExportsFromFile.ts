import { register } from 'ts-node';
import { UnexpectedCodePathError } from '../../logic/UnexpectedCodePathError';

const nodeModulesToTSNodeTranspileOnImport: string[] = [];
const isExplicitImportToNodeModule = (filePath: string) => new RegExp(/node_modules\//).test(filePath);
const extractNodeModuleNameFromFilePath = (filePath: string): string | null =>
  (new RegExp(/node_modules\/([\w-]+)\//).exec(filePath) ?? [])[1] ?? null;
const addNodeModuleToListOfModulesToAllowTranspilation = ({ nodeModuleName }: { nodeModuleName: string }) => {
  // check that this is not a redundant op
  if (nodeModulesToTSNodeTranspileOnImport.includes(nodeModuleName)) return; // do nothing if its already supported

  // add this module to the list, for future reference
  nodeModulesToTSNodeTranspileOnImport.push(nodeModuleName);

  // now update ts-node registration to include this as a supported module
  register({
    typeCheck: false,
    transpileOnly: true,
    files: true,
    ignore: nodeModulesToTSNodeTranspileOnImport.map((moduleName) => `/node_modules/(?!${moduleName})/`),
    skipProject: true,
    compilerOptions: {
      esModuleInterop: true,
    },
  });
};

/**
 * runs `import(filePath)` on the file path, while also considering whether or not we need to update ts-node to support transpiling it (e.g., if its in `/node_modules/` dir)
 *
 * note: this fn keeps track of which node modules we've been asked to explicitly import from - and tells tsnode to parse them by adding them to the list of not ignored modules
 */
export const importExportsFromFile = async ({ filePath }: { filePath: string }) => {
  if (isExplicitImportToNodeModule(filePath)) {
    const nodeModuleName = extractNodeModuleNameFromFilePath(filePath);
    if (!nodeModuleName)
      throw new UnexpectedCodePathError(
        'got a file path attempting to import a node module but could not extract node module name from it',
      );
    addNodeModuleToListOfModulesToAllowTranspilation({ nodeModuleName });
  }
  return import(filePath);
};
