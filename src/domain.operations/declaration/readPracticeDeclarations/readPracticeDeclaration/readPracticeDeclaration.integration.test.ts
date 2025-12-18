import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';

import { readPracticeDeclaration } from './readPracticeDeclaration';

describe('readPracticeDeclarationFromDirectory', () => {
  it('should define correctly when only the best-practice is defined', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/util-sleep`,
    });
    // console.log(JSON.stringify(practice, null, 2));
    expect(practice.bestPractice).not.toEqual(null);
    expect(practice.badPractices.length).toEqual(0);
    expect(practice).toMatchSnapshot();
  });
  it('should define correctly when a bad-practice is defined', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
    });
    expect(practice.bestPractice).not.toEqual(null);
    expect(practice.badPractices.length).toEqual(1);
    expect(practice).toMatchSnapshot();
  });
  it('should define correctly when best and bad practices are defined', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src`,
    });
    expect(practice.bestPractice).not.toEqual(null);
    expect(practice.badPractices.length).toEqual(2);
    expect(practice).toMatchSnapshot();
  });
  it('should still have the fix functions defined on the file checks', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    expect(practice.bestPractice?.checks[0]?.fix).toBeDefined();
    expect(practice.bestPractice?.checks[0]?.fix).not.toEqual(null);
    expect(practice.bestPractice).not.toEqual(null);
    expect(practice.badPractices.length).toEqual(0);
    expect(practice).toMatchSnapshot();
  });
});
