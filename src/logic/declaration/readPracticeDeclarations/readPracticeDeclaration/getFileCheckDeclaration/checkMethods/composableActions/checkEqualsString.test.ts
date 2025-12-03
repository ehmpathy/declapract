import { checkEqualsString } from './checkEqualsString';

describe('checkEqualsString', () => {
  it('should return nothing when the string are equal', () => {
    const result = checkEqualsString({
      declaredContents: 'a-string',
      foundContents: 'a-string',
    });
    expect(result).not.toBeDefined();
  });
  it('should throw an error with a good looking diff when not equal', () => {
    try {
      checkEqualsString({
        declaredContents: 'a-string',
        foundContents: 'b-string',
      });
      fail('should not reach here');
    } catch (error) {
      expect((error as Error).message).toContain('toEqual');
      expect((error as Error).message).toMatchSnapshot(); // log example of it
    }
  });
});
