# self-review r11: has-role-standards-adherance

review blueprint adherence to mechanic role standards.

---

## briefs directories to check

| directory | relevance to blueprint |
|-----------|----------------------|
| practices/code.prod/evolvable.procedures | function signatures, input/context pattern |
| practices/code.prod/evolvable.domain.operations | operation grains, name conventions |
| practices/code.prod/readable.narrative | orchestrator clarity |
| practices/code.prod/pitofsuccess.errors | error handle |
| practices/code.test | test structure, coverage |
| practices/lang.terms | name conventions |
| practices/lang.tones | terminology |

---

## rule checks

### rule.require.input-context-pattern

**rule**: functions use (input, context?) signature

**blueprint check**:
- isSelfDependency: `input: { packageName: string | null; dependencyKey: string }` ✓
- isSelfRefProtocol: `input: { value: string }` ✓
- emitSelfDepWarn: `input: { packageName: string; declaredVersion: string; action: 'omitted' | 'preserved' }` ✓

**verdict**: ✓ follows pattern

---

### rule.require.arrow-only

**rule**: use arrow functions, not function keyword

**blueprint**: declares functions, implementation will use arrows

**verdict**: ✓ assumed — implementation phase will enforce

---

### define.domain-operation-grains

**rule**: transformers (pure), communicators (i/o), orchestrators (compose)

**blueprint check**:
- isSelfDependency: transformer (pure boolean) ✓
- isSelfRefProtocol: transformer (pure boolean) ✓
- emitSelfDepWarn: communicator (console.log i/o) ✓
- fixContainsJSON*: orchestrator (composes transformers + communicator) ✓

**verdict**: ✓ grains correctly identified

---

### rule.require.get-set-gen-verbs

**rule**: operations use get/set/gen verbs

**blueprint check**:
- isSelfDependency: `is*` predicate — exempt from get/set/gen ✓
- isSelfRefProtocol: `is*` predicate — exempt from get/set/gen ✓
- emitSelfDepWarn: `emit*` communicator — not a get/set/gen operation ✓

**note**: `emit*` is a side-effect verb, similar to `log*` or `send*`. not required to follow get/set/gen.

**verdict**: ✓ appropriate verbs for operation types

---

### rule.forbid.decode-friction-in-orchestrators

**rule**: orchestrators must not contain inline decode-friction

**blueprint check**: fixContainsJSON* extension delegates to:
- isSelfDependency (named predicate)
- isSelfRefProtocol (named predicate)
- emitSelfDepWarn (named communicator)

**verdict**: ✓ no decode-friction — all logic in named functions

---

### rule.require.thorough-test-coverage

**rule**: tests for all grains

**blueprint check**:
- isSelfDependency: unit test declared ✓
- isSelfRefProtocol: unit test declared ✓
- emitSelfDepWarn: unit test (spy) declared ✓
- fixContainsJSON*: integration test declared ✓
- checkContainsJSON: unit test extension declared ✓

**verdict**: ✓ all grains have tests

---

### rule.forbid.gerunds

**rule**: no -ing suffixes in names

**blueprint check**:
- isSelfDependency: no gerund ✓
- isSelfRefProtocol: no gerund ✓
- emitSelfDepWarn: no gerund ✓

**verdict**: ✓ no gerunds

---

### rule.require.ubiqlang

**rule**: consistent terminology

**blueprint check**: uses "self-dependency", "self-dep", "omit", "preserve" — consistent with vision/criteria

**verdict**: ✓ consistent terminology

---

## gaps found

none.

---

## summary

| standard | blueprint adherence |
|----------|---------------------|
| input-context pattern | ✓ |
| arrow functions | ✓ (implementation) |
| operation grains | ✓ |
| get/set/gen verbs | ✓ (exempt for predicates/emitters) |
| no decode-friction | ✓ |
| test coverage | ✓ |
| no gerunds | ✓ |
| ubiqlang | ✓ |

**result**: blueprint adheres to mechanic role standards. no violations found.
