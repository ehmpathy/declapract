import { removeDirectoryAsync } from '../../utils/fileio/removeDirectoryAsync';
import { listFilesInDirectory } from '../../utils/filepaths/listFilesInDirectory';
import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { compile } from './compile';

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
      'practices/directory-structure-src/best-practice/src/logic/<star><star>/<star>.ts.declapract.ts',
    );
    expect(filesInDistDir).toMatchSnapshot();
  });
});
