/**
 * .what = checks if a dependency key matches the package's own name
 * .why = detects self-dependencies that would cause circular install issues
 */
export const isSelfDependency = (input: {
  packageName: string | null;
  dependencyKey: string;
}): boolean => {
  // skip detection if package name is unknown
  if (input.packageName === null) return false;

  // exact string compare handles scoped packages correctly
  return input.packageName === input.dependencyKey;
};
