# self-review: has-consistent-conventions (r8)

## name conventions review

### extant names in file

| name | type | convention |
|------|------|------------|
| `flattenedProjectVariables` | variable | descriptive noun phrase |
| `variableKey` | variable | descriptive noun |
| `variableValue` | variable | descriptive noun |
| `thisVariableExpression` | variable | descriptive noun phrase |
| `uniqueDeclaredVariableExpressions` | variable | descriptive noun phrase |

### proposed names in blueprint

| name | type | follows extant convention? |
|------|------|---------------------------|
| `replacement` | variable | yes — descriptive noun |

**why `replacement` is consistent:**
- extant names are descriptive nouns/noun phrases
- `replacement` describes what the value is (what replaces the expression)
- follows same pattern as `variableValue`, `variableKey`

---

## type conventions review

### extant types

| location | type |
|----------|------|
| `ProjectVariablesImplementation` | `Record<string, any>` |
| `variables` in config | `Record<string, any>` |
| `flattenedProjectVariables` | `Record<string, string>` |

### proposed type

| location | type |
|----------|------|
| `flattenedProjectVariables` | `Record<string, string \| string[]>` |

**why this is consistent:**
- the extant type `Record<string, string>` was a narrowed view of `Record<string, any>`
- the proposed type `Record<string, string | string[]>` is also a narrowed view
- more precise than `any`, accurately describes what flatten produces with `{ safe: true }`

---

## pattern conventions review

### extant patterns

| pattern | usage |
|---------|-------|
| `Array.isArray()` | used in `fixContainsJSON...ts:79` |
| ternary conditional | common throughout codebase |
| `JSON.stringify()` | used in error messages |

### proposed patterns

| pattern | consistent with extant? |
|---------|------------------------|
| `Array.isArray(variableValue)` | yes — same usage pattern |
| ternary for conditional value | yes — common pattern |
| `JSON.stringify()` for serialization | yes — extant in codebase |

---

## namespace and prefix review

| aspect | extant | proposed | consistent? |
|--------|--------|----------|-------------|
| file location | `projectVariableExpressions/` | same | yes |
| function name | `replaceProjectVariablesInDeclaredFileContents` | same | yes |
| no new exports | n/a | no new exports | yes |

---

## summary

| check | result |
|-------|--------|
| variable names | consistent |
| type annotations | consistent (refined) |
| patterns | consistent |
| namespaces | unchanged |
| no new terms when extant exist | verified |

**no divergence from extant conventions found.**

**why this holds:** the blueprint modifies one function with minimal additions. all new code follows extant name patterns (descriptive nouns), type patterns (refined Record types), and code patterns (Array.isArray, ternary, JSON.stringify).
