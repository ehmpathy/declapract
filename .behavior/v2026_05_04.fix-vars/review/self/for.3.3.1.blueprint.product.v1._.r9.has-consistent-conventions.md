# self-review: has-consistent-conventions (r9)

## deeper review — what was missed in r8

r8 checked name patterns superficially. let me examine each proposed addition more carefully.

---

## proposed addition 1: `{ safe: true }` option

**blueprint shows:**
```typescript
flatten(projectVariables, { safe: true })
```

**is this a name choice?** no — this is a library option from the `flat` package.

**does it follow extant convention?** not applicable — we use what the library provides.

**verdict:** no convention concern.

---

## proposed addition 2: type `Record<string, string | string[]>`

**blueprint shows:**
```typescript
const flattenedProjectVariables: Record<string, string | string[]> =
```

**extant convention search:**

searched for union types with arrays in the codebase:

```typescript
// ActionUsePracticesConfigInput.ts
variables?: Record<string, any>;

// constants.ts
export type ProjectVariablesImplementation = Record<string, any>;
```

**analysis:**
- extant code uses `any` for variables
- the current narrowed type is `Record<string, string>`
- proposed narrowed type is `Record<string, string | string[]>`

**does this introduce new convention?** no — this refines the extant pattern of narrowed types.

**is `string | string[]` common in the codebase?** let me search.

searched for `string | string[]` — no matches in src/

searched for union types with arrays — no matches

**is this a problem?** no — union types with arrays are standard TypeScript. the codebase just hasn't needed them yet.

**verdict:** no convention concern. standard TypeScript.

---

## proposed addition 3: variable name `replacement`

**blueprint shows:**
```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**extant name conventions in this file:**
- `variableKey` — noun that describes what it is
- `variableValue` — noun that describes what it is
- `thisVariableExpression` — noun phrase with `this` prefix

**does `replacement` follow the pattern?** yes — it's a noun that describes what the value is.

**could we use a different name?**
- `replacementValue` — more explicit, matches `variableValue` pattern
- `valueToReplace` — describes purpose but uses "to" preposition

**should we change it?** the extant code uses both simple nouns (`contents`) and compound nouns (`variableValue`). `replacement` is consistent with simple nouns.

**verdict:** `replacement` is consistent. no change needed.

---

## proposed addition 4: conditional with `Array.isArray`

**blueprint shows:**
```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**extant pattern search:**

found in `fixContainsJSON...ts:79`:
```typescript
if (Array.isArray(desiredValue)) return desiredValue;
```

**analysis:**
- extant code uses `Array.isArray()` in if statement
- blueprint uses `Array.isArray()` in ternary

**is ternary consistent?** searched for ternaries in the file:

```typescript
// line 34
const variableKey = (new RegExp(...).exec(thisVariableExpression) ?? [])[1];
```

**analysis:** the file uses ternary-like patterns (nullish coalescence). ternary is consistent.

**verdict:** no convention concern.

---

## proposed addition 5: `JSON.stringify()` usage

**blueprint shows:**
```typescript
JSON.stringify(variableValue)
```

**extant usage search:**

found in `UnexpectedCodePathError.ts`:
```typescript
JSON.stringify(this.metadata, null, 2)
```

found in `applyFixToDeclaredFileContentsIfNotOptimized.ts`:
```typescript
JSON.stringify(parsedDeclaredJSON, null, 2)
```

**analysis:**
- extant uses include `null, 2` for pretty format
- blueprint uses default format (compact)

**is compact format correct?** yes — we want `["alice","bob"]` not multi-line array.

**verdict:** no convention concern. compact format is intentional.

---

## summary

| proposed addition | convention check | result |
|-------------------|------------------|--------|
| `{ safe: true }` | library option | n/a |
| `Record<string, string \| string[]>` | standard TypeScript | consistent |
| `replacement` variable | descriptive noun | consistent |
| `Array.isArray()` ternary | extant pattern | consistent |
| `JSON.stringify()` | extant in codebase | consistent |

**no divergence from extant conventions found.**

**why this holds:** each proposed addition was checked against extant patterns. all follow standard TypeScript or extant codebase conventions. no new name terms were introduced where extant terms exist.
