# self-review: role-standards-adherance (r3)

## test file standards check

### line 44-62: primary test

```typescript
it('should replace array variables with JSON array literals', () => {
  const exampleResourcesFileContents = `...`.trim();
  const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({...});
  expect(replacedFileContents).toEqual(`...`.trim());
});
```

**rule.require.given-when-then:** uses `it()` from jest.

**extant pattern:** this file uses `it()` throughout. we follow extant.

**adherance:** follows extant (acceptable).

### line 63-69: empty array test

```typescript
it('should handle empty array variables', () => {
  const result = replaceProjectVariablesInDeclaredFileContents({...});
  expect(result).toEqual('reviewers: []');
});
```

**rule.forbid.redundant-expensive-operations:** no duplicate calls across then blocks.

**adherance:** correct.

### line 70-76: single item test

```typescript
it('should handle single item array variables', () => {
  const result = replaceProjectVariablesInDeclaredFileContents({...});
  expect(result).toEqual('reviewers: ["alice"]');
});
```

**rule.prefer.data-driven:** three separate `it()` blocks vs one data-driven test.

**acceptable?** yes. tests cover distinct behaviors (primary, edge-empty, edge-single). not candidate for data-driven.

**adherance:** correct.

---

## summary

test file follows extant patterns and mechanic standards. no violations.
