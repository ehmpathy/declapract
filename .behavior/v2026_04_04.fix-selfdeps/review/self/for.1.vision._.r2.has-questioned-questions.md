# self-review: has-questioned-questions

triage each open question: can it be answered now? does it need research? does only wisher know?

---

## triaged questions

### 1. should this be an error or warn?

**can answer now?** YES — the wish explicitly says "logged as a warn"

**status: [answered]**

the wish already decided: warn, not error.

---

### 2. should there be an escape hatch pragma?

**can answer now?** YES — the wish says "if we do, we can add some special pragma... but by default, we should save users from themselves."

**status: [answered]**

the wish already decided: no pragma by default. `link:.` is the escape hatch.

---

### 3. does this apply to all dependency types?

**can answer now?** YES — via logic

- the wish says "a dep" generically, not a specific type
- the same circular problem applies to all dep types
- dependencies, devDependencies, peerDependencies, optionalDependencies all create the same npm/pnpm problem
- bundledDependencies is separate (name list, no versions)

**status: [answered]**

logic answers: yes to all version-based dep types.

---

### 4. check phase vs fix phase behavior

**can answer now?** NO — this is UX design preference

the wish says "omit" and "warn" but doesn't specify what users see in plan output.

**status: [wisher]**

need wisher input on preferred UX:
- option A: check passes, fix omits — "compliant" but misleads
- option B: check fails, fix omits — "needs fix" but fix does absent action
- option C: check passes with note — clear intent

---

### 5. detection time (from "what is awkward")

**can answer now?** NO — need to verify FileCheckContext capabilities

**status: [research]**

research phase: check if FileCheckContext has access to target package.json or its parsed contents.

---

### 6. where to implement (from "what is awkward")

**can answer now?** NO — need to analyze codebase structure

**status: [research]**

research phase: determine best location based on codebase patterns.

---

## summary

| question | status | resolution |
|----------|--------|------------|
| error or warn? | [answered] | warn — per wish |
| escape hatch pragma? | [answered] | no — per wish; `link:.` is escape hatch |
| all dep types? | [answered] | yes — via logic |
| check vs fix phase UX | [wisher] | need wisher preference |
| detection time | [research] | verify FileCheckContext |
| where to implement | [research] | analyze in research phase |

---

## changes to vision

need to update the questions section to reflect triage:
- mark #1, #2, #3 as answered (remove from questions, move to assumptions or resolved)
- keep #4 as [wisher]
- add [research] items to research section
