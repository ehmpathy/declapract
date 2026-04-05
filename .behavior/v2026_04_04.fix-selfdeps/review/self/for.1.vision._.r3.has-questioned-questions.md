# self-review r3: has-questioned-questions (deeper)

let me re-examine each question with more scrutiny.

---

## re-examine "answered" questions

### question #1: error or warn?

**my claim**: answered via wish ("logged as a warn")

**scrutiny**: is "logged as a warn" the same as "omit and warn"?
- "logged as a warn" could mean: warn but still add the dep
- the wish also says "should be omitted"
- so: omit + warn = correct interpretation

**verdict: truly answered** ✓

---

### question #2: escape hatch pragma?

**my claim**: answered via wish (no pragma, use `link:.`)

**scrutiny**: the wish says "if we do, we can add some special pragma"
- this leaves the door open for future pragma
- but "by default" = no pragma now

**verdict: truly answered** ✓

---

### question #3: all dependency types?

**my claim**: answered via logic

**scrutiny**: did i infer too much?
- wish says "a dep" — generic
- but does "a dep" mean ALL dep types?
- peerDependencies: "i need you to provide this" — can you peer-dep on yourself? weird but same circular issue
- optionalDependencies: same circular issue

**question: should i ask wisher to confirm?**

no — the logic is sound. any version-based dep on yourself creates the same problem. the wisher said "a dep" generically, and there's no reason to treat types differently.

**verdict: truly answered** ✓

---

## re-examine [wisher] question

### question #4: check phase vs fix phase behavior

**my claim**: needs wisher input

**scrutiny**: is this really a wisher question or can i propose a default?

the vision already proposes option C. maybe i should:
- propose C as the default
- note that wisher can override if they prefer A or B
- but not require wisher input to proceed

**change**: downgrade from [wisher] to [answered] — option C is the sensible default. wisher can adjust in review.

---

## newly surfaced questions

### question #5: structured output?

not just a warn log, but machine-readable output?
- `declapract plan --json` could include `omittedSelfDeps: ["sql-dao-generator"]`
- useful for automation

**verdict: [answered]** — nice-to-have, not core. can add later if needed.

### question #6: transitive cycles?

if package A deps on B which deps on A, that's still circular but not self-dep.
does this feature address transitive cycles?

**verdict: [answered]** — no, this feature is about DIRECT self-deps only. transitive cycles are a different (harder) problem.

---

## re-examine [research] questions

### question #7: detection time

**my claim**: needs research on FileCheckContext

**scrutiny**: can i answer this via logic?
- declapract must read the target file to check/fix it
- if it reads package.json, it can read the `name` field
- the question is WHERE in the code flow this happens

**verdict: still needs research** — implementation detail

---

### question #8: where to implement

**my claim**: needs research

**verdict: still needs research** — implementation detail

---

## summary of changes

| question | was | now | reason |
|----------|-----|-----|--------|
| #4 check vs fix UX | [wisher] | [answered] | option C is sensible default; wisher can adjust |
| #5 structured output | absent | [answered] | nice-to-have, not core |
| #6 transitive cycles | absent | [answered] | out of scope (direct self-deps only) |

---

## final triage (matches vision numbering)

| # | question | status |
|---|----------|--------|
| 1 | error or warn? | [answered] — warn per wish |
| 2 | escape hatch pragma? | [answered] — no per wish |
| 3 | all dep types? | [answered] — yes via logic |
| 4 | check vs fix UX | [answered] — option C default |
| 5 | structured output? | [answered] — nice-to-have, later |
| 6 | transitive cycles? | [answered] — out of scope |
| 7 | detection time | [research] — verify FileCheckContext |
| 8 | where to implement | [research] — analyze codebase |

---

## changes made to vision

### issue: question #4 was marked [wisher] but has clear answer

**how fixed**: moved from "questions to validate with wisher" to "resolved questions". option C (check passes with note, fix omits with warn) is the sensible default. wisher can override in review if they prefer option A or B.

### issue: newly surfaced questions not documented

**how fixed**: added questions #5 (structured output) and #6 (transitive cycles) to resolved questions table, both marked [answered] with rationale.

### issue: duplicated structure

**how fixed**: consolidated all questions into single "resolved questions" table with columns: #, question, status, resolution. removed duplicate "what feels off" section that repeated [research] items. now references questions #7 (detection time) and #8 (where to implement) from the table instead.

### issue: numbering consistency

**how fixed**: ensured r3 review uses same numbering as vision table (1-8). [answered] questions are 1-6, [research] questions are 7-8.

---

## non-issues: why they hold

| # | question | why it holds |
|---|----------|--------------|
| 1 | error or warn? | wish explicitly says "logged as a warn" — no ambiguity |
| 2 | escape hatch pragma? | wish explicitly says "by default... save users from themselves" — `link:.` is escape hatch |
| 3 | all dep types? | logic: same circular problem for all version-based deps; wish says "a dep" generically with no exceptions |
| 4 | check vs fix UX | option C balances clarity and correctness; other options have clear downsides |
| 5 | structured output | nice-to-have doesn't block core feature; can add later |
| 6 | transitive cycles | explicitly out of scope (DIRECT self-deps only); different problem, different solution |
| 7 | detection time | implementation detail; must be answered via code research, not logic |
| 8 | where to implement | implementation detail; must be answered via code research, not logic |
