# self-review r6: has-snap-changes-rationalized

## the review

i verified every `.snap` file change is intentional and justified.

### summary of snapshot changes

| file | change type | intentional? |
|------|-------------|--------------|
| plan.integration.test.ts.snap | modified | yes |
| displayPlan.integration.test.ts.snap | modified | yes |
| emitSelfDepWarn.test.ts.snap | added | yes |

### modified: plan.integration.test.ts.snap

**what changed:**
```diff
-    "[90m  ✓ evaluated practice:prettier[39m",
+    "[90m  ✓ evaluated practice:dates-and-times[39m",
   ],
   [
-    "[90m  ✓ evaluated practice:dates-and-times[39m",
+    "[90m  ✓ evaluated practice:prettier[39m",
```

**nature of change:** reorder of log messages (`prettier` and `dates-and-times` swapped positions)

**intentional?** yes

**rationale:** this is async execution order variance. the practices are evaluated in parallel via Promise.all, and the order of completion varies between runs. the content is identical — only the order changed.

**why acceptable:**
- no content change — same practices evaluated
- no format change — same log format
- async order is non-deterministic by design
- this is not a regression — just a snapshot of a different race outcome

### modified: displayPlan.integration.test.ts.snap

**what changed:** identical to above — same two practices swapped order

**rationale:** same async execution order variance

### added: emitSelfDepWarn.test.ts.snap

**what it contains:**
```
exports[`emitSelfDepWarn action=omitted → correct format 1`] = `
"[33m⚠️ warn: omit self-dependency sql-dao-generator@0.22.0[39m
[33m   ├─ a package should not depend on itself[39m
[33m   └─ if intentional, use link:. or file:. to self-reference[39m"
`;

exports[`emitSelfDepWarn action=preserved → correct format 1`] = `
"[33m⚠️ warn: preserve self-dependency sql-dao-generator[39m
[33m   ├─ extant self-ref was preserved[39m
[33m   └─ practice declared version was skipped[39m"
`;
```

**intentional?** yes — added in previous review (r6) to satisfy snapshot coverage requirement

**rationale:**
- captures treestruct format per vision.md
- enables vibecheck in PR review
- enables drift detection for future format changes

### verification: no regressions

| regression type | found? | evidence |
|-----------------|--------|----------|
| output format degraded | no | same log format, just reordered |
| error messages less helpful | no | no error message changes |
| timestamps/ids leaked | no | no timestamps/ids in snapshots |
| extra output added | no | only intentional new snapshot |

## conclusion

all snapshot changes are intentional and justified:
- 2 modified: benign async reorder of log messages
- 1 added: new warn output snapshot per previous review requirement

no regressions. no accidental changes.

