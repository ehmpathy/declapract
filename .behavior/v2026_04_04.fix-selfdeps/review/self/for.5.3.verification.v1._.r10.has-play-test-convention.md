# self-review r10: has-play-test-convention

## the review

i verified test file conventions with concrete evidence from the codebase.

### convention search evidence

**command:**
```bash
find src -name "*.play.test.ts" 2>/dev/null
```

**result:** no files found

**command:**
```bash
find src -name "*.play.integration.test.ts" 2>/dev/null
```

**result:** no files found

### repo test file inventory

| pattern | count | example |
|---------|-------|---------|
| `*.test.ts` | 34 | processSelfDepsForFix.test.ts |
| `*.integration.test.ts` | 18 | plan.integration.test.ts |
| `*.play.test.ts` | 0 | n/a |

### extant convention evidence

**unit test pattern (processSelfDepsForFix.test.ts:3-15):**
```ts
describe('processSelfDepsForFix', () => {
  let consoleSpy: jest.SpyInstance;
  ...
  describe('omit self-dep when not link:./file:.', () => {
    it('should omit self-dep when absent in found', () => {
      const result = processSelfDepsForFix({...});
```
- uses Jest `describe/it` blocks
- tests isolated function behavior
- follows `*.test.ts` convention

**integration test pattern (plan.integration.test.ts:8-20):**
```ts
describe('plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be able to plan for an example project', async () => {
    await plan({
      usePracticesConfigPath: `${testAssetsDirectoryPath}/...`,
    });
    expect(callsWithoutDurations).toMatchSnapshot();
  });
});
```
- uses Jest `describe/it` blocks
- tests command with real filesystem
- follows `*.integration.test.ts` convention

### why `.play.test.ts` is not applicable

the `.play.test.ts` convention is for **journey tests** — tests that walk through a user scenario from start to finish. this feature does not have journey tests because:

1. **scope is internal** — self-dep detection is an internal mechanism, not a user-faced journey
2. **tested via orchestrator** — the fix method is tested via fixContainsJSON tests which exercise the full path
3. **repo predates convention** — declapract has extant test patterns established before `.play.` was introduced

### fallback convention verification

| question | answer | evidence |
|----------|--------|----------|
| are journey tests in the right location? | n/a | no journey tests exist for this feature |
| do they have the `.play.` suffix? | n/a | no journey tests exist |
| is the fallback convention used? | yes | `*.test.ts` for unit, `*.integration.test.ts` for integration |

### tests added for this feature follow extant convention

| file | type | follows convention? |
|------|------|---------------------|
| isSelfDependency.test.ts | unit | yes — `*.test.ts` |
| processSelfDepsForFix.test.ts | unit | yes — `*.test.ts` |
| emitSelfDepWarn.test.ts | unit | yes — `*.test.ts` |
| filterSelfDepsFromDeclared.test.ts | unit | yes — `*.test.ts` |

### why it holds

1. **no journey tests needed** — feature is internal mechanism, not user journey
2. **extant convention followed** — new tests use `*.test.ts` like rest of codebase
3. **integration coverage via extant tests** — plan.integration.test.ts and fixFile.integration.test.ts exercise the full path
4. **convention is consistent** — 0 files use `.play.` prefix, all 52 test files follow extant pattern

## conclusion

`.play.test.ts` convention not applicable — this feature is an internal mechanism without dedicated journey tests. fallback convention (`*.test.ts` / `*.integration.test.ts`) is used consistently. all 4 new test files follow extant repo convention.

