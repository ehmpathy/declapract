# self-review r7: role-standards-adherance

## the review

i reviewed all changed src files against mechanic role standards.

### rule directories checked

| directory | rules relevant to this code |
|-----------|----------------------------|
| practices/code.prod/evolvable.procedures | arrow-only, input-context-pattern, single-responsibility |
| practices/code.prod/readable.comments | what-why-headers |
| practices/code.prod/readable.narrative | forbid-else-branches, require-named-transformers |
| practices/code.prod/pitofsuccess.errors | failfast |
| practices/code.prod/pitofsuccess.typedefs | require-shapefit |
| practices/code.test | given-when-then, data-driven |

### rule verification by file

#### isSelfDependency.ts

| rule | status | evidence |
|------|--------|----------|
| arrow-only | ✓ | `export const isSelfDependency = (input: ...): boolean =>` |
| input-context-pattern | ✓ | single `input` param with typed object |
| what-why-headers | ✓ | has `.what` and `.why` header |
| single-responsibility | ✓ | one function, one file |
| shapefit | ✓ | no `as` casts, types fit naturally |

**code excerpt** (line 1-14):
```ts
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
```

**why it holds**:
- line 5: arrow function syntax (not `function` keyword)
- line 5-8: input typed as object (input-context pattern)
- line 1-4: has `.what` and `.why` jsdoc header
- line 10: early return for null case (failfast pattern)
- no else branches — uses early return

#### emitSelfDepWarn.ts

| rule | status | evidence |
|------|--------|----------|
| arrow-only | ✓ | uses `export const emitSelfDepWarn = (input: ...): void =>` |
| input-context-pattern | ✓ | single `input` param with typed object |
| what-why-headers | ✓ | has `.what` and `.why` header |
| single-responsibility | ✓ | one function, one file |
| forbid-else-branches | ✓ | uses if/else but both are action paths (not early return pattern) |

#### processSelfDepsForFix.ts

| rule | status | evidence |
|------|--------|----------|
| arrow-only | ✓ | uses `export const processSelfDepsForFix = (input: ...): ... =>` |
| input-context-pattern | ✓ | single `input` param with typed object |
| what-why-headers | ✓ | has `.what` and `.why` header |
| single-responsibility | ✓ | one orchestrator function |
| require-named-transformers | ✓ | uses named `isSelfDependency`, `isLinkedDependencyVersion`, `emitSelfDepWarn` |
| forbid-else-branches | ✓ | no else branches — uses `if (x) continue` pattern |

**why require-named-transformers holds** (imports line 1-4):
```ts
import { isLinkedDependencyVersion } from '@src/.../check.minVersion';
import { emitSelfDepWarn } from './emitSelfDepWarn';
import { isSelfDependency } from './isSelfDependency';
```
all boolean checks and side effects are named operations, not inline decode-friction.

**why forbid-else-branches holds** (line 49-76):
```ts
if (!isSelfDep) {
  filteredDeps[packageName] = declaredVersion;
  continue;  // early continue, not else
}

if (isLinkedDependencyVersion({ value: extantValue })) {
  emitSelfDepWarn({ ... action: 'preserved' });
  filteredDeps[packageName] = declaredVersion;
  continue;  // early continue, not else
}

// otherwise, omit
emitSelfDepWarn({ ... action: 'omitted' });
// (no add to filteredDeps = omit)
```
uses `if (x) { ... continue; }` pattern — no else branches.

#### filterSelfDepsFromDeclared.ts

| rule | status | evidence |
|------|--------|----------|
| arrow-only | ✓ | arrow function syntax |
| input-context-pattern | ✓ | single `input` param |
| what-why-headers | ✓ | has `.what` and `.why` header |
| require-named-transformers | ✓ | uses `isSelfDependency` |

#### check.minVersion.ts (changes only)

| rule | status | evidence |
|------|--------|----------|
| what-why-headers | ✓ | isLinkedDependencyVersion has `.what` and `.why` |
| single-responsibility | ✓ | function does one task (check for linked version) |

#### checkContainsJSON.ts (changes only)

| rule | status | evidence |
|------|--------|----------|
| require-named-transformers | ✓ | uses `filterSelfDepsFromDeclared` |
| forbid-decode-friction | ✓ | no inline decode-friction in changed code |

#### containsCheck.ts (changes only)

| rule | status | evidence |
|------|--------|----------|
| failfast | ✓ | returns null early if no name field |
| shapefit | ✓ | uses `parseJSON<{ name?: unknown }>()` — explicit type |

### test file verification

#### processSelfDepsForFix.test.ts

| rule | status | evidence |
|------|--------|----------|
| given-when-then | ✓ | uses `describe` blocks that read as given/when/then |
| data-driven | n/a | behavior tests, not transformer data-driven tests |
| snapshots | n/a | not output artifact tests |

#### isSelfDependency.test.ts

| rule | status | evidence |
|------|--------|----------|
| data-driven | ✓ | uses TEST_CASES array with `.forEach` |
| require-snapshots | n/a | not output artifact |

## conclusion

all changed files adhere to mechanic role standards. no violations found.
