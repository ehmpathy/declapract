# self-review: has-questioned-assumptions

## assumption 1: JSON array syntax (double quotes) is acceptable

**what do we assume?** that outputting `["alice", "bob"]` with double quotes is fine, even for codebases that prefer single quotes.

**evidence?** formatters like prettier apply quote style consistently. the output is valid JS/JSON regardless of quote style.

**what if opposite?** if single quotes were required, formatters would convert them. no manual intervention needed.

**did wisher say this?** no — wisher didn't mention quote style.

**verdict:** holds — quote style is a formatting concern, not a declapract concern.

---

## assumption 2: users want arrays, not other complex types

**what do we assume?** that arrays are the missing feature, not objects, Maps, Sets, etc.

**evidence?** the wish specifically mentions arrays for production approvers. nested objects already work via `flat` (e.g., `variable.db.user`).

**what if opposite?** if users wanted full objects:
- nested access (`variable.config.timeout`) already works
- full object substitution (`variable.config` → `{timeout: 30}`) doesn't work
- but the wish doesn't ask for this

**exceptions?** none cited in the wish.

**verdict:** holds — arrays are the specific gap. full object serialization could be a future enhancement.

---

## assumption 3: no need for array element access syntax

**what do we assume?** that users don't need `@declapract{variable.approvers[0]}` — only full array substitution.

**evidence?** wish doesn't mention element access. the usecase is passing a whole list (reviewers, approvers).

**what if opposite?** if users needed element access:
- they could destructure after substitution: `const [first] = @declapract{variable.approvers}`
- or we'd need to extend the variable syntax (larger scope)

**did wisher say this?** no — wisher asked for whole array substitution.

**verdict:** holds — whole array substitution covers the stated usecase.

---

## assumption 4: empty arrays should be allowed

**what do we assume?** the vision lists this as an open question, but let me clarify.

**current behavior:** empty string causes error: "variable was declared but value was not defined"

**what should empty array do?**
- `[]` is a valid array literal
- an empty list of approvers is semantically meaningful (no approvers required)
- different from undefined — user explicitly set an empty array

**what if opposite?** if empty arrays errored:
- `reviewers: []` would fail
- but `reviewers: []` is a valid configuration
- this would be surprising

**verdict:** empty arrays should output `[]`, not error. update vision to clarify this.

**fix needed:** yes — vision should state that empty arrays are valid.

---

## assumption 5: backwards compatibility is required

**what do we assume?** that extant string variable behavior must not change.

**evidence?** declapract is used by multiple projects. tests exist for string replacement.

**what if opposite?** if we broke backwards compat:
- all extant practices would break
- users would be forced to update getVariables.ts
- unacceptable churn

**verdict:** holds — backwards compatibility is essential for a library.

---

## assumption 6: `{ safe: true }` doesn't break nested object access

**what do we assume?** that adding `{ safe: true }` to `flatten()` still flattens nested objects while preserving arrays.

**evidence from docs:**

> When enabled, both `flat` and `unflatten` will preserve arrays and their contents.

the option is specifically for arrays. nested objects are still flattened.

```javascript
flatten({ db: { user: 'alice' }, approvers: ['bob'] }, { safe: true })
// → { 'db.user': 'alice', approvers: ['bob'] }
```

**what if opposite?** if `{ safe: true }` also preserved nested objects:
- `variable.db.user` would stop working
- this would be a change that breaks extant behavior
- but the docs say it only affects arrays

**verdict:** holds — `{ safe: true }` preserves arrays only, not nested objects.

---

## assumption 7: strings that look like arrays remain strings

**what do we assume?** that `productionApprovers: '["alice", "bob"]'` (a string with JSON content) remains a string after substitution, not parsed into an array.

**evidence?** we only JSON.stringify actual arrays (detected via `Array.isArray()`). strings pass through unchanged.

**what if opposite?** if we parsed JSON strings:
- ambiguity: is `'[1, 2, 3]'` a string or an array?
- surprise: users might not expect parse behavior
- complexity: need to detect "is this a JSON string?"

**verdict:** holds — only actual arrays are serialized. strings that look like JSON remain strings. this is correct and expected behavior.

---

## assumption 8: compact JSON output is acceptable

**what do we assume?** that JSON.stringify outputs compact form: `["alice","bob"]` not pretty-printed with newlines.

**evidence?** for inline substitution (e.g., `users: @declapract{variable.X}`), compact is correct. config arrays are typically small.

**what if opposite?** if pretty-print was needed:
- `JSON.stringify(arr, null, 2)` would add indentation
- but this breaks inline contexts
- users can run formatters for readability

**verdict:** holds — compact JSON is correct for inline substitution.

---

## assumption 9: special characters in array elements are handled

**what do we assume?** that elements like `"alice \"the great\""` or `"bob's place"` are escaped correctly.

**evidence?** JSON.stringify escapes all characters per JSON spec.

**test case:**
```javascript
JSON.stringify(['alice "the great"', "bob's place"])
// → '["alice \"the great\"","bob's place"]'
```

**verdict:** holds — JSON.stringify escapes correctly. single quotes don't need escape in JSON.

---

## assumption 10: array order is preserved

**what do we assume?** that array element order is maintained through serialization.

**evidence?** JSON.stringify preserves array order. arrays are ordered in JS.

**what if opposite?** if order was lost:
- `['first', 'second']` might become `['second', 'first']`
- this would be incorrect and unexpected

**verdict:** holds — JSON.stringify preserves order.

---

## assumption 11: variable detection regex still works

**what do we assume?** that the regex `/@declapract\{variable.[\w.]+\}/g` continues to detect variables correctly.

**evidence?** the regex matches variable *keys*, not values. the key `productionApprovers` is still a string. array values don't affect key detection.

**what if opposite?** if the regex needed to change:
- we'd need to update the regex
- but the regex operates on template contents, not variable values

**verdict:** holds — the regex matches variable references in templates, unaffected by value types.

---

## summary

| assumption | verdict | action |
|------------|---------|--------|
| JSON double quotes OK | holds | none |
| arrays are the need | holds | none |
| no element access needed | holds | none |
| empty arrays allowed | **fixed** | vision updated |
| backwards compat required | holds | none |
| `{ safe: true }` safe | holds | verified via docs |
| JSON-like strings stay strings | holds | none |
| compact JSON output OK | holds | none |
| special chars escaped | holds | none |
| order preserved | holds | none |
| variable regex unaffected | holds | none |

the vision has been updated to clarify that empty arrays output `[]`.
