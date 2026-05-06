# self-review: has-thorough-test-coverage (r7)

## deeper review — what was missed in r6

r6 checked the standard requirements. let me look deeper at potential gaps.

---

## potential gap 1: array of numbers

**vision edgecases list:**
> | array of numbers | outputs `[1, 2, 3]` — valid JSON |

**is this tested?** no — blueprint only tests string arrays.

**should it be tested?** JSON.stringify handles all types. the vision says "pit of success: JSON.stringify handles all these correctly."

**decision:** not required — we trust JSON.stringify. but could add as optional edge case.

**verdict:** not a gap — library behavior, not custom logic.

---

## potential gap 2: array of objects

**vision edgecases list:**
> | array of objects | outputs `[{"a": 1}]` — valid JSON |

**is this tested?** no.

**should it be tested?** same reason — JSON.stringify handles this.

**verdict:** not a gap — library behavior.

---

## potential gap 3: nested arrays

**vision edgecases list:**
> | nested array | outputs `[[1, 2], [3, 4]]` — valid JSON |

**is this tested?** no.

**should it be tested?** same reason.

**verdict:** not a gap — library behavior.

---

## potential gap 4: mixed string and array variables

**is this tested?** the primary test case includes both string and array variables:
> ```typescript
> projectVariables: {
>   productionApprovers: ['alice', 'bob'],
>   allowedOrigins: ['https://example.com', 'https://api.example.com'],
> },
> ```

wait — this only tests arrays, not a mix of strings and arrays.

**should it be tested?** let me check if extant tests cover strings. yes — the extant test covers strings:
> ```typescript
> projectVariables: {
>   serviceName: 'super-cool-service',
>   organizationName: 'org-of-coolness',
>   databaseUserName: { serviceUser: 'super-cool-service-user' },
> },
> ```

**is the combination tested?** no — but it doesn't need to be. the function iterates through all variables. if strings work and arrays work, the combination works.

**verdict:** not a gap — iteration logic is independent.

---

## potential gap 5: error path for empty string variable

**extant test covers:**
> 'should throw an error if one of the variables did not have its value defined'

**is the error path for arrays different?** no — same error logic applies.

**verdict:** not a gap — error path is unchanged.

---

## re-examination of test coverage

| case | tested by | verdict |
|------|-----------|---------|
| string replacement | extant test | covered |
| nested object | extant test | covered |
| array replacement | new test | covered |
| undefined variable error | extant test | covered |
| empty array | optional edge case | marked optional |
| single item array | optional edge case | marked optional |
| array of numbers | JSON.stringify | library handles |
| array of objects | JSON.stringify | library handles |
| nested arrays | JSON.stringify | library handles |

---

## why test coverage is sufficient

1. **we test our custom logic:**
   - `{ safe: true }` — tested via array preservation
   - `Array.isArray()` check — tested via array replacement
   - string vs array branch — tested via primary test

2. **we trust library logic:**
   - `JSON.stringify()` — well-specified, no custom tests needed
   - `flatten()` — documented behavior, verified via assumptions

3. **edge cases are optional:**
   - empty array, single item — marked optional, not required

**why this holds:** the tests cover the custom code we wrote. library behavior is not our responsibility to test.
