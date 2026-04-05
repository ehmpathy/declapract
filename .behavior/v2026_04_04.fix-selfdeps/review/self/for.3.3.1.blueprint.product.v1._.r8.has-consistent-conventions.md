# self-review r8: has-consistent-conventions

review name choices against extant conventions.

---

## extant conventions from codebase

from research.prod, found these name patterns:

| pattern | examples | usage |
|---------|----------|-------|
| `is*` prefix | isLinkedDependencyVersion | boolean predicates |
| `check*` prefix | checkContainsJSON | check phase methods |
| `fix*` prefix | fixContainsJSON* | fix phase methods |
| `*Context` suffix | FileCheckContext | context objects |
| `emit*` prefix | (none extant) | new pattern for warn |
| camelCase | all function names | standard ts convention |

---

## new name checks

### isSelfDependency

| aspect | convention | matches? |
|--------|------------|----------|
| prefix | `is*` for boolean | ✓ yes |
| case | camelCase | ✓ yes |
| clarity | states what it checks | ✓ yes |

**verdict**: ✓ follows extant `is*` predicate pattern

---

### isSelfRefProtocol

| aspect | convention | matches? |
|--------|------------|----------|
| prefix | `is*` for boolean | ✓ yes |
| case | camelCase | ✓ yes |
| clarity | states what it checks | ✓ yes |

**comparison to extant**: isLinkedDependencyVersion uses same pattern

**verdict**: ✓ follows extant `is*` predicate pattern

---

### emitSelfDepWarn

| aspect | convention | matches? |
|--------|------------|----------|
| prefix | `emit*` for output | ✓ new but consistent |
| case | camelCase | ✓ yes |
| clarity | states what it does | ✓ yes |

**note**: no extant `emit*` functions, but pattern is clear: verb + object

**verdict**: ✓ follows verb+object pattern, clear intent

---

## term consistency

| term in blueprint | used elsewhere? | consistent? |
|-------------------|-----------------|-------------|
| self-dependency | vision, criteria | ✓ yes |
| self-dep | shorthand in comments | ✓ yes |
| self-ref protocol | new term | ✓ describes link:./file:. |
| omit | vision says "omitted" | ✓ yes |
| preserve | vision says "preserved" | ✓ yes |

---

## file location check

| file | location | matches pattern? |
|------|----------|------------------|
| isSelfDependency.ts | fixMethods/ | ✓ with fix logic |
| isSelfRefProtocol.ts | fixMethods/ | ✓ with fix logic |
| emitSelfDepWarn.ts | fixMethods/ | ✓ with fix logic |

**note**: all three support the fix orchestrator, so location in fixMethods/ is correct.

---

## summary

| name | follows convention? |
|------|---------------------|
| isSelfDependency | ✓ yes |
| isSelfRefProtocol | ✓ yes |
| emitSelfDepWarn | ✓ yes |

**result**: all names follow extant conventions. no divergences found.
