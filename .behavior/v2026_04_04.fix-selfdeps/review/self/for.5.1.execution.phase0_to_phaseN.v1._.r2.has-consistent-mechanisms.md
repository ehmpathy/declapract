# self-review r2: has-consistent-mechanisms

## the review

i searched the codebase for related codepaths and checked each new mechanism for duplication.

### new mechanisms created

1. `isSelfDependency.ts` - checks if packageName equals dependencyKey
2. `isSelfRefProtocol.ts` - checks if value starts with `link:` or `file:`
3. `emitSelfDepWarn.ts` - emits console.log warn
4. `filterSelfDepsFromDeclared.ts` - filters self-deps from declared JSON
5. `processSelfDepsForFix.ts` - processes self-deps for fix phase

### search for duplicates

#### isSelfDependency

**search**: grep for string equality checks on package names

**result**: no extant mechanism. this is a new domain concept (self-dependency detection).

#### isSelfRefProtocol

**search**: grep for `link:` or `file:` prefix checks

**result**: found `isLinkedDependencyVersion` in check.minVersion.ts

**potential duplication?** yes — both check for `link:` or `file:` prefix.

**analysis**:
- `isLinkedDependencyVersion` lives in checkExpressions (minVersion domain)
- `isSelfRefProtocol` lives in fixMethods (self-dep domain)
- both use identical logic: `value.startsWith('link:') || value.startsWith('file:')`

**decision**: this is a **potential issue** worth review.

options:
1. reuse `isLinkedDependencyVersion` from checkExpressions
2. extract a shared utility to utils/
3. keep separate (different conceptual domains)

**open question for wisher**: should we consolidate `isSelfRefProtocol` with `isLinkedDependencyVersion`?

#### emitSelfDepWarn

**search**: grep for console.log warn patterns

**result**: no extant warn emitter. declapract logs via console.log directly in various places.

#### filterSelfDepsFromDeclared / processSelfDepsForFix

**search**: grep for dependency filter patterns

**result**: no extant mechanism. these are new domain concepts for self-dep detection.

## conclusion

one potential duplication found: `isSelfRefProtocol` and `isLinkedDependencyVersion` perform identical logic.

**open question**: consolidate or keep separate?

i kept them separate because they serve different conceptual purposes:
- `isLinkedDependencyVersion` answers "does this pass a minVersion check?"
- `isSelfRefProtocol` answers "is this an intentional self-reference?"

but they use identical logic. wisher may prefer consolidation.
