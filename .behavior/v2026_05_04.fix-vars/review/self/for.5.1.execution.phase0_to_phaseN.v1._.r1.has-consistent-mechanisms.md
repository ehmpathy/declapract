# self-review: has-consistent-mechanisms (r1)

## new mechanisms analysis

### what mechanisms did we introduce?

| code | mechanism type |
|------|----------------|
| `Array.isArray(variableValue)` | standard JS |
| `JSON.stringify(variableValue)` | standard JS |
| `{ safe: true }` | library option |

**we introduced zero new mechanisms.** all code uses standard JS or library features.

### do these duplicate extant patterns?

**`JSON.stringify`:** used in 13 files across the codebase. consistent with extant practice.

**`Array.isArray`:** used in 1 other file (`fixContainsJSONByReplacingAndAddingKeyValues.ts`). consistent with extant practice.

**`{ safe: true }` on `flatten`:** this is the first use of this option. but it's not a new mechanism — it's a library feature we are now using. the `flat` library is already a dependency.

### could we have used a utility instead?

**no utility for "serialize if array" exists.** searched for:
- `serializeArray`: not found
- `stringifyIfArray`: not found
- `toJsonArray`: not found

the pattern `Array.isArray(x) ? JSON.stringify(x) : x` is the standard inline approach.

---

## summary

| mechanism | new? | duplicates extant? | verdict |
|-----------|------|-------------------|---------|
| `Array.isArray` | no | no (standard JS, used elsewhere) | consistent |
| `JSON.stringify` | no | no (standard JS, used in 13 files) | consistent |
| `{ safe: true }` | no | no (library feature) | consistent |

**no duplicated mechanisms detected.**

**why this holds:** we used standard language features and an extant library option. no new utilities, no new operations, no new abstractions.
