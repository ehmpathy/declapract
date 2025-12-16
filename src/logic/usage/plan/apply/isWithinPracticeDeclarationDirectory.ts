/**
 * checks whether a file path is within a practice declaration directory
 * (best-practice or bad-practices)
 *
 * why? because applying fixes to practice declaration files would break the
 * ability to safely apply practices against best practice declaration repos
 */
export const isWithinPracticeDeclarationDirectory = (
  filePath: string,
): boolean => {
  // match paths like: .../practices/.../best-practice/... or .../practices/.../bad-practices/...
  const practiceDeclarationPattern =
    /\/practices\/[^/]+\/(best-practice|bad-practices)\//;
  return practiceDeclarationPattern.test(filePath);
};
