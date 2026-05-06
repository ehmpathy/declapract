# self-review: role-standards-coverage (r4)

## test standards deep check

### rule.prefer.data-driven

**question:** should tests use data-driven pattern?

**new tests:**
1. array replacement (multi-variable)
2. empty array
3. single item array

**analysis:** these test distinct behaviors, not variations of same behavior. data-driven would be:

```typescript
const TEST_CASES = [
  { input: [], expected: '[]' },
  { input: ['a'], expected: '["a"]' },
  { input: ['a', 'b'], expected: '["a","b"]' },
];
```

**decision:** current structure is acceptable. edge cases are distinct enough to warrant separate tests.

**coverage:** complete.

### rule.forbid.redundant-expensive-operations

**question:** do tests repeat expensive calls?

**new tests:** each test makes one call to `replaceProjectVariablesInDeclaredFileContents`.

**analysis:** no redundant calls. each test is self-contained.

**coverage:** complete.

### rule.require.useThen-useWhen-for-shared-results

**question:** should tests use `useThen`?

**analysis:** tests don't share results across blocks. each `it()` is independent.

**coverage:** n/a (not applicable).

---

## summary

test standards fully covered. no gaps.
