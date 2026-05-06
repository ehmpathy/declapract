# self-review: has-consistent-mechanisms (r3)

## the question at hand

did we introduce new mechanisms that duplicate extant functionality?

## analysis: line-by-line of new code

### line 28: `{ safe: true }`

```typescript
flatten(projectVariables, { safe: true })
```

**is there an extant wrapper for this?** searched for "flat" and "safe":
- no wrapper exists in this codebase
- `flatten` is imported directly from `flat` npm package
- this is the first use of the `safe` option

**should we create a wrapper?** no. one-line library option. rule.prefer.wet-over-dry says wait for 3+ usages.

### lines 50-52: array detection + serialization

```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**is there an extant utility for this pattern?** searched for:
- `serializeIfArray`: not found
- `toJsonString`: not found
- `stringifyArray`: not found

**should we create a utility?** no. 3 lines inline. rule.prefer.wet-over-dry says wait for 3+ usages. this is usage #1.

### the `flat` library with `{ safe: true }`

searched for other usages of the `flat` library in this codebase:

```
grep -r "from 'flat'" src/
```

result: only this file imports `flat`. the `safe` option is appropriate for our use case. no inconsistency.

---

## verification: no extant mechanism does what we need

**what we need:** "flatten nested objects but preserve arrays, then serialize arrays to JSON strings"

**what exists:**
- `JSON.stringify`: serializes all values, but we only want arrays
- `Array.isArray`: detects arrays, but doesn't serialize
- `flat` with no options: flattens arrays too (wrong)

**conclusion:** no extant mechanism in this codebase provides our needed behavior. the combination we used is the minimal correct implementation.

---

## summary

| mechanism | exists in codebase? | should we reuse? |
|-----------|---------------------|------------------|
| array-to-JSON utility | no | n/a |
| flatten-with-safe wrapper | no | n/a |
| conditional serialize pattern | no | n/a |

**no duplicated mechanisms.** we used standard library primitives because no higher-level abstraction exists or is warranted.
