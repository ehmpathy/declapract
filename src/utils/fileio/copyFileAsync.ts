import fs from 'fs';
import util from 'util';
import { getDirOfPath } from '../filepaths/getDirOfPath';
import { makeDirectoryAsync } from './makeDirAsync';

const copyFile = util.promisify(fs.copyFile);

export const copyFileAsync = async ({ from, to }: { from: string; to: string }) => {
  await makeDirectoryAsync({ directoryPath: await getDirOfPath(to) }); // find or create the dir, before writing the file to the dir
  await copyFile(from, to);
};
