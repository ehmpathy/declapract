# self-review r5: has-pruned-yagni (deeper)

deeper pass at YAGNI with adversarial mindset.

---

## adversarial questions for each component

### isSelfDependency: why not inline?

**adversarial**: "just put `packageName === depKey` inline. why a whole function?"

**defense**:
- used in TWO places: checkContainsJSON AND fixContainsJSON
- inline in both = duplication
- if detection logic changes, update two places

**but wait**: the logic is a single line. is that worth a file?

**deeper**: the file also contains the test. test coverage for edge cases (null name, scoped packages) justifies the file.

**verdict**: ✓ justified — reuse + testability

---

### isSelfRefProtocol: why not hardcode in caller?

**adversarial**: "just write `value.startsWith('link:') || value.startsWith('file:')` inline"

**defense**:
- makes intent clear: "is this a self-reference protocol?"
- name documents purpose
- test coverage for edge cases (workspace:, git://)

**but wait**: edge cases are one-liners too.

**deeper**: the name carries semantic weight. `isSelfRefProtocol(value)` vs `value.startsWith('link:') || value.startsWith('file:')` — former is self-descriptive.

**verdict**: ✓ justified — clarity + testability

---

### emitSelfDepWarn: why not just console.log inline?

**adversarial**: "wrap console.log in a function? overhead."

**defense**:
- format is specified in vision (box-draw treestruct)
- format has multiple lines
- test coverage verifies format

**but wait**: format could be a template string inline.

**deeper**: the test needs to spy on output. isolated function makes spy clean. inline would require mock of console.log in orchestrator test.

**verdict**: ✓ justified — testability + format complexity

---

### check.minVersion file: extension: why add?

**adversarial**: "link: already works. why add file:?"

**defense**:
- vision edgecase table: "file:. preserved"
- criteria usecase.4: "extant file:. preserved"

**but wait**: does anyone use file:. for self-ref?

**deeper**: doesn't matter. criteria says it must work. we implement what was requested.

**verdict**: ✓ justified — explicit requirement

---

### checkContainsJSON extension: couldn't fix alone handle it?

**adversarial**: "why modify check? just let it fail, fix omits, done."

**defense**:
- this was the critical gap found in r2.has-zero-deferrals
- without check extension: infinite "needs fix" loop
- vision question #4 option C: "check passes with note"

**but wait**: maybe the loop is acceptable?

**deeper**: no — loop means user runs declapract repeatedly with same "needs fix" output. poor UX. vision explicitly chose option C (check passes).

**verdict**: ✓ justified — vision requirement + UX

---

### test files: are all tests needed?

**adversarial**: "6 test files for 6 prod files. too many?"

**defense**:
- transformers get unit tests (pure, cheap)
- communicator gets unit test (output format)
- orchestrators get integration tests (per criteria)

**but wait**: could we skip transformer tests?

**deeper**: transformer tests catch edge cases:
- isSelfDependency: null name, scoped packages, scoped vs unscoped
- isSelfRefProtocol: workspace:, git://

these edge cases are worth test coverage. cheap tests, high value.

**verdict**: ✓ justified — coverage for edge cases

---

## final adversarial sweep

| "why not just..." | response |
|-------------------|----------|
| inline all logic | reuse in check + fix, testability |
| skip check extension | infinite loop, vision chose option C |
| skip file: support | explicit in criteria usecase.4 |
| skip preserved warn | vision says inform user in all cases |
| use single monolithic function | violates single-responsibility, hurts test isolation |

---

## summary

| component | adversarial question | justified? |
|-----------|---------------------|------------|
| isSelfDependency | inline instead? | ✓ reuse + test |
| isSelfRefProtocol | hardcode instead? | ✓ clarity + test |
| emitSelfDepWarn | console.log inline? | ✓ format + test |
| check.minVersion file: | skip file:? | ✓ criteria explicit |
| checkContainsJSON | skip check? | ✓ vision + UX |
| test files | skip tests? | ✓ edge cases worth coverage |

**result**: adversarial review complete. no YAGNI violations found. each component defends its existence.
