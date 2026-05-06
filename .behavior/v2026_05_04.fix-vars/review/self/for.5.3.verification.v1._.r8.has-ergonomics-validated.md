# self-review: has-ergonomics-validated (r8)

## step 1: compare to planned ergonomics

no repros exist, so I compare to the vision.

### planned input (from vision lines 56-70)

```yaml
# declapract.use.yml
variables:
  productionApprovers:
    - uladkasach
    - caseybrookes
  allowedOrigins:
    - https://example.com
    - https://api.example.com
```

### planned output (from vision lines 84-88)

```typescript
reviewers: { users: ["uladkasach", "caseybrookes"], teams: null },
origins: ["https://example.com", "https://api.example.com"],
```

### actual implementation

my tests use:

```typescript
projectVariables: {
  productionApprovers: ['alice', 'bob'],
  allowedOrigins: ['https://example.com', 'https://api.example.com'],
}
fileContents: `
reviewers: { users: @declapract{variable.productionApprovers}, teams: null },
origins: @declapract{variable.allowedOrigins},
`
```

output:

```typescript
reviewers: { users: ["alice","bob"], teams: null },
origins: ["https://example.com","https://api.example.com"],
```

### comparison

| aspect | planned | actual | match? |
|--------|---------|--------|--------|
| input format | yaml list | yaml list / js array | yes |
| output format | JSON array literal | JSON array literal | yes |
| quotes | double | double | yes |
| spacing | `["a", "b"]` | `["a","b"]` | differs |

### the spacing difference

planned: `["uladkasach", "caseybrookes"]` (space after comma)
actual: `["alice","bob"]` (no space after comma)

this is from `JSON.stringify()` default behavior. is this a problem?

**no.** because:
1. both are valid JSON/JS
2. formatters (prettier, eslint) fix spacing to project style
3. the vision showed an illustrative example, not a strict spec

## step 2: did ergonomics drift?

**no drift.** the implementation matches the planned ergonomics:
- yaml arrays work as input
- JSON array literals as output
- no workarounds needed

## verdict

**ergonomics validated.** the actual input/output matches what was planned in the vision. the minor spacing difference (no space after comma in JSON.stringify output) is handled by formatters.
