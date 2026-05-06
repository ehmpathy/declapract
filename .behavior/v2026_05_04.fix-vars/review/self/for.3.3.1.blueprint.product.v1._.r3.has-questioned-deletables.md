# self-review: has-questioned-deletables (r3)

## deeper review — what was missed in r2

r2 concluded "the blueprint is minimal." but let me look again with harder scrutiny.

---

## re-examination with fresh eyes

### the "implementation details" section

**what it contains:**
```typescript
// before
const flattenedProjectVariables: Record<string, string> =
  flatten(projectVariables);

// after
const flattenedProjectVariables: Record<string, string | string[]> =
  flatten(projectVariables, { safe: true });
```

**is this redundant?** the codepath tree already shows:
```
├── [~] flatten call
│   └─ before: flatten(projectVariables)
│   └─ after:  flatten(projectVariables, { safe: true })
```

**verdict:** partially redundant. the codepath tree shows the function call, but the implementation details section shows the full line with type annotation. this adds value for execution.

**action:** keep — the type annotation is important for implementation.

---

### the "coverage by layer" table

**what it contains:**
| layer | scope | test type |
|-------|-------|-----------|
| transformer | `replaceProjectVariablesInDeclaredFileContents` (pure) | unit test |

**is this needed?** for a single-function change, this seems ceremonial.

**would we miss it?** no — the function is obviously a transformer.

**action:** could delete. but it follows the blueprint stone template and costs only 3 lines.

**verdict:** keep — follows stone template.

---

### the edge case tests

**what r2 said:** "keep as optional"

**re-examination:** the blueprint marks them as "(optional)" in the header. this is correct. they trace to vision edgecases but the vision does not mandate tests for them.

**should we delete them from the blueprint entirely?**

if we deleted them:
- the blueprint would be shorter
- we could still add them during execution if time permits

if we keep them:
- they serve as a reminder that edgecases exist
- they are clearly marked optional

**action:** keep — marking as optional is honest and useful.

---

### the risk assessment section

**what it contains:** 3 rows of risk analysis.

**is this required?** no.

**does it add value?** yes — it shows we considered `{ safe: true }` impact on nested objects.

**if we deleted it and had to add it back, would we?** maybe — during execution, this analysis would need to happen anyway.

**action:** keep — it's brief (4 lines) and the analysis is valuable.

---

## found issue: redundancy between codepath tree and implementation details

**issue:** the codepath tree and implementation details section both show the flatten call change.

**is this a problem?** no — they serve different purposes:
- codepath tree: shows structure and location
- implementation details: shows exact syntax with types

**should we deduplicate?** no — each adds unique value.

**why this holds:** the type annotation `Record<string, string | string[]>` is critical detail not shown in codepath tree. the codepath tree shows what changes, implementation details shows how.

---

## conclusion

| section | redundant? | action |
|---------|------------|--------|
| summary | no | keep |
| filediff tree | no | keep |
| codepath tree | no | keep |
| coverage by layer | ceremonial | keep (follows template) |
| coverage by case | no | keep |
| test tree | no | keep |
| test cases to add | no | keep |
| implementation details | partial (complements codepath) | keep |
| backwards compatibility | no | keep |
| risk assessment | optional | keep (brief, valuable) |

**why no deletions:** after three rounds of review, no section was truly deletable. each serves a purpose or is brief enough that deletion would not meaningfully simplify the blueprint.

**what I learned:** "minimal" does not mean "cannot be reviewed further." even when no items are deleted, the review validates the design.
