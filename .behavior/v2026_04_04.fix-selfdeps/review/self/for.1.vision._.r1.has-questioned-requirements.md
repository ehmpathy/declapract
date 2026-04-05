# self-review: has-questioned-requirements

## requirements from the wish

### 1. omit self-deps when package name matches repo

| question | answer |
|----------|--------|
| who said this? | the wish, explicitly |
| evidence | "otherwise, it causes recursive dependencies" |
| what if we didn't? | circular deps in package.json, broken installs |
| is scope right? | yes — focused, minimal intervention |
| simpler way? | no — this is the minimal fix for the footgun |

**verdict: HOLDS** ✓

### 2. only if not already `link:.` or `file:.`

| question | answer |
|----------|--------|
| who said this? | wish explicitly says "its not already a `link:.` or `file:.` dep" |
| evidence | these ARE intentional self-references that work |
| what if we didn't? | we'd break legitimate use cases |

**verdict: HOLDS** ✓

### 3. log as warning

| question | answer |
|----------|--------|
| who said this? | wish says "should be logged as a warn" |
| evidence | observability good, users should know what happened |
| what if we didn't? | users confused why dep wasn't added |

**verdict: HOLDS** ✓

### 4. no special pragma escape hatch by default

| question | answer |
|----------|--------|
| who said this? | wish says "if we do, we can add some special pragma... but by default" |
| evidence | "we have never had a need for a package to depend on itself yet" |
| what if we didn't? | more complexity for a case that doesn't yet exist |

**verdict: HOLDS** ✓

---

## requirements i added (not in wish)

### 5. applies to devDependencies, peerDependencies, etc.

| question | answer |
|----------|--------|
| who said this? | i assumed it |
| evidence | same circular dep problem applies to all dep types |
| what if we didn't? | inconsistent behavior (deps blocked, devDeps allowed) |
| is it too broad? | wish says "a dep" generically, doesn't distinguish types |

**verdict: REASONABLE assumption, but should VALIDATE with wisher**

added to open questions in vision.

### 6. use package.json `name` field to detect self

| question | answer |
|----------|--------|
| who said this? | i assumed it |
| evidence | this is the standard/only reliable way to identify a package |
| what if we didn't? | no other way to know "what package am i?" |

**verdict: HOLDS** ✓ — this is the only sensible approach

### 7. detailed warning message UX

| question | answer |
|----------|--------|
| who said this? | i designed it |
| evidence | good ux practice — explain what happened and escape hatch |
| simpler? | could be just "omitted self-dep" but less helpful |

**verdict: HOLDS** ✓ — details can evolve but direction is right

---

## potential over-engineering

### did i add unnecessary complexity?

- **implementation location options**: i listed 3 places where this could live. this is research, not a requirement. will be resolved in blueprint phase.

- **edge case table**: comprehensive but all cases are real (scoped packages, missing name field, etc.). not over-engineered.

- **analogies section**: optional flavor, helps communication. fine to keep.

**verdict: scope is appropriate** ✓

---

## what i questioned and changed

no changes made. the vision directly reflects the wish with reasonable additions for completeness.

---

## remaining open questions

these are properly captured in the vision's "questions to validate with wisher" section:

1. should this be an error or warning? (vision says warning per wish)
2. escape hatch pragma needed? (vision says no per wish)
3. applies to devDependencies too? (vision says yes, should validate)

---

## conclusion

the vision faithfully captures the wish with no scope creep. all additions are either obvious necessities (using `name` field) or flagged as assumptions to validate. ready to proceed.
