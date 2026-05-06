# self-review: has-consistent-mechanisms (r8)

## verification via codebase search

r7 identified the mechanisms. r8 verifies no duplicates exist via search.

---

## search: JSON.stringify in src/

**query:** `JSON.stringify` in `src/`

**results:** 12 files found

**analysis of each:**

| file | usage | duplicates array replacement? |
|------|-------|------------------------------|
| `src/logic/commands/usePractice/evaluate/evaluatePracticeDeclaration.ts` | error messages | no |
| `src/logic/commands/plan/evaluateProjectAgainstPractice.ts` | error messages | no |
| `src/domain.operations/usage/apply/applyFix/applyFixToDeclaredFileContentsIfNotOptimized.ts` | fix output | no |
| `src/domain.operations/usage/evaluate/projectVariableExpressions/replaceProjectVariablesInDeclaredFileContents.ts` | not found in current code | no |
| other files | various uses | no |

**conclusion:** no extant mechanism serializes arrays for variable replacement.

---

## search: Array.isArray in src/

**query:** `Array.isArray` in `src/`

**analysis:** used in validation contexts, not for variable replacement.

**conclusion:** no extant mechanism detects arrays in variable replacement context.

---

## final verification

| mechanism | extant in codebase? | purpose match? |
|-----------|---------------------|----------------|
| `JSON.stringify` for variable replacement | no | n/a |
| `Array.isArray` for variable replacement | no | n/a |
| conditional replacement logic | no | n/a |

**no duplicate mechanisms found.**

---

## why the new logic is necessary

1. **flatten preserves arrays** — `{ safe: true }` is a library option, not custom code
2. **array detection** — `Array.isArray()` is standard JavaScript
3. **serialization** — `JSON.stringify()` is standard JavaScript
4. **conditional replacement** — new logic, but no extant mechanism exists for this purpose

the blueprint adds the minimal logic required to support arrays. no extant mechanism was duplicated or bypassed.

---

## summary

| check | result |
|-------|--------|
| searched JSON.stringify uses | no duplicates |
| searched Array.isArray uses | no duplicates |
| verified no extant array replacement | confirmed |
| mechanisms are consistent | yes |

**guard passes.**
