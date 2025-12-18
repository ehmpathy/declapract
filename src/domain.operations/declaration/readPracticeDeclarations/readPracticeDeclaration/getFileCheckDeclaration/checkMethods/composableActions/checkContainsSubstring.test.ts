import { checkContainsSubstring } from './checkContainsSubstring';

describe('checkContainsSubstring', () => {
  it('should return nothing when the string is a substring', () => {
    const result = checkContainsSubstring({
      declaredContents: 'a-substring',
      foundContents: 'a-big-string with a-substring inside',
    });
    expect(result).not.toBeDefined();
  });
  it('should throw an error with a good looking diff when not equal', () => {
    try {
      checkContainsSubstring({
        declaredContents: 'a-substring',
        foundContents: 'a-big-string with a-different-substring inside',
      });
      fail('should not reach here');
    } catch (error) {
      expect((error as Error).message).toContain('toContain');
      expect((error as Error).message).toMatchSnapshot(); // log example of it
    }
  });
});
