# self-review: has-consistent-conventions (r4)

## final verification: line-by-line convention check

### line 26-29: type annotation

```typescript
const flattenedProjectVariables: Record<string, string | string[]> = flatten(
  projectVariables,
  { safe: true },
);
```

**extant convention for type annotations:**

looked at other files:

```typescript
// in fixContainsJSON*.ts
const newObject: Record<string, any> = {};
```

**pattern:** inline Record types with explicit key/value types. we follow this.

### line 50-52: ternary expression

```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**extant convention for multi-line ternaries:**

looked at other files:

```typescript
// in getFileCheckDeclaration.ts
const check = isRequired
  ? checks.required
  : checks.optional;
```

**pattern:** condition on first line, `?` and `:` branches on subsequent lines. we follow this.

### line 53: usage in replaceAll

```typescript
return replaceAll(contents, thisVariableExpression, replacement);
```

**pattern:** final argument is the replacement string. name aligns with function signature.

---

## test file: convention check

### test structure

```typescript
it('should replace array variables with JSON array literals', () => {
  const exampleResourcesFileContents = `...`.trim();
  const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({...});
  expect(replacedFileContents).toEqual(`...`.trim());
});
```

**extant pattern:**

```typescript
it('should replace all occurrences of declared variables with their implemented values', async () => {
  const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({...});
  expect(replacedFileContents).toEqual(`...`.trim());
});
```

**differences:**
- extant uses `async` even for sync function — our test omits (correct)
- extant uses `exampleReadmeFileContents` at module level — we use `exampleResourcesFileContents` inline

**is inline okay?** yes. edge case tests often have inline fixtures. no convention violation.

---

## summary

all conventions verified:
- type annotations: inline Record with explicit types
- ternary format: multi-line with condition first
- test structure: it() with expect().toEqual()
- variable names: camelCase, descriptive

**no convention divergence detected.**
