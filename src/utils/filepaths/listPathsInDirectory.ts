import fs from 'fs';
import util from 'util';

// export these from a separate file to make testing easier (i.e., easier to define the mocks)
const readdir = util.promisify(fs.readdir);

export const listPathsInDirectory = ({ directory }: { directory: string }) => readdir(directory);
