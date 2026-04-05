# self-review r7: has-snap-changes-rationalized

## the review

i verified every `.snap` file change is intentional and justified.

### summary of snapshot changes

| file | change type | intentional? |
|------|-------------|--------------|
| plan.integration.test.ts.snap | modified | yes |
| displayPlan.integration.test.ts.snap | modified | yes |
| emitSelfDepWarn.test.ts.snap | added | yes |

---

### modified: plan.integration.test.ts.snap

**exact diff:**
```diff
@@ -21,10 +21,10 @@ exports[`plan should be able to plan for an example project 1`] = `
     "[90m  ✓ evaluated practice:terraform[39m",
   ],
   [
-    "[90m  ✓ evaluated practice:prettier[39m",
+    "[90m  ✓ evaluated practice:dates-and-times[39m",
   ],
   [
-    "[90m  ✓ evaluated practice:dates-and-times[39m",
+    "[90m  ✓ evaluated practice:prettier[39m",
   ],
```

**nature:** order swap — `prettier` and `dates-and-times` traded positions

**root cause (evaluateProjectAgainstPracticeDeclarations.ts:40-66):**
```ts
export const evaluateProjectAgainstPracticeDeclarations = async ({
  practices,
  project,
}: ...): Promise<FilePracticeEvaluation[]> => {
  return (
    await Promise.all(          // <-- practices evaluated in parallel
      practices.map((practice) =>
        withDurationReport(
          `practice:${practice.name}`,
          () => evaluteProjectAgainstPracticeDeclaration({ practice, project })
            .catch(...),
          ...
        )(),
      ),
    )
  ).flat().filter(isPresent);
};
```

the practices are evaluated via `Promise.all()` which means they complete in non-deterministic order based on execution time. the "evaluated practice" log message is emitted when each practice completes.

**why intentional:**
- content identical — same 6 practices evaluated
- format identical — same ANSI codes, same structure
- the only change is completion order
- this reflects actual async behavior

**why acceptable:**
- order of log messages has no semantic value
- all practices still evaluated
- no content/format regression

---

### modified: displayPlan.integration.test.ts.snap

**exact diff:**
```diff
@@ -41,10 +41,10 @@ exports[`displayPlan should show ... 1`] = `
 exports[`displayPlan should show ... 1`] = `
 [
   [
-    "[90m  ✓ evaluated practice:prettier[39m",
+    "[90m  ✓ evaluated practice:dates-and-times[39m",
   ],
   [
-    "[90m  ✓ evaluated practice:dates-and-times[39m",
+    "[90m  ✓ evaluated practice:prettier[39m",
```

**nature:** identical to above — same async order swap

**root cause:** same `Promise.all()` in evaluateProjectAgainstPracticeDeclarations.ts

---

### added: emitSelfDepWarn.test.ts.snap

**content:**
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

**why intentional:** added in r6 review to satisfy snapshot coverage requirement

**content verification:**
- treestruct format matches vision.md spec
- ANSI [33m = yellow (chalk.yellow)
- 2 variants: omitted + preserved

---

### regression check

| regression type | found? | evidence |
|-----------------|--------|----------|
| output format degraded | no | same ANSI codes, same structure |
| error messages less helpful | no | no error changes |
| timestamps/ids leaked | no | no dynamic values |
| extra output added | no | only intentional new snapshot |

## conclusion

all 3 snapshot changes are intentional:
- 2 modified: benign async order variance from `Promise.all()` in evaluateProjectAgainstPracticeDeclarations.ts:40
- 1 added: new warn output per r6 review

no regressions. no accidental changes.

