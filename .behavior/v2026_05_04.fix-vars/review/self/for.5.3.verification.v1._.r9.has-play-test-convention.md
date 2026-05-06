# self-review: has-play-test-convention (r9)

## step 1: check for journey tests

```
glob: **/*.play.test.ts
result: no files found
```

this repo has no `.play.test.ts` files.

## step 2: what tests did I write?

I wrote tests in:
- `replaceProjectVariablesInDeclaredFileContents.test.ts`

these are **unit tests**, not journey tests.

## step 3: should I have written journey tests?

the guide says: "journey tests should use `.play.test.ts` suffix"

**when are journey tests needed?**
- when repros exist and describe user journeys
- when behavior involves multiple steps across components

**why I did not write journey tests:**
1. no repros exist for this route
2. the change is localized to one pure transformer
3. the transformer has no multi-step user journey — it takes input and returns output

## step 4: what convention does this repo use?

```
src/**/*.test.ts — unit tests
src/**/*.integration.test.ts — integration tests
src/**/*.acceptance.test.ts — acceptance tests
```

the repo does not use `.play.test.ts` convention.

## verdict

**not applicable.** no journey tests were written because:
1. no repros defined user journeys
2. the change is a pure transformer with no multi-step journey
3. this repo does not use the `.play.test.ts` convention
