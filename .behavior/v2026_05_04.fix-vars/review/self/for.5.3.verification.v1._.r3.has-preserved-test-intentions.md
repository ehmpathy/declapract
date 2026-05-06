# self-review: has-preserved-test-intentions (r3)

## tests I touched

### replaceProjectVariablesInDeclaredFileContents.test.ts

#### test 1: `should replace all occurrences of declared variables...`

**before:** verified string variables get replaced with their values
**after:** unchanged - still verifies the same behavior
**verdict:** intention preserved

#### test 2: `should throw an error if one of the variables did not have its value defined`

**before:** used try/catch pattern to verify error thrown
**after:** changed to `expect().toThrow(UserInputError)` pattern

**what did I change?**
- changed *how* the test verifies the behavior
- not *what* behavior it verifies

**the intention was:** verify that undefined variables throw UserInputError
**the intention still is:** verify that undefined variables throw UserInputError

**why I changed it:**
- peer review flagged try/catch as failhide pattern
- `expect().toThrow()` is cleaner and safer
- same verification, better pattern

**verdict:** intention preserved, implementation improved

### new tests added

#### test 3: `should replace array variables with JSON array literals`

**new test** - verifies new behavior (array support)

#### test 4: `should handle empty array variables`

**new test** - verifies edge case (empty arrays)

#### test 5: `should handle single item array variables`

**new test** - verifies edge case (single item arrays)

---

## checklist

- [x] did not weaken assertions
- [x] did not remove test cases
- [x] did not change expected values to match broken output
- [x] did not delete tests that fail

## verdict

**all test intentions preserved.**

I modified one test to fix a failhide pattern (try/catch → expect().toThrow()). this changed *how* the test verifies, not *what* it verifies. the original intention (undefined variables throw UserInputError) remains the same.

I added three new tests for new behavior. no extant tests were weakened or removed.
