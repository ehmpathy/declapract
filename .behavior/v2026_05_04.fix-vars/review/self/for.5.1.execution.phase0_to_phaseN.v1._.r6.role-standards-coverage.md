# self-review: role-standards-coverage (r6)

## domain standards

### rule.require.bounded-contexts

**question:** does code respect bounded contexts?

**file location:** `src/domain.operations/usage/evaluate/projectVariableExpressions/`

**imports in new code:** none added.

**coverage:** complete (no cross-context imports).

### rule.require.directional-deps

**question:** does code follow dependency direction?

**layer:** `domain.operations`

**imports:** `flat` (external), `@src/domain.objects`, `@src/utils`

**analysis:** imports only from lower layers (domain.objects, utils) and external packages. correct direction.

**coverage:** complete.

### rule.require.sync-filename-opname

**file:** `replaceProjectVariablesInDeclaredFileContents.ts`

**export:** `replaceProjectVariablesInDeclaredFileContents`

**match:** yes.

**coverage:** complete.

---

## summary

all domain standards covered. bounded context respected, deps directional, names synced.
