# self-review: has-preserved-test-intentions (r4)

## fresh examination of test file

### test 1: `should replace all occurrences of declared variables...` (lines 14-32)

**before:** verified string variables replaced with values (with nested objects via dot notation)
**after:** unchanged
**verdict:** intention preserved

### test 2: `should throw an error if one of the variables did not have its value defined` (lines 33-40)

**before:** try/catch pattern
**after:** `expect().toThrow(UserInputError)` pattern

**did I weaken the assertion?**
- no. both patterns verify identical behavior: that UserInputError is thrown
- the new pattern is actually stricter — it will fail if a different error type is thrown
- the old try/catch pattern could have masked the error type

**did I change what is tested?**
- no. still tests: undefined variable → UserInputError

**why did I change it?**
- peer review flagged try/catch as failhide pattern
- `expect().toThrow()` is safer and cleaner

**verdict:** intention preserved, implementation improved

### test 3: `should replace array variables with JSON array literals` (lines 41-59)

**new test** — verifies new behavior (array variable support)

### test 4: `should handle empty array variables` (lines 60-66)

**new test** — verifies edge case (empty arrays)

### test 5: `should handle single item array variables` (lines 67-73)

**new test** — verifies edge case (single item arrays)

---

## checklist

- [x] did not weaken assertions
- [x] did not remove test cases
- [x] did not change expected values to match broken output
- [x] did not delete tests that fail

## verdict

**all test intentions preserved.**

one test was modified to fix a failhide pattern (try/catch to expect().toThrow()). this changed verification mechanism, not verified behavior. the intention — undefined variables must throw UserInputError — remains identical.

three new tests were added for new behavior. no tests were weakened or removed.
