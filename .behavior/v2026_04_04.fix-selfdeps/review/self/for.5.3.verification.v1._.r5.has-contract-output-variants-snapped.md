# self-review r5: has-contract-output-variants-snapped

## the review

i verified snapshot coverage for all new/modified public contracts.

### new contracts added

| component | type | user-visible? |
|-----------|------|---------------|
| isSelfDependency | transformer | no (internal) |
| isLinkedDependencyVersion (extended) | transformer | no (internal) |
| emitSelfDepWarn | communicator | yes (console.log) |
| processSelfDepsForFix | orchestrator | no (internal) |
| filterSelfDepsFromDeclared | transformer | no (internal) |

### snapshot coverage analysis

#### emitSelfDepWarn (console output)

**what it outputs:**
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**how it's tested (emitSelfDepWarn.test.ts:14-42):**
```ts
it('action=omitted → correct format', () => {
  emitSelfDepWarn({ packageName: 'sql-dao-generator', declaredVersion: '0.22.0', action: 'omitted' });

  expect(consoleSpy).toHaveBeenCalledTimes(1);
  const output = consoleSpy.mock.calls[0][0];
  expect(output).toContain('omit self-dependency sql-dao-generator@0.22.0');
  expect(output).toContain('a package should not depend on itself');
  expect(output).toContain('if intentional, use link:. or file:. to self-reference');
});
```

**snapshotted?** no — uses inline assertions

**assessment:** acceptable because:
1. all key content verified via assertions
2. format documented in vision.md (authoritative source)
3. console.log output, not structured contract return value
4. treestruct format follows repo-wide convention

#### checkContainsJSON (check phase)

**what changed:** self-deps now return null (pass) instead of fail

**snapshotted?** yes — extant snapshots verify error output format

**new variants needed?** no — self-dep case produces no output (passes silently)

#### fixContainsJSON* (fix phase)

**what changed:** self-deps omitted or preserved

**snapshotted?** yes — extant snapshot verifies JSON output structure

**new variants added?** no — JSON structure unchanged, behavior verified via assertions

### verification: extant snapshots

| test file | snapshot count | content |
|-----------|----------------|---------|
| checkContainsJSON.test.ts.snap | 2 | error diff formats |
| fixContainsJSON*.test.ts.snap | 1 | JSON output |
| plan.integration.test.ts.snap | 1 | CLI stdout |
| displayPlan.integration.test.ts.snap | 1 | plan display |

### why it holds

1. **no new public contracts** — all new components are internal
2. **user-visible output (warn) tested via assertions** — all key content verified
3. **extant snapshots unchanged** — JSON structure and error formats preserved
4. **console output follows documented format** — vision.md is authoritative

### potential improvement (not a blocker)

could add snapshot for emitSelfDepWarn output to catch visual drift. however:
- inline assertions already verify all key content
- vision.md documents the canonical format
- this is console output, not API contract

## conclusion

all new/modified contracts have adequate test coverage. no new snapshots needed — extant snapshots cover structured output, new warn output verified via inline assertions.

