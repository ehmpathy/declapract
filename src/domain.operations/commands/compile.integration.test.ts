import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';
import { removeDirectoryAsync } from '@src/utils/fileio/removeDirectoryAsync';
import { listFilesInDirectory } from '@src/utils/filepaths/listFilesInDirectory';
import { log } from '@src/utils/logger';

import { compile } from './compile';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => log.debug); // swap to log debug so its not displaying during tests by default

describe('compile', () => {
  it("should be able to correctly compile declarations, with '*' substitution", async () => {
    const srcDir = `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/src`;
    const distDir = `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/dist`;

    // clean up the test env
    await removeDirectoryAsync({
      directory: distDir,
    });

    // compile
    await compile({
      sourceDirectory: srcDir,
      distributionDirectory: distDir,
    });

    // and check that the files are correctly defined
    const filesInDistDir = await listFilesInDirectory({ directory: distDir });
    expect(filesInDistDir).toContain(
      'practices/directory-structure-src/best-practice/src/domain.operations/<star><star>/<star>.ts.declapract.ts', // should replace `*` with `<star>`
    );
    expect(filesInDistDir).not.toContain(
      'practices/prettier/best-practice/package.json.declapract.test.ts', // should skip .declapract.test.ts files
    );
    expect(filesInDistDir.sort()).toMatchSnapshot();

    // and check display output
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
});
