# self-review r9: has-play-test-convention

## the review

i verified test file conventions. this repo does not use `.play.test.ts` — it uses a different established convention.

### convention search

**search for `.play.test.ts` files:**
```
$ find src -name "*.play.test.ts"
(no results)
```

**search for `.play.integration.test.ts` files:**
```
$ find src -name "*.play.integration.test.ts"
(no results)
```

### repo convention analysis

| pattern | count | purpose |
|---------|-------|---------|
| `*.test.ts` | 30+ | unit tests |
| `*.integration.test.ts` | 18 | integration tests |
| `*.play.test.ts` | 0 | not used |

### repo established convention

this repo uses:
- **unit tests:** `*.test.ts` for pure logic tests
- **integration tests:** `*.integration.test.ts` for tests that touch filesystem, spawn processes, or compose multiple modules

the `.play.test.ts` convention is not present anywhere in the codebase. the repo predates that convention.

### tests added for this feature

| file | type | convention |
|------|------|------------|
| isSelfDependency.test.ts | unit | `*.test.ts` |
| processSelfDepsForFix.test.ts | unit | `*.test.ts` |
| emitSelfDepWarn.test.ts | unit | `*.test.ts` |
| filterSelfDepsFromDeclared.test.ts | unit | `*.test.ts` |

all new tests follow the extant repo convention — unit tests use `*.test.ts`.

### why it holds

1. **repo has established convention** — `*.test.ts` and `*.integration.test.ts` used throughout
2. **no journey tests needed** — this feature is tested at unit level (transformers) and integration level (orchestrators)
3. **new tests follow convention** — all added test files match extant pattern
4. **convention is consistent** — no mixed patterns, no orphaned conventions

### no action required

the `.play.test.ts` convention is not applicable to this repo. the fallback convention (`*.test.ts` / `*.integration.test.ts`) is already in use and the new tests follow it.

## conclusion

play test convention not applicable — repo uses `*.test.ts` and `*.integration.test.ts`. new tests follow extant convention. no action required.

