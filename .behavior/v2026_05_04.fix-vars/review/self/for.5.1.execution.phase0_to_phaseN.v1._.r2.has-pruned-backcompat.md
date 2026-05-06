# self-review: has-pruned-backcompat (r2)

## deeper analysis: line by line

### line 26-29: the flatten call

```typescript
const flattenedProjectVariables: Record<string, string | string[]> = flatten(
  projectVariables,
  { safe: true },
);
```

**question:** does `{ safe: true }` change behavior for non-array values?

**answer:** no. `{ safe: true }` only affects arrays. for nested objects like `{ db: { user: 'foo' } }`, the behavior is identical:
- before: `{ 'db.user': 'foo' }`
- after: `{ 'db.user': 'foo' }`

the option name is "safe" because it makes arrays "safe" (not flattened), not because it adds safety to other values.

**verdict:** no extra backwards-compat here.

### line 50-53: the conditional

```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**question:** is the `: variableValue` branch an extra backwards-compat shim?

**answer:** no. this is the minimal implementation pattern. consider the alternatives:

1. **only JSON.stringify:** would quote strings, break output: `"value"` instead of `value`
2. **type guard + overload:** more code, same behavior
3. **conditional (what we did):** minimal, clear, correct

the conditional is not "backwards compat code" — it's the feature implementation. you cannot add array support without some way to differentiate arrays from strings.

**question:** did we add any extra code for edge cases?

**answer:** no. we did not add:
- null checks (not in spec)
- undefined fallbacks (not in spec)
- empty string guards (not in spec)
- error recovery (not in spec)

the code is exactly: detect array → stringify, otherwise → pass through.

---

## summary

| potential concern | is it extra backwards-compat? | why |
|-------------------|-------------------------------|-----|
| `{ safe: true }` | no | does not change non-array behavior |
| `: variableValue` | no | minimal pattern to differentiate types |
| type union `string \| string[]` | no | type-level only, no runtime effect |

**no unasked backwards-compat code detected.**

**why this holds:** the implementation is the minimal correct solution. there is no extra code, no fallbacks, no "just in case" branches. each line serves the feature, not backwards compatibility.
