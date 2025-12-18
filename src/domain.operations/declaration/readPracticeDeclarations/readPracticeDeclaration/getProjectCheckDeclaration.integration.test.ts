import { FileCheckPurpose } from '@src/domain.objects';
import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';

import { getProjectCheckDeclaration } from './getProjectCheckDeclaration';

describe('getProjectCheckDeclarationFromDirectory', () => {
  it('should define correctly when only one root level file check and a readme', async () => {
    const project = await getProjectCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times/best-practice`,
    });
    expect(project.checks.length).toEqual(1);
    expect(project).toMatchSnapshot();
  });
  it('should define correctly when many files in many levels', async () => {
    const project = await getProjectCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/terraform/best-practice`,
    });
    expect(project.checks.length).toEqual(7);
    expect(project).toMatchSnapshot();
  });
  it('should define correctly for a bad practice', async () => {
    const project = await getProjectCheckDeclaration({
      purpose: FileCheckPurpose.BAD_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times/bad-practices/moment`,
    });
    expect(project.checks.length).toEqual(1);
    expect(project).toMatchSnapshot();
  });
  it('should still have the fix functions defined on the file checks', async () => {
    const project = await getProjectCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier/best-practice`,
    });
    expect(project.checks[0]!.fix).toBeDefined();
    expect(project.checks[0]!.fix).not.toBeNull();
    expect(project).toMatchSnapshot();
  });
});
