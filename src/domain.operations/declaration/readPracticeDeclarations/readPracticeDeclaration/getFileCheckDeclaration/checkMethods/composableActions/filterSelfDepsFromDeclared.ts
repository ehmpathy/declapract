import { isSelfDependency } from '../../fixMethods/isSelfDependency';

const DEP_KEYS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;

/**
 * .what = filters self-dependencies from declared JSON before check comparison
 * .why = self-deps are omitted in fix phase, so check phase must pass them to avoid infinite loop
 */
export const filterSelfDepsFromDeclared = (input: {
  declared: Record<string, unknown>;
  targetPackageName: string;
}): Record<string, unknown> => {
  const result = { ...input.declared };

  // process each dependency-like key
  for (const depKey of DEP_KEYS) {
    const deps = result[depKey];
    if (!deps || typeof deps !== 'object') continue;

    // filter out self-deps from this dependency object
    const filteredDeps: Record<string, unknown> = {};
    for (const [packageName, version] of Object.entries(
      deps as Record<string, unknown>,
    )) {
      const isSelfDep = isSelfDependency({
        packageName: input.targetPackageName,
        dependencyKey: packageName,
      });

      // skip self-deps — they'll be omitted in fix phase
      if (isSelfDep) continue;

      filteredDeps[packageName] = version;
    }

    // if all deps were filtered out, remove the key entirely
    if (Object.keys(filteredDeps).length === 0) {
      delete result[depKey];
    } else {
      result[depKey] = filteredDeps;
    }
  }

  return result;
};
