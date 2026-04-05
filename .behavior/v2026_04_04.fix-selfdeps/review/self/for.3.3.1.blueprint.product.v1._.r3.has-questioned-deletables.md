# self-review r3: has-questioned-deletables (deeper)

deeper review with fresh eyes. question every component.

---

## fresh look at features

### feature: isSelfDependency transformer

**does this trace to vision/criteria?**
- vision line: "detect if a declared dependency matches the package's own `name` field"
- criteria usecase.1: "given a package `sql-dao-generator` with package.json name `sql-dao-generator`"

**if we deleted it, would we add it back?**
yes — core detection logic. cannot omit self-deps without detect first.

**verdict**: ✓ keeps

---

### feature: isSelfRefProtocol transformer

**does this trace to vision/criteria?**
- vision: "not already `link:.` or `file:.` dep"
- criteria usecase.3: "extant link:. preserved"
- criteria usecase.4: "extant file:. preserved"

**if we deleted it, would we add it back?**
yes — needed to distinguish "omit" from "preserve" cases.

**could it be simpler?**
it's a two-line prefix check. already minimal.

**verdict**: ✓ keeps

---

### feature: emitSelfDepWarn communicator

**does this trace to vision/criteria?**
- vision: "warn logged" + box-draw format spec
- criteria usecase.1: "warn is emitted in treestruct format"

**if we deleted it, would we add it back?**
yes — user must see why dep was omitted.

**could we inline it?**
could, but:
- test coverage requires isolated output verification
- consistent with codebase patterns

**verdict**: ✓ keeps

---

### feature: check.minVersion file: extension

**does this trace to vision/criteria?**
- vision edgecase table: "file:. preserved"
- criteria usecase.4: extant `file:.` preserved

**if we deleted it, would we add it back?**
yes — without this, file:. self-refs would incorrectly fail check.

**could this be merged elsewhere?**
no — isLinkedDependencyVersion is the correct place for this prefix check.

**verdict**: ✓ keeps

---

### feature: checkContainsJSON extension

**does this trace to vision/criteria?**
- vision question #4 option C: "check passes with note"
- prevents infinite "needs fix" loop (documented in r2.has-zero-deferrals)

**if we deleted it, would we add it back?**
absolutely — this was the critical gap found in prior review. deletion would break the system.

**verdict**: ✓ keeps (critical)

---

### feature: fixContainsJSONByReplacingAndAddingKeyValues extension

**does this trace to vision/criteria?**
- vision: "omit and emit warn"
- criteria usecase.1: "self-dep is NOT added to package.json"

**if we deleted it, would we add it back?**
yes — this is the primary implementation location per research.

**verdict**: ✓ keeps

---

## component count check

| layer | components | minimal? |
|-------|------------|----------|
| transformers | 2 (isSelfDependency, isSelfRefProtocol) | yes — each has distinct purpose |
| communicators | 1 (emitSelfDepWarn) | yes — single i/o boundary |
| check extensions | 2 (check.minVersion file:, checkContainsJSON self-dep) | yes — one for prefix, one for phase |
| fix extensions | 1 (fixContainsJSONByReplacingAndAddingKeyValues) | yes — single orchestrator |

**total**: 6 components — each required, none redundant.

---

## simplification opportunities explored

### could isSelfDependency and isSelfRefProtocol merge?

no — they answer distinct questions:
- isSelfDependency: "is this dep the package itself?"
- isSelfRefProtocol: "is this value a local reference?"

a self-dep could be `link:.` (detected by both) or `^1.0.0` (detected only by isSelfDependency). distinct logic.

### could emitSelfDepWarn be a simple console.log inline?

technically yes, but format specification in vision requires specific treestruct output. isolated function:
- enables format verification in tests
- centralizes format changes
- follows codebase patterns

### could we skip tests for transformers?

no — transformers are pure. unit tests verify edge cases (null name, scoped packages). cheap to test, expensive to miss.

---

## summary

| category | reviewed | deletable | simplified |
|----------|----------|-----------|------------|
| features | 6 | 0 | 0 |
| components | 6 | 0 | 0 |

**result**: zero deletables after deeper scrutiny. blueprint is minimal for the stated requirements.
