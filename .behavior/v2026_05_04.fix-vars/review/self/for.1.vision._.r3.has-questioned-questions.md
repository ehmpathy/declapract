# self-review: has-questioned-questions (r3)

## issue found: questions not enumerated in vision

**what was wrong:** the vision's "open questions" section did not use the standard [answered], [research], [wisher] markers. questions were answered but not explicitly triaged.

**how it was fixed:** added explicit question enumeration table to the vision:

```markdown
### questions (all answered)

| question | status | resolution |
|----------|--------|------------|
| does `flat` preserve arrays? | [answered] | no, must use `{ safe: true }` |
| should empty arrays error? | [answered] | no, output `[]` |
| nested objects in arrays? | [answered] | JSON.stringify handles correctly |
| mixed type arrays? | [answered] | JSON.stringify handles correctly |
| support objects too? | [answered] | deferred, out of scope |

no questions remain for [research] or [wisher].
```

**why this matters for next time:** always enumerate questions with explicit status markers in the vision document itself, not just in review artifacts. the vision should be self-contained.

## question-by-question triage

### 1. does `flat` preserve arrays?

**how answered:** researched via `get.package.docs` — read the `flat` library readme.

**answer:** no. by default, `flat` flattens arrays to indexed keys. must pass `{ safe: true }`.

**why this holds:** the docs explicitly state `safe: true` preserves arrays. verified via library documentation.

---

### 2. should empty arrays error?

**how answered:** logic — compared to empty string behavior.

**answer:** no. empty arrays should output `[]`.

**why this holds:** unlike empty strings (which may indicate forgotten value), an empty array is semantically valid. `reviewers: []` is a valid configuration — "no reviewers required".

---

### 3. nested objects in arrays?

**how answered:** logic — JSON.stringify specification.

**answer:** JSON.stringify handles them correctly.

**why this holds:** `JSON.stringify([{a: 1}])` outputs `[{"a":1}]` — valid JSON. the edgecases table in the vision confirms this.

---

### 4. mixed type arrays?

**how answered:** logic — JSON.stringify specification.

**answer:** JSON.stringify handles mixed types correctly.

**why this holds:** `JSON.stringify([1, 'two', null])` outputs `[1,"two",null]` — valid JSON.

---

### 5. should we also support objects?

**how answered:** scoped via wish analysis.

**answer:** deferred. out of scope for this wish.

**why this holds:** the wish specifically asks for arrays. nested object access already works via `flat` (e.g., `variable.db.user`). full object serialization is a separate enhancement.

---

## no questions for research

all technical questions have been answered via:
- library documentation (flat)
- JSON specification knowledge
- logic and deduction

---

## no questions for wisher

the wish is unambiguous:
- support array variables
- use JSON.stringify for output
- enable reusable practices

no clarification needed from the wisher.

---

## why each resolution holds

### question 1: does `flat` preserve arrays?

**why it holds:** verified via authoritative source (library readme). the docs explicitly document the `safe` option behavior. not speculation.

### question 2: should empty arrays error?

**why it holds:** semantic distinction from empty strings is clear. empty string = possibly forgotten value. empty array = explicit empty list. the behavior follows the principle of least surprise.

### question 3: nested objects in arrays?

**why it holds:** JSON.stringify behavior is defined by spec. not implementation-dependent. `[{a:1}]` → `[{"a":1}]` is guaranteed.

### question 4: mixed type arrays?

**why it holds:** JSON is a data format that supports mixed types in arrays. `[1, "two", null]` is valid JSON by definition.

### question 5: support objects too?

**why it holds:** the wish specifically scopes to arrays. expanding scope introduces risk without clear benefit. deferred is the correct decision.

---

## summary

| category | count |
|----------|-------|
| [answered] via logic | 4 |
| [answered] via research | 1 |
| [research] (queued) | 0 |
| [wisher] (needs input) | 0 |

**issue found and fixed:** questions not enumerated with status markers in vision. now corrected.

**verdict:** all questions are resolved. the vision is complete and self-contained.
