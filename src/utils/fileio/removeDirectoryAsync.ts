import fs from 'fs';
import util from 'util';

const rmdir = util.promisify(fs.rmdir);

export const removeDirectoryAsync = ({ directory }: { directory: string }) => rmdir(directory, { recursive: true });
