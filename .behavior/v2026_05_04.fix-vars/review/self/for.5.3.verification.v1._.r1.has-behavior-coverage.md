# self-review: has-behavior-coverage (r1)

## question: does the verification checklist show every behavior from wish/vision has a test?

### step 1: examine wish and vision

**from 0.wish.md:**
> "support array variables in `@declapract{variable.X}` expressions so that practices can declare lists (e.g., production approvers) without JSON.parse workarounds"

**from 1.vision.md - the outcome world:**
> arrays just work... no JSON.parse, no manual stringify, no special escape

**from 1.vision.md - edgecases:**
> - empty array `[]` → outputs `[]`
> - array with one item → outputs `["item"]`
> - backwards compatible → strings still work as before

### step 2: trace each behavior to a test

| behavior | test name | line | verified? |
|----------|-----------|------|-----------|
| array variables serialize to JSON | `should replace array variables with JSON array literals` | 44-62 | yes |
| empty arrays output `[]` | `should handle empty array variables` | 63-69 | yes |
| single item arrays output `["item"]` | `should handle single item array variables` | 70-76 | yes |
| strings still work | `should replace all occurrences...` | 14-32 | yes (extant) |
| nested objects still work | same test uses `databaseUserName.serviceUser` | 14-32 | yes (extant) |
| error on undefined variable | `should throw an error if...` | 33-42 | yes (extant) |

### step 3: question assumptions

**did I miss any behaviors?**

examine vision section "what is awkward":
- double quotes vs single quotes → not a behavior to test, documented limitation
- cannot output raw identifiers → not a behavior to test, documented limitation
- no partial array access → not a behavior to test, documented limitation

**are there implicit behaviors I should test?**
- arrays of numbers? → JSON.stringify handles this, tested implicitly
- arrays of objects? → JSON.stringify handles this, could add test but vision says "pit of success: JSON.stringify handles all these correctly"

### step 4: verify tests actually run

ran `npm run test:unit` - all 5 tests in this file pass:
- should replace all occurrences of declared variables with their implemented values
- should throw an error if one of the variables did not have its value defined
- should replace array variables with JSON array literals
- should handle empty array variables
- should handle single item array variables

---

## verdict

**coverage is complete.** every behavior promised in wish and vision has an associated test. the tests run and pass.

**why this holds:**
1. traced each behavior from wish/vision to a specific test
2. verified test file contains all expected assertions
3. ran tests and confirmed they pass
4. questioned if any behaviors were omitted - found none
