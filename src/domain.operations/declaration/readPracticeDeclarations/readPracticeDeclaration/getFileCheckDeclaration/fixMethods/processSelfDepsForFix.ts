import { isLinkedDependencyVersion } from '@src/domain.operations/declaration/readPracticeDeclarations/readPracticeDeclaration/getFileCheckDeclaration/checkExpressions/check.minVersion';

import { emitSelfDepWarn } from './emitSelfDepWarn';
import { isSelfDependency } from './isSelfDependency';

const DEP_KEYS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;

/**
 * .what = processes self-deps in declared JSON for the fix phase
 * .why = self-deps should be omitted (not added/upgraded) unless extant is link:./file:.
 *
 * returns a modified declared object with self-deps removed (except preserved link:./file:.)
 * emits warns for each self-dep action taken
 */
export const processSelfDepsForFix = (input: {
  declared: Record<string, unknown>;
  found: Record<string, unknown>;
  targetPackageName: string;
}): Record<string, unknown> => {
  const result = { ...input.declared };

  // process each dependency type
  for (const depKey of DEP_KEYS) {
    const declaredDeps = result[depKey];
    if (!declaredDeps || typeof declaredDeps !== 'object') continue;

    const foundDeps = input.found[depKey];
    const foundDepsObj =
      foundDeps && typeof foundDeps === 'object'
        ? (foundDeps as Record<string, unknown>)
        : {};

    // process each dep in this type
    const filteredDeps: Record<string, unknown> = {};
    for (const [packageName, declaredVersion] of Object.entries(
      declaredDeps as Record<string, unknown>,
    )) {
      const isSelfDep = isSelfDependency({
        packageName: input.targetPackageName,
        dependencyKey: packageName,
      });

      // if not a self-dep, keep it
      if (!isSelfDep) {
        filteredDeps[packageName] = declaredVersion;
        continue;
      }

      // handle self-dep
      const extantValue = foundDepsObj[packageName];

      // if extant value is link:./file:., preserve it
      if (isLinkedDependencyVersion({ value: extantValue })) {
        emitSelfDepWarn({
          packageName,
          declaredVersion: String(declaredVersion),
          action: 'preserved',
        });
        // keep the declared version so deepReplace will evaluate it
        // (minVersion check passes for link:./file:., so extant is preserved)
        filteredDeps[packageName] = declaredVersion;
        continue;
      }

      // otherwise, omit this self-dep (don't add it to filteredDeps)
      emitSelfDepWarn({
        packageName,
        declaredVersion: String(declaredVersion),
        action: 'omitted',
      });
    }

    // update result with filtered deps
    if (Object.keys(filteredDeps).length === 0) {
      delete result[depKey];
    } else {
      result[depKey] = filteredDeps;
    }
  }

  return result;
};
