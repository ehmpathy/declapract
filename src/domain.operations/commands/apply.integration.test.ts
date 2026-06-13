import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';
import { removeFileAsync } from '@src/utils/fileio/removeFileAsync';
import { listFilesInDirectory } from '@src/utils/filepaths/listFilesInDirectory';
import { log } from '@src/utils/logger';

import { apply } from './apply';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => log.debug); // swap to log debug so its not displaying during tests by default

// strip ANSI codes for deterministic snapshots across environments
// eslint-disable-next-line no-control-regex
const stripAnsi = (str: string): string => str.replace(/\x1b\[[0-9;]*m/g, '');

describe('apply', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to apply for an example project', async () => {
    const targetDir = `${testAssetsDirectoryPath}/example-project-fails-use-case-lambda-service-for-fixing`;

    // delete the generated files to get the testing environment to the expected state
    const expectedFilesInDirectory = ['.gitignore', 'declapract.use.yml'];
    const filesInDirectory = await listFilesInDirectory({
      directory: targetDir,
    });
    await Promise.all(
      filesInDirectory
        .filter((path) => !expectedFilesInDirectory.includes(path))
        .map((path) => removeFileAsync({ path: `${targetDir}/${path}` })),
    );
    const filesInDirectoryNow = await listFilesInDirectory({
      directory: targetDir,
    });
    expect(filesInDirectoryNow.sort()).toEqual(expectedFilesInDirectory.sort()); // fail if the test environment is not correct

    // now apply
    await apply({
      usePracticesConfigPath: `${targetDir}/declapract.use.yml`,
    });
    // sort log calls and strip ANSI codes to ensure deterministic snapshot
    // (practice evaluation order is non-deterministic, ANSI codes vary by environment)
    const sortedCalls = [...logSpy.mock.calls]
      .map((call) => call.map((arg) => (typeof arg === 'string' ? stripAnsi(arg) : arg)))
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    expect(sortedCalls).toMatchSnapshot();
  });
});
