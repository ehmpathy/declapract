# self-review r8: has-consistent-mechanisms (deeper)

deeper search for extant mechanisms that could be reused.

---

## deeper search: could isSelfRefProtocol reuse isLinkedDependencyVersion?

**observation**: after file: extension, isLinkedDependencyVersion will check both link: and file:.

**question**: should isSelfRefProtocol call isLinkedDependencyVersion instead of duplicate logic?

**detailed analysis**:

1. **import path**: isLinkedDependencyVersion is in checkExpressions/check.minVersion.ts
   - import from fixMethods/ would cross check/fix boundary
   - not a clean dependency direction

2. **semantic couple**: if minVersion check logic changes, self-dep preservation should not change
   - they serve distinct purposes
   - couple would create unexpected side effects

3. **test isolation**: separate functions = separate test files
   - easier to test edge cases for each purpose
   - no test interdependency

**verdict**: ✓ separation is correct — avoid cross-boundary import, avoid semantic couple

---

## deeper search: extant warn emitters

**search**: are there other warn emitters in codebase?

from research.prod, found:
- line 203: `chalk.yellow + console.log` pattern used inline
- no centralized emitWarn function
- each warn has contextual format

**question**: should we create shared emitWarn and use it?

**analysis**:
- this change adds ONE new warn
- shared emitWarn would be over-abstraction
- vision specifies unique box-draw format for THIS warn
- inline pattern is consistent with codebase

**verdict**: ✓ inline emitter is consistent — no shared abstraction needed

---

## deeper search: package name comparison utilities

**search**: does codebase compare package names elsewhere?

**found**: no — this is a new use case (self-dep detection)

**question**: is exact string compare (===) sufficient?

**analysis**:
- npm package names are case-sensitive
- scoped packages include @ and /
- exact string compare handles all cases
- no normalization needed

**verdict**: ✓ simple compare is correct — no extant utility needed

---

## final mechanism inventory

| mechanism | new or extant? | duplication risk? |
|-----------|---------------|-------------------|
| isSelfDependency | new | none — unique purpose |
| isSelfRefProtocol | new | isLinkedDependencyVersion overlap — intentional separation |
| emitSelfDepWarn | new | follows inline pattern — no shared emitter |
| check.minVersion file: | extend extant | reuses extant function |
| checkContainsJSON self-dep | extend extant | reuses extant function |
| fixContainsJSON self-dep | extend extant | reuses extant function |

**result**: 3 new mechanisms, all justified. 3 extensions of extant mechanisms, all reuse correctly.
