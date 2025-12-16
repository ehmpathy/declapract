import { isWithinPracticeDeclarationDirectory } from './isWithinPracticeDeclarationDirectory';

describe('isWithinPracticeDeclarationDirectory', () => {
  describe('best-practice directories', () => {
    it('should return true for a file within a best-practice directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/prettier/best-practice/prettier.config.js',
        ),
      ).toBe(true);
    });

    it('should return true for a nested file within a best-practice directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/terraform/best-practice/terraform/modules/main.tf',
        ),
      ).toBe(true);
    });

    it('should return true for a declapract metadata file within a best-practice directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/npm/best-practice/package.json.declapract.ts',
        ),
      ).toBe(true);
    });
  });

  describe('bad-practices directories', () => {
    it('should return true for a file within a bad-practices directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/format/bad-practices/prettier/prettier.config.js',
        ),
      ).toBe(true);
    });

    it('should return true for a nested file within a bad-practices directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/terraform/bad-practices/tfvars/terraform/env.tfvars',
        ),
      ).toBe(true);
    });
  });

  describe('non-practice directories', () => {
    it('should return false for a file in a regular src directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/logic/commands/apply.ts',
        ),
      ).toBe(false);
    });

    it('should return false for a file in an examples directory', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/examples/lambda-service/package.json',
        ),
      ).toBe(false);
    });

    it('should return false for a project file that happens to contain "best-practice" in its name', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/best-practice-guide.md',
        ),
      ).toBe(false);
    });

    it('should return false for a file in a practices directory but not in best-practice or bad-practices', () => {
      expect(
        isWithinPracticeDeclarationDirectory(
          '/home/user/repo/src/practices/prettier/readme.md',
        ),
      ).toBe(false);
    });
  });
});
