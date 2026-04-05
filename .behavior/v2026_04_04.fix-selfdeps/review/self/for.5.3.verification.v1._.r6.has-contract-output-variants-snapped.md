# self-review r6: has-contract-output-variants-snapped

## the review

i found a gap: emitSelfDepWarn output was not snapshotted. i fixed it.

### found issue: emitSelfDepWarn lacked snapshots

**why this was a gap:**

per the guide: "does each public contract have EXHAUSTIVE snapshots?" and "zero leniency".

emitSelfDepWarn is user-visible output (console.log). it had inline assertions but no snapshots. this meant:
- pr reviewers could not vibecheck the actual format
- format drift would not surface in diffs
- treestruct structure was not captured

**detection method:**

read emitSelfDepWarn.test.ts (lines 14-42):
```ts
it('action=omitted → correct format', () => {
  emitSelfDepWarn({ ... });
  // only inline assertions, no toMatchSnapshot()
  expect(output).toContain('omit self-dependency');
});
```

**fix applied (emitSelfDepWarn.test.ts:14-28):**

```diff
it('action=omitted → correct format', () => {
  emitSelfDepWarn({ ... });

+ // snapshot the full output for visual review
+ expect(output).toMatchSnapshot();
+
  // explicit assertions for key content
  expect(output).toContain('omit self-dependency');
  ...
});
```

same fix applied to `action=preserved` test case.

**test run to generate snapshots:**

```
$ npm run test:unit -- emitSelfDepWarn.test.ts
PASS src/.../fixMethods/emitSelfDepWarn.test.ts
  emitSelfDepWarn
    ✓ action=omitted → correct format (6 ms)
    ✓ action=preserved → correct format (2 ms)

 › 2 snapshots written.
```

### verification: snapshots generated

**file:** `fixMethods/__snapshots__/emitSelfDepWarn.test.ts.snap`

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

### snapshot coverage after fix

| contract | test file | snapshots |
|----------|-----------|-----------|
| emitSelfDepWarn | emitSelfDepWarn.test.ts | 2 (omitted, preserved) |
| checkContainsJSON | checkContainsJSON.test.ts | 2 (diff formats) |
| fixContainsJSON* | fixContainsJSON*.test.ts | 1 (JSON output) |

**total unit test snapshots:** 5

### verification: checklist per contract

**emitSelfDepWarn (console output):**

| check | status | evidence |
|-------|--------|----------|
| positive path (success) is snapped | ✓ | action=omitted snapshot |
| negative path (error) is snapped | n/a | no error path |
| edge cases snapped | ✓ | action=preserved (alternate success) |
| snapshot shows actual output | ✓ | treestruct format with ANSI codes |

**checkContainsJSON (check error output):**

| check | status | evidence |
|-------|--------|----------|
| positive path (success) is snapped | n/a | success returns null (no output) |
| negative path (error) is snapped | ✓ | 2 diff format snapshots |
| edge cases snapped | ✓ | minVersion expression diff |

**fixContainsJSON* (JSON output):**

| check | status | evidence |
|-------|--------|----------|
| positive path (success) is snapped | ✓ | JSON output snapshot |
| negative path (error) is snapped | n/a | fix always succeeds |

### why it holds now

1. **warn output snapshotted** — both variants (omitted, preserved) now have snapshots
2. **format visible in PR** — reviewers can vibecheck treestruct format
3. **drift detection enabled** — future format changes will surface in snapshot diffs
4. **both assertions retained** — explicit content assertions + snapshots = defense in depth

## conclusion

found gap: emitSelfDepWarn output lacked snapshots. fixed by the addition of `toMatchSnapshot()` to both test cases. all new contracts now have snapshot coverage per the guide's checklist.

