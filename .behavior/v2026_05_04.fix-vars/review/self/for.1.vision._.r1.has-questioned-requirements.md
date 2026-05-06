# self-review: has-questioned-requirements

## requirement 1: JSON.stringify arrays on replacement

**who said this was needed?** the wish from a peer blocked on production approvers.

**evidence?** the current code types `flattenedProjectVariables` as `Record<string, string>` — arrays cannot be values.

**what if we didn't?** users would continue with workarounds (stringify in getVariables, parse in template).

**is scope correct?** yes — this is the minimal change to enable arrays.

**alternatives considered:**
- `util.inspect` — rejected: node-specific output, not valid JSON/JS
- template literal interpolation — rejected: cannot serialize arrays
- stringify everything — rejected: strings would gain extra quotes (`"value"` instead of `value`)

JSON.stringify is the standard approach for producing valid JSON/JS array literals.

**verdict:** holds — JSON.stringify is the correct serialization method for arrays.

---

## requirement 2: change type to `Record<string, string | string[]>`

**who said this was needed?** the wish proposes this type change.

**clarification:** the domain type `ProjectVariablesImplementation` is already `Record<string, any>`. the narrower type is in `replaceProjectVariablesInDeclaredFileContents.ts` line 26:

```typescript
const flattenedProjectVariables: Record<string, string> = flatten(projectVariables);
```

this local type assertion is what needs expansion.

**what if we didn't?** typescript would error when accessing array values.

**simpler way?** could use `Record<string, any>` but explicit union is clearer for maintainers.

**verdict:** holds — explicit type union documents the supported value types.

---

## issue found: `flat` library behavior assumption was wrong

**the assumption:** `flat` library preserves arrays.

**the reality:** `flat` flattens arrays by default!

```javascript
flatten({ approvers: ['alice', 'bob'] })
// → { 'approvers.0': 'alice', 'approvers.1': 'bob' }
```

**the fix:** must pass `{ safe: true }` to `flatten()` to preserve arrays:

```javascript
flatten({ approvers: ['alice', 'bob'] }, { safe: true })
// → { approvers: ['alice', 'bob'] }
```

**impact:** this was a critical discovery. the wish's proposed solution would not work without this fix. arrays would be split into indexed keys and the variable expression `@declapract{variable.approvers}` would fail to match.

**how fixed:** updated the vision to include this requirement. implementation must:
1. pass `{ safe: true }` to `flatten()`
2. detect arrays on replacement and JSON.stringify

---

## requirement 3: detect array and JSON.stringify

**who said this was needed?** the wish proposes this approach.

**evidence?** arrays need to become valid JS/JSON literals in the output.

**what if we didn't?** arrays would become `[object Object]` or similar broken output.

**alternatives considered:**
- stringify all non-strings — rejected: breaks nested object access (e.g., `variable.db.user`)
- different syntax for arrays (e.g., `@declapract{array.X}`) — rejected: adds cognitive load when auto-detection suffices

**verdict:** holds — detecting arrays via `Array.isArray()` is reliable and requires no syntax changes.

---

## alternative approaches challenged

### alternative 1: don't support arrays, document the workaround

users could continue with:
```typescript
// getVariables.ts
productionApprovers: '["alice", "bob"]',

// template
reviewers: JSON.parse('@declapract{variable.productionApprovers}'),
```

**rejected:** this is a tax on every user. the wish exists because real users hit this pain point. workarounds should not be the permanent answer.

### alternative 2: support all non-primitive types

could also JSON.stringify plain objects, not just arrays.

**deferred:** nested object access (`variable.db.user`) already works via `flat`. full object serialization could be a future enhancement. keeping scope to arrays for now.

### alternative 3: use a different flattening strategy

could avoid the `flat` library entirely and handle nesting manually.

**rejected:** `flat` with `{ safe: true }` does exactly what we need. no reason to reinvent.

---

## scope check

**is the scope too large?** no — focused change to one function plus its type annotation.

**is the scope too small?** no — arrays were the specific blocker cited in the wish.

**is scope misdirected?** no — the right files are targeted:
- `replaceProjectVariablesInDeclaredFileContents.ts` — the replacement logic
- corresponding test file — verify array behavior

---

## summary

| requirement | verdict | rationale |
|-------------|---------|-----------|
| JSON.stringify arrays | holds | standard serialization for arrays |
| type expansion | holds | documents supported types explicitly |
| `{ safe: true }` for flatten | **discovered** | critical — without this, arrays break |
| detect array on replacement | holds | Array.isArray is reliable |

the vision needed one critical correction: the `flat` library requires `{ safe: true }` to preserve arrays. this was verified by reading the library documentation.
