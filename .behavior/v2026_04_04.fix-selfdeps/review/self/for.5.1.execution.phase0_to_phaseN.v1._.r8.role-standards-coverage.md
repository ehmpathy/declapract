# self-review r8: role-standards-coverage

## the review

i verified that all relevant mechanic standards are present in the code (not just non-violated).

### rule directories checked for coverage

| directory | applicable rules |
|-----------|-----------------|
| practices/code.prod/readable.comments | what-why-headers |
| practices/code.prod/evolvable.procedures | input-context-pattern |
| practices/code.prod/pitofsuccess.errors | failfast, failloud |
| practices/code.test/scope.coverage | test-coverage-by-grain |

### coverage matrix

#### what-why-headers coverage

all new operations have `.what` and `.why` jsdoc headers:

| file | has header | line ref |
|------|-----------|----------|
| isSelfDependency.ts | ✓ | line 1-4 |
| emitSelfDepWarn.ts | ✓ | line 3-6 |
| processSelfDepsForFix.ts | ✓ | line 13-19 |
| filterSelfDepsFromDeclared.ts | ✓ | line 10-12 |
| isLinkedDependencyVersion (check.minVersion.ts) | ✓ | line 3-7 |

**code excerpts as evidence:**

filterSelfDepsFromDeclared.ts (line 10-12):
```ts
/**
 * .what = filters self-dependencies from declared JSON before check comparison
 * .why = self-deps are omitted in fix phase, so check phase must pass them to avoid infinite loop
 */
```

isSelfDependency.ts (line 1-4):
```ts
/**
 * .what = checks if a dependency key matches the package's own name
 * .why = detects self-dependencies that would cause circular install issues
 */
```

#### input-context-pattern coverage

all new functions follow (input, context?) pattern:

| file | signature |
|------|-----------|
| isSelfDependency | `(input: { packageName, dependencyKey })` |
| emitSelfDepWarn | `(input: { packageName, declaredVersion, action })` |
| processSelfDepsForFix | `(input: { declared, found, targetPackageName })` |
| filterSelfDepsFromDeclared | `(input: { declared, targetPackageName })` |
| isLinkedDependencyVersion | `(input: { value })` |

all use named `input` param — ✓ covered

**code excerpts as evidence:**

filterSelfDepsFromDeclared.ts (line 14-17):
```ts
export const filterSelfDepsFromDeclared = (input: {
  declared: Record<string, unknown>;
  targetPackageName: string;
}): Record<string, unknown> => {
```

processSelfDepsForFix.ts (line 21-28):
```ts
export const processSelfDepsForFix = (input: {
  declared: Record<string, unknown>;
  found: Record<string, unknown>;
  targetPackageName: string;
}): {
  filteredDeclared: Record<string, unknown>;
  filteredFound: Record<string, unknown>;
} => {
```

#### failfast coverage

functions with potential null/undefined paths have early returns:

| file | early return | line ref |
|------|-------------|----------|
| isSelfDependency | `if (input.packageName === null) return false` | line 10 |
| isLinkedDependencyVersion | `if (typeof input.value !== 'string') return false` | line 11 |
| containsCheck | `return null` when no name field | line 49-51 |

✓ all potential null paths fail fast

**code excerpts as evidence:**

isSelfDependency.ts (line 10):
```ts
if (input.packageName === null) return false;
```

filterSelfDepsFromDeclared.ts (line 23):
```ts
if (!deps || typeof deps !== 'object') continue;
```

isLinkedDependencyVersion (check.minVersion.ts, line 11):
```ts
if (typeof input.value !== 'string') return false;
```

#### test-coverage-by-grain

| grain | file | test type required | test present |
|-------|------|--------------------|--------------|
| transformer | isSelfDependency.ts | unit | ✓ isSelfDependency.test.ts |
| transformer | isLinkedDependencyVersion | unit | ✓ check.minVersion.test.ts |
| communicator | emitSelfDepWarn.ts | unit (spy) | ✓ emitSelfDepWarn.test.ts |
| orchestrator | processSelfDepsForFix.ts | integration | ✓ processSelfDepsForFix.test.ts |
| orchestrator | filterSelfDepsFromDeclared.ts | unit | ✓ filterSelfDepsFromDeclared.test.ts |

all grains have appropriate test coverage — ✓ covered

**test file locations as evidence:**

```
src/domain.operations/.../fixMethods/
├── isSelfDependency.test.ts         # 6 test cases
├── emitSelfDepWarn.test.ts          # 2 test cases (spy on console.log)
├── processSelfDepsForFix.test.ts    # 12 test cases

src/domain.operations/.../checkMethods/composableActions/
└── filterSelfDepsFromDeclared.test.ts  # 5 test cases

src/domain.operations/.../checkExpressions/
└── check.minVersion.test.ts         # extended with link:/file: cases
```

### patterns that could be absent but are present

| pattern | status | where |
|---------|--------|-------|
| type annotations | ✓ | all functions have return types |
| no `as` casts | ✓ | no type casts in new code |
| no `any` | ✓ | no `any` in new code |
| named exports | ✓ | all use `export const` |

### verification commands

```
npm run test:types — passed (no type errors)
npm run test:unit — 204 passed
npm run test:lint — passed (no lint errors)
```

## conclusion

all relevant mechanic standards are covered:
- all functions have what-why headers
- all functions use input-context pattern
- all functions fail fast on invalid inputs
- all grains have appropriate test coverage
- no type shortcuts (as, any)
