import { listPathsInDirectory } from './listPathsInDirectory';

describe('listPathsInDirectory', () => {
  it('should find file paths', async () => {
    const paths = await listPathsInDirectory({ directory: __dirname });
    expect(paths).toContain('listPathsInDirectory.ts');
    expect(paths).toContain('listPathsInDirectory.integration.test.ts');
  });
  it('should find directory paths', async () => {
    const paths = await listPathsInDirectory({ directory: `${__dirname}/../` });
    expect(paths).toContain('fileio');
    expect(paths).toContain('filepaths');
  });
});
