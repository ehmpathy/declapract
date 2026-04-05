# self-review r4: has-consistent-conventions

## the review

i analyzed the name conventions in my new code against extant patterns in the codebase.

### variable name conventions

**search**: `grep -r 'packageName|depName' src/` — found extant usage in readUsePracticesConfig.ts

**result**: the codebase uses `packageName` (not `pkgName`, `package`, or `depName`).

my code uses:
- `packageName` — consistent with extant
- `dependencyKey` — for the key in dependencies object (no extant term; clear and descriptive)
- `targetPackageName` — for the package.json name field (composition of extant `packageName`)

**search**: `grep -r 'declared|found' src/domain.operations/` — found extant usage

**result**: the codebase uses:
- `declared` for what the practice declares (e.g., `declaredPractices`, `declaredNewContents`)
- `found` for what was found in the file (e.g., `foundContents`)

my code uses:
- `declared` parameter — consistent with extant
- `found` parameter — consistent with extant
- `declaredDeps`, `foundDeps` — compositions follow the same pattern

### new function names

| function | pattern | extant examples | assessment |
|----------|---------|-----------------|------------|
| `isSelfDependency` | `is*` | `isOfFileCheckType`, `isWithinPracticeDeclarationDirectory`, `isLinkedDependencyVersion` | ✓ consistent |
| `filterSelfDepsFromDeclared` | `filter*` | `filterPracticeEvaluationsFromPlans` | ✓ consistent |
| `emitSelfDepWarn` | `emit*` | (none) | new pattern |
| `processSelfDepsForFix` | `process*` | (none) | new pattern |

### analysis of new patterns

#### emitSelfDepWarn

**search**: `grep -r '^export const emit[A-Z]' src/` — no hits except my file

**extant approach**: the codebase uses inline `console.log` directly:
- `console.log('🔎 read configs...')` in apply.ts
- `console.log(chalk.gray('  ✓ evaluated practice:...'))` in evaluateProjectAgainstPracticeDeclaration.ts
- `console.warn(...)` in readPracticeDeclarations.ts

**why i chose `emit*`**: the warn format is reused in two places (omit + preserve) with identical structure. to extract to a function follows rule.prefer.wet-over-dry at 2+ usages. the verb "emit" captures the action (side effect: output to console).

**alternative considered**: `displaySelfDepWarn` — but `display*` functions in the codebase format and output structured data (like `displayPlan`). my function is simpler: emit a specific warn message.

**verdict**: the new pattern is justified. to inline would duplicate the box-draw format in two places.

#### processSelfDepsForFix

**search**: `grep -r '^export const process[A-Z]' src/` — no hits except my file

**extant patterns analyzed**:
- `filter*` — pure filter based on predicate
- `get*` — retrieval/lookup
- `evaluate*` — assessment with structured output
- `apply*` — mutation with side effects

**why i chose `process*`**: this function does conditional transformation:
- omit self-deps (if version)
- preserve self-deps (if link:./file:.)
- emit warns for each action

it's not a pure filter (it doesn't just exclude), not a simple getter, not an evaluator. "process" captures the conditional transformation accurately.

**alternative considered**:
- `transformSelfDepsForFix` — closer, but "transform" implies deterministic map. this function conditionally includes/excludes.
- `filterSelfDepsForFix` — leads to wrong expectation, since it also preserves and emits warns.

**verdict**: the new pattern is justified. no extant pattern fits the conditional-transform-with-side-effects semantics.

### file location conventions

my new files are in `fixMethods/`:
- `isSelfDependency.ts` — transformer (pure check)
- `emitSelfDepWarn.ts` — communicator (side effect)
- `processSelfDepsForFix.ts` — orchestrator (composes transformer + communicator)
- `filterSelfDepsFromDeclared.ts` — placed in `checkMethods/composableActions/` since it's for check phase

**assessment**: file locations follow the extant directory structure. check-phase utilities in `checkMethods/composableActions/`, fix-phase utilities in `fixMethods/`.

## conclusion

two new name patterns (`emit*`, `process*`) but both are justified:
- no extant pattern fits the semantics
- alternatives would lead to wrong expectations

all other names follow extant conventions.
