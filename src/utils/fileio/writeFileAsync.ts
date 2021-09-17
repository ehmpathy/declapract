import fs from 'fs';
import util from 'util';
import { getDirOfPath } from '../filepaths/getDirOfPath';
import { makeDirectoryAsync } from './makeDirAsync';

// export these from a seperate file to make testing easier (i.e., easier to define the mocks)
export const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

export const writeFileAsync = async ({ path, content }: { path: string; content: string }) => {
  await makeDirectoryAsync({ directoryPath: await getDirOfPath(path) }); // find or create the dir, before writing the file to the dir
  await writeFile(
    path,
    `${content.replace(/\n$/, '')}\n`, // ensure there's always a newline at end of file
  );
};
