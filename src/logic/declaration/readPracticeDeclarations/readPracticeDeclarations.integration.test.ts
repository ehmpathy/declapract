import { testAssetsDirectoryPath } from '../../.test.assets/dirPath';
import { readPracticeDeclarations } from './readPracticeDeclarations';

describe('readPracticeDeclarations', () => {
  it('should get the declarations correctly', async () => {
    const practices = await readPracticeDeclarations({
      declaredPracticesDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices`,
    });
    expect(practices.length).toBeGreaterThanOrEqual(7);
    expect(practices).toMatchSnapshot();
  });
});
