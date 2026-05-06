# self-review: role-standards-adherance (r4)

## error patterns check

### rule.require.failfast

**question:** does the code fail fast on invalid state?

**extant behavior (line 42-48):**
```typescript
if (!variableValue)
  throw new UserInputError(
    `variable was declared in file contents but its value was not defined...`,
    { potentialSolution: '...' }
  );
```

**new code:** does not modify error path. extant failfast preserved.

**adherance:** correct.

### rule.forbid.failhide

**question:** does new code hide errors?

**new code:**
```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**analysis:** no try/catch. no error suppression. errors propagate naturally.

**adherance:** correct.

### rule.require.failloud

**question:** are errors informative?

**extant error:** `UserInputError` with `potentialSolution` metadata.

**new code:** does not add new error paths. extant loud errors preserved.

**adherance:** correct.

---

## summary

error patterns unchanged. extant failfast + failloud preserved. no failhide introduced.
