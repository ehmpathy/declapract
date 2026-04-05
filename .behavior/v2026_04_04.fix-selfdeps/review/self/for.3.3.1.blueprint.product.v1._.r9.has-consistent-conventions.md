# self-review r9: has-consistent-conventions (deeper)

deeper search for extant name conventions.

---

## searched codebase for name patterns

### `is*` predicate functions

```
src/domain.objects/FilePracticeEvaluation.ts: isFixablePractice
src/domain.objects/FileCheckDeclaration.ts: isOfFileCheckType
src/domain.objects/FileCheckEvaluation.ts: isFixableCheck
src/utils/environment.ts: isOfStage
src/domain.operations/usage/plan/apply/isWithinPracticeDeclarationDirectory.ts: isWithinPracticeDeclarationDirectory
src/...checkExpressions/check.minVersion.ts: isLinkedDependencyVersion
```

**pattern**: `is` + noun phrase, returns boolean

**our new names**:
- `isSelfDependency` — follows pattern ✓
- `isSelfRefProtocol` — follows pattern ✓

---

### `check*` functions

```
src/.../checkMethods/composableActions/checkExists.ts: checkExists
src/.../checkMethods/composableActions/checkEqualsString.ts: checkEqualsString
src/.../checkMethods/composableActions/checkContainsJSON.ts: checkContainsJSON
```

**pattern**: `check` + condition, used in check phase

**our extension**: extends checkContainsJSON — no new check* function needed ✓

---

### `fix*` functions

```
src/.../fixMethods/fixContainsJSONByReplacingAndAddingKeyValues.ts
src/.../fixMethods/fixContainsWhenFileDoesntExistBySettingDeclaredContents.ts
src/.../fixMethods/fixEqualsBySettingDeclaredContents.ts
```

**pattern**: `fix` + condition + `By` + action description

**our extension**: extends fixContainsJSON* — no new fix* function needed ✓

---

### warn emission patterns

searched for warn patterns:

```
src/.../evaluateProjectAgainstPracticeDeclarations.ts:49: console.log(chalk.yellow(`  ⚠️ broken practice:${practice.name}`))
src/.../evaluateProjectAgainstPracticeDeclarations.ts:50: console.log(chalk.yellow(`    > ${error.message}`))
src/.../readPracticeDeclarations.ts:25: console.warn(...)
```

**extant pattern**: inline `console.log(chalk.yellow(...))` for warnings

**our new name**: `emitSelfDepWarn`

**question**: should we follow extant inline pattern instead of named function?

**analysis**:
- extant uses inline because warns are one-off, simple
- our warn has specific treestruct format per vision
- named function isolates format, enables test
- follows single-responsibility: format in one place

**verdict**: ✓ named function is justified — isolates testable format

---

## term alignment check

| blueprint term | vision term | criteria term | match? |
|----------------|-------------|---------------|--------|
| self-dependency | self-dependency | self-dep | ✓ |
| self-dep | self-dep | self-dep | ✓ |
| self-ref protocol | self-reference | - | ✓ (shortened) |
| omit | omit | omitted | ✓ |
| preserve | preserve | preserved | ✓ |
| warn | warn | warn | ✓ |

**verdict**: ✓ terms aligned across vision, criteria, blueprint

---

## file location check

| file | proposed location | extant pattern |
|------|-------------------|----------------|
| isSelfDependency.ts | fixMethods/ | predicates near consumers |
| isSelfRefProtocol.ts | fixMethods/ | predicates near consumers |
| emitSelfDepWarn.ts | fixMethods/ | no extant emit*, but near consumer |

**question**: should predicates go in checkExpressions/ like isLinkedDependencyVersion?

**analysis**:
- isLinkedDependencyVersion is in checkExpressions/ because it's used by check.minVersion
- isSelfDependency and isSelfRefProtocol are used by fix orchestrator
- location near consumer follows extant pattern

**verdict**: ✓ fixMethods/ is correct location — near consumer

---

## summary

| aspect | convention check | result |
|--------|------------------|--------|
| `is*` prefix | matches isLinkedDependencyVersion, isFixablePractice | ✓ |
| no new `check*` function | extends extant | ✓ |
| no new `fix*` function | extends extant | ✓ |
| `emit*` prefix | new but justified | ✓ |
| terms | aligned with vision/criteria | ✓ |
| file locations | near consumers | ✓ |

**result**: all names follow extant conventions or have justified reason to introduce new pattern.
