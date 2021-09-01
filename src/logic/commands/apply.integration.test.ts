import { removeFileAsync } from '../../utils/fileio/removeFileAsync';
import { listFilesInDirectory } from '../../utils/filepaths/listFilesInDirectory';
import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { apply } from './apply';

const logSpy = jest.spyOn(console, 'log');

describe('apply', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to apply for an example project', async () => {
    const targetDir = `${testAssetsDirectoryPath}/example-project-fails-use-case-lambda-service-for-fixing`;

    // delete the generated files to get the testing environment to the expected state
    const expectedFilesInDirectory = ['.gitignore', 'declapract.use.yml'];
    const filesInDirectory = await listFilesInDirectory(targetDir);
    await Promise.all(
      filesInDirectory
        .filter((path) => !expectedFilesInDirectory.includes(path))
        .map((path) => removeFileAsync({ path: `${targetDir}/${path}` })),
    );
    const filesInDirectoryNow = await listFilesInDirectory(targetDir);
    expect(filesInDirectoryNow).toEqual(expectedFilesInDirectory); // fail if the test environment is not correct

    // now apply
    await apply({
      usePracticesConfigPath: `${targetDir}/declapract.use.yml`,
    });
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
});
