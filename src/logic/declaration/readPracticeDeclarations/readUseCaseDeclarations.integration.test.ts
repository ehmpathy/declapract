import { testAssetsDirectoryPath } from '../../__test_assets__/dirPath';
import { readExampleDeclarations } from './readExampleDeclarations';
import { readPracticeDeclarations } from './readPracticeDeclarations';
import { readUseCaseDeclarations } from './readUseCaseDeclarations';

describe('readUseCaseDeclarations', () => {
  it('should get the declarations correctly', async () => {
    const practices = await readPracticeDeclarations({
      declaredPracticesDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices`,
    });
    const examples = await readExampleDeclarations({
      declaredExamplesDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/examples`,
    });
    const useCases = await readUseCaseDeclarations({
      declaredUseCasesPath: `${testAssetsDirectoryPath}/example-best-practices-repo/src/useCases.yml`,
      practices,
      examples,
    });
    expect(useCases.length).toEqual(2);
    expect(useCases).toMatchSnapshot();
  });
});
