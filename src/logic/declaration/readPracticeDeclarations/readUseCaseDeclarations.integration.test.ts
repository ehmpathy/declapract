import { testAssetsDirectoryPath } from '../../__test_assets__/dirPath';
import { readPracticeDeclarations } from './readPracticeDeclarations';
import { readUseCaseDeclarations } from './readUseCaseDeclarations';

describe('readUseCaseDeclarations', () => {
  it('should get the declarations correctly', async () => {
    const practices = await readPracticeDeclarations({
      declaredPracticesDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices`,
    });
    const useCases = await readUseCaseDeclarations({
      declaredUseCasesPath: `${testAssetsDirectoryPath}/example-best-practices-repo/src/useCases.yml`,
      practices,
    });
    expect(useCases.length).toEqual(2);
    expect(useCases).toMatchSnapshot();
  });
});
