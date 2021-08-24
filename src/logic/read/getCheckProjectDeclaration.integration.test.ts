import { getCheckProjectDeclaration } from './getCheckProjectDeclaration';

describe('getCheckProjectDeclarationFromDirectory', () => {
  it('should define correctly when only one root level file check and a readme', async () => {
    const project = await getCheckProjectDeclaration({
      declaredProjectDirectory: `${__dirname}/../__test_assets__/exampleDeclarations/practices/dates-and-times/best-practice`,
    });
    expect(project.checks.length).toEqual(1);
    expect(project).toMatchSnapshot();
  });
  it('should define correctly when many files in many levels', async () => {
    const project = await getCheckProjectDeclaration({
      declaredProjectDirectory: `${__dirname}/../__test_assets__/exampleDeclarations/practices/terraform/best-practice`,
    });
    expect(project.checks.length).toEqual(7);
    expect(project).toMatchSnapshot();
  });
  it.only('should define correctly for a bad practice', async () => {
    const project = await getCheckProjectDeclaration({
      declaredProjectDirectory: `${__dirname}/../__test_assets__/exampleDeclarations/practices/dates-and-times/bad-practices/moment`,
    });
    expect(project.checks.length).toEqual(1);
    expect(project).toMatchSnapshot();
  });
});
