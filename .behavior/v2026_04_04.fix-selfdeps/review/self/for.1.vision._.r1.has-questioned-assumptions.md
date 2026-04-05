# self-review: has-questioned-assumptions

## hidden assumptions surfaced

### 1. `link:.` and `file:.` are the only intentional self-reference patterns

| question | answer |
|----------|--------|
| what do we assume? | only these two protocols indicate intentional self-reference |
| evidence | wish explicitly says "link:. or file:." |
| what if other patterns? | `workspace:*` is for monorepos, not self-refs |
| did wisher say this? | yes, explicitly |

**verdict: NOT an assumption — from wish** ✓

### 2. package.json is readable in fix phase

| question | answer |
|----------|--------|
| what do we assume? | FileCheckContext has access to target package.json |
| evidence | need to verify in research phase |
| what if not? | would need to pass package name through context differently |

**verdict: TECHNICAL ASSUMPTION — verify in research**

flagged in "what is awkward" section of vision.

### 3. self-deps are ALWAYS mistakes for versioned deps

| question | answer |
|----------|--------|
| what do we assume? | no legitimate use for `pkg: "1.0.0"` in `pkg` itself |
| evidence | wisher says "we have never had a need for a package to depend on itself yet" |
| what if opposite true? | test backwards compat? still better served by link:. or separate harness |
| exceptions? | none identified in years of usage |

**verdict: HOLDS** ✓ — supported by wisher's experience

### 4. warn is the right severity

| question | answer |
|----------|--------|
| what do we assume? | warn + omit, not error + halt, not silent |
| evidence | wish says "logged as a warn" |
| did wisher say this? | yes, explicitly |

**verdict: NOT an assumption — from wish** ✓

### 5. fix applies before npm/pnpm install

| question | answer |
|----------|--------|
| what do we assume? | declapract fixes files, then user installs |
| evidence | this is how declapract works (plan → apply → user action) |
| what if opposite? | irrelevant — we're fix the file contents |

**verdict: HOLDS** ✓ — correct model of declapract flow

### 6. we can detect package name reliably

| question | answer |
|----------|--------|
| what do we assume? | package.json has a `name` field |
| what if not? | addressed in vision: skip self-dep check |
| exceptions? | root package.json in monorepos sometimes lacks name — fine to skip check |

**verdict: HANDLED** ✓

### 7. exact string match is sufficient for name comparison

| question | answer |
|----------|--------|
| what do we assume? | `@org/pkg` === `@org/pkg` via simple string equality |
| evidence | npm names must be lowercase, are case-sensitive |
| what if case differs? | npm enforces lowercase, so mismatch indicates different package |
| exceptions? | historical packages with uppercase? extremely rare |

**verdict: HOLDS** ✓ — npm conventions make this safe

---

## IMPORTANT: scope clarification needed

### 8. this only affects minVersion expressions

| question | answer |
|----------|--------|
| what do we assume? | vision focused on `@declapract{check.minVersion('x.y.z')}` |
| what if opposite? | practice could declare exact version: `"pkg": "1.0.0"` |
| did wisher say this? | wish says "declared package version fix" — ANY version fix |

**verdict: SCOPE IS BROADER than minVersion**

the self-dep check should apply to ANY declared dependency value, not just minVersion expressions. if a practice declares:

```json
{ "dependencies": { "self-pkg": "1.0.0" } }
```

...in the `self-pkg` repo, that's also a self-dep that should be omitted.

**action**: vision is still correct, but implementation must handle all declared deps, not just minVersion.

---

### 9. monorepo packages are affected

| question | answer |
|----------|--------|
| what do we assume? | this affects monorepos too |
| evidence | a package that references ITSELF is the problem |
| what if monorepo? | package A that references package B is fine (different names) |
| clarification | self-dep = same package name, not "packages in same repo" |

**verdict: HOLDS** ✓ — monorepos unaffected by this change

---

## summary

| assumption | status |
|------------|--------|
| link:./file:. only intentional patterns | from wish ✓ |
| package.json readable in fix phase | verify in research |
| self-deps always mistakes | supported by experience ✓ |
| warn severity | from wish ✓ |
| fix before install | correct model ✓ |
| can detect package name | handled edge case ✓ |
| exact string match | npm conventions ✓ |
| scope: minVersion only | **BROADER — all version declarations** |
| monorepos affected | unaffected ✓ |

---

## changes made

clarified that scope covers ALL declared dependency versions, not just minVersion expressions. no change to vision needed — the vision already describes the general case correctly.
