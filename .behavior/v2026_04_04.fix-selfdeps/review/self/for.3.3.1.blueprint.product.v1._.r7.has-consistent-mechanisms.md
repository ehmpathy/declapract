# self-review r7: has-consistent-mechanisms

review new mechanisms for duplication of extant functionality.

---

## extant mechanisms from research

from research.prod:
- `isLinkedDependencyVersion` — checks value.startsWith('link:')
- `chalk.yellow + console.log` — warn output pattern
- `FileCheckContext.getProjectRootDirectory()` — root path access
- `readFileIfExistsAsync` — file read utility
- `deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues` — merge utility

---

## new mechanism: isSelfDependency

**function**: compare packageName === dependencyKey

**does extant code do this?**: no — no extant name comparison for self-dep detection

**verdict**: ✓ unique — no duplication

---

## new mechanism: isSelfRefProtocol

**function**: value.startsWith('link:') || value.startsWith('file:')

**does extant code do this?**: partial — isLinkedDependencyVersion handles link: but not file:

**question**: after we extend isLinkedDependencyVersion for file:, could isSelfRefProtocol reuse it?

**analysis**:
- isLinkedDependencyVersion is in checkExpressions/ — for check.minVersion
- isSelfRefProtocol would be in fixMethods/ — for self-dep preserve logic
- distinct locations, distinct semantic purposes
- isLinkedDependencyVersion answers "is this a linked version for minVersion check?"
- isSelfRefProtocol answers "is this a self-reference protocol for preservation?"

**verdict**: ✓ distinct purpose — separation is intentional, not duplication

---

## new mechanism: emitSelfDepWarn

**function**: console.log with chalk.yellow and box-draw format

**does extant code do this?**: partial — extant code uses console.log + chalk.yellow pattern

**question**: should we use an extant warn emitter?

**analysis**:
- research found no centralized emitWarn function
- each warn is contextual with specific format
- this warn has unique box-draw treestruct format per vision
- new emitter for this specific format is consistent

**verdict**: ✓ consistent pattern — follows extant inline-warn approach

---

## reuse from extant

| extant mechanism | reused in blueprint? |
|-----------------|---------------------|
| FileCheckContext.getProjectRootDirectory() | ✓ yes — contracts table |
| readFileIfExistsAsync | ✓ yes — contracts table |
| chalk.yellow | ✓ yes — contracts table |
| isLinkedDependencyVersion | ✓ yes — extended for file: |
| deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues | ✓ yes — extended for self-dep |

**verdict**: ✓ extant mechanisms reused where applicable

---

## summary

| new mechanism | duplicates extant? | verdict |
|--------------|-------------------|---------|
| isSelfDependency | no | ✓ unique |
| isSelfRefProtocol | partial (isLinkedDependencyVersion) | ✓ distinct purpose |
| emitSelfDepWarn | no (follows pattern) | ✓ consistent |

**result**: no duplication. new mechanisms serve distinct purposes. extant mechanisms reused where applicable.
