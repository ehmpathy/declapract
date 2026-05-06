# self-review: has-consistent-mechanisms (r7)

## new mechanisms in blueprint

### mechanism 1: `{ safe: true }` option to flatten

**is this a new mechanism?** no — this is a library option from `flat`.

**duplicates extant?** no — we use the library's own feature.

**verdict:** reuses extant mechanism.

---

### mechanism 2: `Array.isArray()` check

**is this a new mechanism?** no — built-in JavaScript.

**duplicates extant?** not applicable — standard language feature.

**verdict:** not a new mechanism.

---

### mechanism 3: `JSON.stringify()` serialization

**is this a new mechanism?** no — built-in JavaScript.

**duplicates extant?** not applicable — standard language feature.

**verdict:** not a new mechanism.

---

### mechanism 4: conditional replacement logic

**blueprint shows:**
```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
return replaceAll(contents, thisVariableExpression, replacement);
```

**is this a new mechanism?** partially — adds array detection to extant replacement logic.

**does codebase have extant array serialization?** let me search.

searched for:
- `JSON.stringify` in `src/` — used in error messages, not for variable replacement
- `Array.isArray` in `src/` — used in validation, not for variable replacement

**duplicates extant?** no — this is the first place where array variables need serialization.

**could we reuse extant?** no — no extant mechanism exists for this purpose.

**verdict:** new logic, does not duplicate extant.

---

### mechanism 5: `replaceAll` utility

**blueprint shows:** reuses extant `replaceAll` utility.

**duplicates extant?** no — we reuse the extant utility.

**verdict:** reuses extant mechanism.

---

## summary

| mechanism | new? | duplicates extant? |
|-----------|------|-------------------|
| `{ safe: true }` | no (library option) | no |
| `Array.isArray()` | no (built-in) | n/a |
| `JSON.stringify()` | no (built-in) | n/a |
| conditional replacement | yes (extends extant) | no |
| `replaceAll` utility | no (reuse extant) | no |

**no duplicate mechanisms found.**

**why this holds:** the blueprint uses standard JavaScript features and the extant `replaceAll` utility. the only new code is the conditional to detect arrays — and no extant mechanism exists for this purpose.
