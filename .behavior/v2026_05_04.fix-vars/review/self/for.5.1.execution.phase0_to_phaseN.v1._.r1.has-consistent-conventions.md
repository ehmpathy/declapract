# self-review: has-consistent-conventions (r1)

## names introduced

### `replacement` (line 50)

```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**convention check:** this file uses `replaceAll` and has "replace" in its name. `replacement` is the noun form. consistent.

**alternative names considered:**
- `serializedValue` — implies always serialized, but sometimes it's passed through
- `valueToSubstitute` — verbose
- `replacement` — direct, matches the `replaceAll` call below

**verdict:** consistent.

### type change: `Record<string, string | string[]>`

**extant type:** `Record<string, string>`

**new type:** `Record<string, string | string[]>`

this extends the type union. follows TypeScript conventions for discriminated types. no new name introduced.

**verdict:** consistent.

---

## patterns followed

### conditional ternary for type discrimination

```typescript
const x = Array.isArray(y) ? transform(y) : y;
```

**extant pattern in codebase?** checked `fixContainsJSON*.ts`:

```typescript
const newValue = (() => {
  if (currentValue === undefined) return desiredValue;
  if (desiredValue === undefined) return currentValue;
  if (Array.isArray(desiredValue)) return desiredValue;
  // ...
})();
```

the codebase uses both IIFE-with-ifs and ternaries. for simple binary decisions, ternary is common in JS. our pattern is idiomatic.

**verdict:** consistent.

---

## summary

| element | convention followed? | notes |
|---------|---------------------|-------|
| `replacement` variable | yes | matches `replaceAll` terminology |
| type union `string \| string[]` | yes | standard TypeScript |
| ternary for type check | yes | idiomatic JS pattern |

**no convention divergence detected.**
