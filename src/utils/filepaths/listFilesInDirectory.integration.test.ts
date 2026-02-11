import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';

import { listFilesInDirectory } from './listFilesInDirectory';

describe('listFilesInDirectory', () => {
  it('should find file paths', async () => {
    const paths = await listFilesInDirectory({ directory: __dirname });
    expect(paths).toContain('listFilesInDirectory.ts');
    expect(paths).toContain('listFilesInDirectory.integration.test.ts');
  });
  it('should find files nested in directory', async () => {
    const paths = await listFilesInDirectory({ directory: `${__dirname}/../` });
    expect(paths).toContain('filepaths/listFilesInDirectory.ts');
    expect(paths).toContain(
      'filepaths/listFilesInDirectory.integration.test.ts',
    );
    expect(paths).not.toContain('filepaths'); // should not reference the directory itself though
  });
  it('should find files in nested hidden directories', async () => {
    const directory = `${testAssetsDirectoryPath}/example-project-with-nested-hidden-dirs`;
    const paths = await listFilesInDirectory({ directory });

    // should find top-level file in hidden directory
    expect(paths).toContain('.hidden/top-level.ts');

    // should find file in nested hidden directory (the bug case)
    expect(paths).toContain('.hidden/.nested/deep-file.ts');

    // should find file in alternate hidden directory structure
    expect(paths).toContain('.hidden/visible/.another-hidden/deep-file.ts');

    // should find regular files too
    expect(paths).toContain('regular/file.ts');
  });
});
