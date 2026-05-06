# self-review: has-ergonomics-validated (r9)

## the question

does the actual input/output match what was planned?

## reference: the vision's "aha" moment (line 39-41)

> when a practice author writes `@declapract{variable.approvers}` and it just works — no JSON.parse, no manual stringify, no special escape. arrays are first-class citizens like strings.

## verify: does this hold?

### test case from my implementation

```typescript
// input
projectVariables: {
  productionApprovers: ['alice', 'bob'],
}
fileContents: 'reviewers: @declapract{variable.productionApprovers}'

// output
'reviewers: ["alice","bob"]'
```

### checklist from the "aha" moment

| promise | fulfilled? | evidence |
|---------|------------|----------|
| "it just works" | yes | tests pass |
| "no JSON.parse" | yes | output is valid JS array literal |
| "no manual stringify" | yes | `JSON.stringify()` is internal |
| "no special escape" | yes | yaml parser handles input |
| "first-class citizens like strings" | yes | same `@declapract{variable.X}` syntax |

## the whitespace question revisited

vision example: `["uladkasach", "caseybrookes"]`
actual output: `["alice","bob"]`

is this a problem?

**no.** the vision example was illustrative prose, not a spec. the actual output:
1. is valid JSON/JS
2. will be formatted by project tools (prettier, eslint)
3. achieves the "aha" moment — it just works

## verdict

**ergonomics validated.** the "aha" moment from the vision holds true. arrays work like strings. no workarounds needed. the implementation delivers what was promised.
