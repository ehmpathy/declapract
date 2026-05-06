# self-review: has-play-test-convention (r10)

## deeper examination

### the question

are journey test files named correctly with `.play.test.ts` suffix?

### step 1: search the entire repo

```
glob: **/*.play.test.ts
result: no files found

glob: **/*.play.integration.test.ts
result: no files found

glob: **/*.play.acceptance.test.ts
result: no files found
```

the repo has zero `.play.*` test files.

### step 2: what test conventions does this repo use?

examined test file patterns:

| pattern | example | purpose |
|---------|---------|---------|
| `*.test.ts` | `replaceProjectVariablesInDeclaredFileContents.test.ts` | unit tests |
| `*.integration.test.ts` | `apply.integration.test.ts` | integration tests |
| `*.acceptance.test.ts` | `cli.acceptance.test.ts` | acceptance tests |

the `.play.` convention is not established in this repo.

### step 3: did I write journey tests?

**no.** I wrote unit tests for a pure transformer. the tests I wrote:

1. `should replace all occurrences of declared variables...` — string replacement
2. `should throw an error if variable not defined` — error case
3. `should replace array variables with JSON array literals` — new feature
4. `should handle empty array variables` — edge case
5. `should handle single item array variables` — edge case

these are **behavior tests**, not journey tests. they verify a single transformer's behavior, not a multi-step user journey.

### step 4: should I add the `.play.` convention?

**no.** because:
1. no repros exist to define user journeys
2. the feature is a localized transformer change
3. the repo does not use this convention
4. to add it would be out of scope

## verdict

**not applicable.** no journey tests were written. the repo does not use the `.play.test.ts` convention. the change is to a pure transformer, not a multi-step journey. unit tests are the appropriate test type.
