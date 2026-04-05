# self-review r2: has-questioned-deletables

review each feature and component for deletability.

---

## features traceability

| feature | traces to | deletable? |
|---------|-----------|------------|
| isSelfDependency | vision: "detect if declared dependency matches package's own name" + criteria usecase.1 | no |
| isSelfRefProtocol | vision: "not already link:. or file:." + criteria usecase.3/4 | no |
| emitSelfDepWarn | vision: "warn logged" + criteria usecase.1 "warn is emitted" | no |
| check.minVersion file: extension | vision edgecase "file:. preserved" + criteria usecase.4 | no |
| checkContainsJSON extension | vision question #4 option C "check passes with note" | no |
| fixContainsJSONByReplacingAndAddingKeyValues extension | vision: "omit and emit warn" + criteria usecase.1 | no |

**verdict**: all features trace to vision or criteria. none deletable.

---

## components simplification check

### isSelfDependency

**question**: can this be inlined into the orchestrator?

**answer**: no — used in both checkContainsJSON and fixContainsJSONByReplacingAndAddingKeyValues. decomposed for reuse.

**verdict**: ✓ keeps — reused across phases

---

### isSelfRefProtocol

**question**: can this be merged with isLinkedDependencyVersion?

**answer**: no — distinct purposes:
- isLinkedDependencyVersion: checks if version is linked (for check.minVersion expression)
- isSelfRefProtocol: checks if value should be preserved (for self-dep handle)

they overlap for link:. but diverge for file:. handle in distinct contexts.

**verdict**: ✓ keeps — distinct purposes

---

### emitSelfDepWarn

**question**: can this be inlined?

**answer**: technically yes, but:
- isolated communicator enables unit test of output format
- follows pattern of other warn emitters in codebase
- separates i/o from logic

**verdict**: ✓ keeps — follows patterns, testable

---

### check.minVersion file: extension

**question**: is file: really needed?

**answer**: yes — vision explicitly says "file:. preserved" and criteria usecase.4 requires it. omission would be a deferral of vision requirement.

**verdict**: ✓ keeps — vision requirement

---

### checkContainsJSON extension

**question**: can we skip this and just handle in fix phase?

**answer**: absolutely not — this was the critical gap found in r2.has-zero-deferrals. without check phase handle:
- check fails for self-deps
- fix omits self-dep
- next check fails again
- infinite "needs fix" loop

**verdict**: ✓ keeps — prevents infinite loop

---

## summary

| category | count | deletable |
|----------|-------|-----------|
| transformers | 2 | 0 |
| communicators | 1 | 0 |
| check extensions | 2 | 0 |
| fix extensions | 1 | 0 |

**result**: zero deletables. all components trace to requirements and serve distinct purposes. no excess scope detected.
