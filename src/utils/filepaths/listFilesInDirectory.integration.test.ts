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
    expect(paths).toContain('filepaths/listFilesInDirectory.integration.test.ts');
    expect(paths).not.toContain('filepaths'); // should not reference the directory itself though
  });
});
