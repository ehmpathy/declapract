# self-review: role-standards-coverage (r2)

## production file: what should be present?

### line 26-29: type annotation

**standard:** rule.require.shapefit

**required:** explicit type for function return and variable declarations.

**present:**
```typescript
const flattenedProjectVariables: Record<string, string | string[]> = ...
```

**coverage:** complete.

### line 50-52: immutability

**standard:** rule.require.immutable-vars

**required:** use `const` for all variable declarations.

**present:**
```typescript
const replacement = ...
```

**coverage:** complete.

### overall: no as-casts

**standard:** rule.forbid.as-cast

**required:** no `as X` type assertions.

**present:** zero `as` casts in new code.

**coverage:** complete.

---

## test file: what should be present?

### test existence

**standard:** rule.require.test-coverage-by-grain

**grain:** transformer (pure function).

**required:** unit tests.

**present:** 3 new tests in `.test.ts`.

**coverage:** complete.

### test assertions

**standard:** rule.forbid.failhide (tests)

**required:** every test has explicit assertions.

**present:** all tests use `expect(...).toEqual(...)`.

**coverage:** complete.

---

## summary

| file | standard | required | present |
|------|----------|----------|---------|
| prod | type annotation | yes | yes |
| prod | immutable vars | yes | yes |
| prod | no as-cast | yes | yes |
| test | unit tests | yes | yes |
| test | explicit assertions | yes | yes |

**all required standards covered.**
