# self-review: has-questioned-assumptions (r3)

## assumptions in the blueprint

### assumption 1: `{ safe: true }` preserves arrays without breakage

**what we assume:** the `flat` library's `safe` option preserves arrays while still flattened nested objects.

**what if opposite?** if `{ safe: true }` also preserved nested objects:
- `variable.db.user` would stop work
- this would break extant functionality

**evidence?** `flat` library readme documents this explicitly:
> "When enabled, both `flat` and `unflatten` will preserve arrays and their contents."

the key word is "arrays" — nested objects are still flattened.

**verdict:** holds — verified via library documentation.

---

### assumption 2: `JSON.stringify()` produces valid output

**what we assume:** `JSON.stringify()` outputs valid JSON/JS array literals.

**what if opposite?** if `JSON.stringify()` produced invalid output:
- generated code would have syntax errors
- declapract would break projects

**evidence?** `JSON.stringify()` is specified by ECMA-262. it always produces valid JSON. valid JSON is valid JS.

**verdict:** holds — guaranteed by specification.

---

### assumption 3: type `Record<string, string | string[]>` is sufficient

**what we assume:** arrays only contain strings, hence `string[]`.

**what if opposite?** what about arrays of numbers, objects, or mixed types?

**examination:**

```javascript
JSON.stringify([1, 2, 3])         // "[1,2,3]" — works
JSON.stringify([{a: 1}])          // "[{\"a\":1}]" — works
JSON.stringify([1, "two", null])  // "[1,\"two\",null]" — works
```

**issue found:** the type `Record<string, string | string[]>` suggests only string arrays, but `JSON.stringify()` handles any array.

**is this a problem?** no — the type is for what `flatten()` preserves, not for what `JSON.stringify()` accepts. `flatten()` with `{ safe: true }` preserves the original array type.

**should type be wider?** the source type is `ProjectVariablesImplementation = Record<string, any>`. the flattened type could be `Record<string, string | any[]>` to be more accurate.

**action needed?** no — `string[]` is the common case. TypeScript's `JSON.stringify()` accepts any value. the code works regardless of type annotation.

**verdict:** holds for practical purposes — type is documentation, not constraint.

---

### assumption 4: nested arrays and objects inside arrays work

**what we assume:** `JSON.stringify()` handles complex arrays.

**evidence:**
```javascript
JSON.stringify([[1, 2], [3, 4]])    // "[[1,2],[3,4]]"
JSON.stringify([{users: ["a"]}])    // "[{\"users\":[\"a\"]}]"
```

**verdict:** holds — JSON.stringify handles nested structures.

---

### assumption 5: no special escape needed

**what we assume:** `JSON.stringify()` output can be directly substituted into code.

**what if opposite?** what if the output needs escape for the template context?

**examination:** the template is:
```typescript
reviewers: { users: @declapract{variable.approvers}, teams: null },
```

after substitution:
```typescript
reviewers: { users: ["alice","bob"], teams: null },
```

**is this valid JS?** yes — `["alice","bob"]` is a valid array literal.

**edge case:** what if array element contains special characters?

```javascript
JSON.stringify(["alice", "bob's friend"])
// returns: '["alice","bob's friend"]'
```

JSON does not escape single quotes. single quotes are valid in JSON strings.

**verdict:** holds — JSON.stringify handles escape correctly.

---

### assumption 6: backwards compatibility is preserved

**what we assume:** extant string variables work the same.

**what if opposite?** if `{ safe: true }` changed behavior for strings:
- all extant practices would break

**evidence:** `{ safe: true }` only affects arrays. strings pass through unchanged.

```javascript
flatten({ name: "alice" }, { safe: true })
// { name: "alice" } — unchanged
```

**verdict:** holds — option only affects arrays.

---

### assumption 7: empty arrays are valid

**what we assume:** empty array `[]` should output `[]`, not error.

**what if opposite?** if empty arrays errored:
- `reviewers: []` would be invalid
- but `reviewers: []` is semantically meaningful (no reviewers required)

**verdict:** holds — design decision documented in vision.

---

## summary

| assumption | evidence | verdict |
|------------|----------|---------|
| `{ safe: true }` preserves arrays only | library docs | holds |
| `JSON.stringify()` valid output | ECMA-262 spec | holds |
| `Record<string, string \| string[]>` | practical common case | holds |
| nested arrays/objects work | JSON.stringify tests | holds |
| no special escape needed | JSON spec | holds |
| backwards compatible | `safe` only affects arrays | holds |
| empty arrays valid | design decision | holds |

**no assumptions broken.** all technical assumptions verified via documentation, specification, or explicit design decisions.
