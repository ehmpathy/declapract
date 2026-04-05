# self-review r3: has-preserved-test-intentions

## the review

i verified that test intentions were preserved or intentionally changed per blueprint.

### extant test files modified

| file | change type |
|------|-------------|
| check.minVersion.test.ts | extended + intentional behavior change |
| checkContainsJSON.test.ts | extended (new cases only) |
| fixContainsJSON*.test.ts | extended (new cases only) |

### check.minVersion.test.ts — intentional behavior change

**what changed:**

```diff
- { value: 'file:../path', expected: false, description: 'file: protocol' },
+ { value: 'file:.', expected: true, description: 'file:. (current dir)' },
+ { value: 'file:..', expected: true, description: 'file:.. (parent dir)' },
+ { value: 'file:../peer-package', expected: true, description: 'file:../peer-package (relative path)' },
```

**why this is intentional, not a weakened assertion:**

the blueprint (3.3.1.blueprint.product.v1.i1.md) states:
> extend isLinkedDependencyVersion for file:
> add: value.startsWith('file:') check

the vision (1.vision.md) states:
> extant file:. self-dep → dep preserved as-is

this is a new feature: `file:` protocol now treated like `link:` for self-reference detection. the old expectation (`file: → false`) was incorrect for the new behavior.

**not weakened:** the test still verifies the correct behavior — `file:` is now a valid linked dependency protocol.

### checkContainsJSON.test.ts — additions only

**what changed:** added 4 new test cases for self-dep filter:

```ts
describe('self-dep filter', () => {
  it('should pass when self-dep is absent and targetPackageName is provided');
  it('should pass when self-dep exists with different version and targetPackageName is provided');
  it('should still fail when different package is absent (self-dep filter does not affect others)');
  it('should behave normally (fail) when targetPackageName is not provided');
});
```

**preserved:** all 6 extant tests untouched. new tests added only.

### fixContainsJSON*.test.ts — additions only

**what changed:** added 3 new test cases for self-dep in fix phase:

```ts
describe('self-dep detection (via processSelfDepsForFix)', () => {
  it('should omit self-dep when target package name matches and dep is absent');
  it('should preserve extant link:. self-dep and emit preserved warn');
  it('should not filter when relativeFilePath is not package.json');
});
```

**preserved:** all 7 extant tests untouched. new tests added only.

### new test files (no prior intention)

| file | nature |
|------|--------|
| isSelfDependency.test.ts | new — no prior intention |
| emitSelfDepWarn.test.ts | new — no prior intention |
| processSelfDepsForFix.test.ts | new — no prior intention |
| filterSelfDepsFromDeclared.test.ts | new — no prior intention |

## conclusion

one intentional behavior change documented (file: protocol). all other changes are additions. no weakened assertions. no removed tests. no changed expected values to match broken output.
