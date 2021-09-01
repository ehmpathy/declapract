import fs from 'fs';
import util from 'util';

const unlink = util.promisify(fs.unlink);

export const removeFileAsync = async ({ path }: { path: string }) => unlink(path);
