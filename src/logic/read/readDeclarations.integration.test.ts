import { readDeclarations } from './readDeclarations';

describe('readDeclarations', () => {
  it('should get the declarations correctly', async () => {
    const declarations = await readDeclarations({
      declarationsDir: `${__dirname}/../__test_assets__/exampleDeclarations`,
    });
    expect(declarations.useCases.length).toEqual(1);
    expect(declarations.practices.length).toEqual(6);
    expect(declarations).toMatchSnapshot();
  });
});
