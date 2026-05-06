# self-review: has-questioned-questions

## question triage

from the vision's "open questions & assumptions" section:

### original questions (now resolved)

1. **does `flat` preserve arrays?**
   - **[answered]** — researched and resolved.
   - answer: no, by default. must pass `{ safe: true }`.
   - resolution: documented in vision under "research completed".

2. **should empty arrays error?**
   - **[answered]** — resolved via logic.
   - answer: no. empty arrays are semantically meaningful.
   - resolution: documented in vision under "design decisions".

3. **nested objects inside arrays?**
   - **[answered]** — resolved via logic.
   - answer: JSON.stringify handles them correctly.
   - resolution: documented in vision under "design decisions".

### any questions missed?

let me search for implicit questions in the vision:

1. **what about arrays of mixed types?** e.g., `[1, 'two', null]`
   - **[answered]** — JSON.stringify handles mixed types correctly.
   - `JSON.stringify([1, 'two', null])` → `[1,"two",null]`
   - no action needed — edgecases table already covers this.

2. **what about circular references in arrays?**
   - **[answered]** — JSON.stringify throws on circular refs.
   - but config variables don't have circular refs.
   - this is not a realistic concern — no action needed.

3. **what about very large arrays?**
   - **[answered]** — JSON.stringify handles any size.
   - config arrays are small (approvers, keywords, etc.).
   - performance is not a concern — no action needed.

4. **should we also support objects (not just arrays)?**
   - **[answered]** — deferred to future enhancement.
   - nested object access already works (`variable.db.user`).
   - full object serialization is out of scope for this wish.
   - documented in assumptions review.

### questions for the wisher?

none. the wish is clear:
- support array variables
- use JSON.stringify for output
- enable reusable practices across orgs

no ambiguity requires wisher clarification.

### questions for research phase?

none. all research has been completed:
- `flat` library behavior verified via docs
- JSON.stringify behavior verified via spec knowledge

---

## summary

| question | status | resolution |
|----------|--------|------------|
| does `flat` preserve arrays? | [answered] | must use `{ safe: true }` |
| should empty arrays error? | [answered] | no, output `[]` |
| nested objects in arrays? | [answered] | JSON.stringify handles correctly |
| mixed type arrays? | [answered] | JSON.stringify handles correctly |
| circular references? | [answered] | not a realistic concern |
| very large arrays? | [answered] | not a concern for config |
| support objects too? | [answered] | deferred, out of scope |

all questions have been answered. no questions remain for research or wisher.

---

## vision update needed

the vision's "open questions" section should be updated to reflect that all questions are now answered. let me verify the current state.

current vision has:
- "assumptions" section — correct
- "research completed" section — correct
- "design decisions" section — correct
- "no further research needed" — correct

**verdict:** the vision is complete. all questions are resolved.
