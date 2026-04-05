# self-review r2: has-questioned-assumptions (deeper)

the first pass was surface level. let me dig deeper.

---

## deeper assumptions surfaced

### 10. what happens when dep already is `link:.`?

| question | answer |
|----------|--------|
| scenario | dep already is `link:.`, practice declares `"pkg": "@declapract{check.minVersion('1.0.0')}"` |
| what happens today? | link:. passes minVersion check, preserved — extant behavior works |
| what if practice declares exact version? | same — if current is link:., what should happen? |
| the gap | what if practice declares `"pkg": "2.0.0"` (not minVersion) and current is `link:.`? |

**verdict: AMBIGUOUS EDGE CASE**

today's behavior: fixContainsJSONByReplaceAndAddKeyValues would overwrite `link:.` with `2.0.0` because it's not a minVersion expression.

but wait — this is the OPPOSITE of the wish. the wish says preserve `link:.` if it already is one.

**action needed**: the check must happen for ANY declared value that would create a self-dep, not just minVersion. if current value is `link:.` or `file:.`, preserve it regardless of what practice declares.

this is more nuanced than my first review caught.

---

### 11. partial name matches

| question | answer |
|----------|--------|
| scenario | package is `@org/foo-bar`, practice declares dep on `foo-bar` |
| assumption | exact string match means these are different packages |
| evidence | npm treats `@org/foo-bar` and `foo-bar` as completely different |
| what if... | someone copies a practice from scoped to unscoped package? |

**verdict: HOLDS** ✓

exact string match is correct. `@org/foo-bar` !== `foo-bar`. if someone copies practices incorrectly, that's a different problem.

---

### 12. monorepo with multiple package.json files

| question | answer |
|----------|--------|
| scenario | monorepo has root package.json (maybe no name) and packages/foo/package.json (has name) |
| which one is "ours"? | the one in the directory where the fix is applied |
| assumption | declapract fix context knows which package.json it currently targets |
| evidence | need to verify — FileCheckContext should have this info |

**verdict: TECHNICAL ASSUMPTION — verify in research**

if we modify `packages/foo/package.json`, we should read its `name` field. if we modify root `package.json`, we should read that one's name (or skip if absent).

---

### 13. private packages

| question | answer |
|----------|--------|
| scenario | `private: true` means package isn't published to npm |
| does self-dep matter? | yes — circular dep still breaks local install |
| different behavior? | no — same logic applies |

**verdict: HOLDS** ✓ — private packages have same problem

---

### 14. check phase vs fix phase behavior

| question | answer |
|----------|--------|
| scenario | declapract plan shows "package.json needs fix" — does it flag self-dep? |
| assumption | self-dep detection happens in fix phase, emits warn, omits |
| what about check phase? | should check PASS or FAIL for self-dep? |
| the wish says | "should be omitted" (in fix) and "logged as a warn" |

**verdict: DESIGN DECISION NEEDED**

two options:

**option A: check passes, fix omits**
- check phase: self-dep check passes (because we'll omit it anyway)
- fix phase: omit + warn
- result: "package.json is compliant" shown to user
- con: deceptive — the declared dep isn't actually present

**option B: check fails, fix omits**
- check phase: self-dep check fails (practice says add dep, we won't)
- fix phase: omit + warn
- result: "package.json needs fix" but fix is a no-op for self-dep
- con: unclear — why fix if fix does... no action?

**option C (better): check passes with note, fix omits with warn**
- check phase: passes, but logs note about omitted self-dep
- fix phase: omits + warns
- result: clear — we intentionally don't apply this rule

**action**: add this design question to vision's open questions.

---

### 15. multiple self-deps in one practice

| question | answer |
|----------|--------|
| scenario | practice declares deps on pkg-a, pkg-b, pkg-c — we're in pkg-b |
| assumption | only pkg-b is omitted, pkg-a and pkg-c added normally |
| evidence | each dep is evaluated independently |

**verdict: HOLDS** ✓ — per-dep logic is correct

---

## changes made to vision

### issue 1: extant `link:.` with exact version declaration

**the gap**: vision didn't address what happens when a dep is already `link:.` but practice declares an exact version like `"2.0.0"` (not minVersion).

**how i fixed it**: added two new rows to the edgecases table:

```
| extant `link:.` but practice declares exact version | preserve `link:.`, warn | extant intentional self-ref takes precedence |
| extant `file:.` but practice declares exact version | preserve `file:.`, warn | extant intentional self-ref takes precedence |
```

this clarifies that extant intentional self-refs are ALWAYS preserved, regardless of what the practice declares.

### issue 2: check phase vs fix phase behavior

**the gap**: vision didn't address what happens in check phase when self-dep detected.

**how i fixed it**: added new question #4 to "questions to validate with wisher":

```
4. **check phase vs fix phase behavior** — when self-dep detected:
   - option A: check passes, fix omits (result: "compliant" but dep not present — deceptive?)
   - option B: check fails, fix omits (result: "needs fix" but fix is no-op — unclear?)
   - option C: check passes with note, fix omits with warn (current vision — clear intent)
```

this surfaces the design decision for wisher validation.

---

## even deeper: r3 findings

### 16. the warn message format

**what i wrote**: example message says "a package cannot depend on itself"

**issue**: technically FALSE — npm allows it, just causes problems.

**how i fixed it**: changed to "should not" instead of "cannot" in vision ✓

---

### 17. dep types incomplete

**what i wrote**: question #3 only asked about devDependencies

**issue**: missed optionalDependencies, peerDependencies, bundledDependencies

**how i fixed it**: expanded question #3 to list all types; noted bundledDependencies is separate (name list, not version specs) ✓

---

### 18. workspace protocol `workspace:*`

**question**: should workspace:* be an intentional self-ref pattern?

**verdict: HOLDS** ✓ — workspace:* is for cross-package refs in monorepos, not self-refs. wisher correctly excluded it.

---

### 19. plan output specificity

**issue**: didn't specify HOW plan shows omitted self-deps (implicit vs explicit)

**how i fixed it**: updated timeline to say "explicitly shows omitted self-deps (not silently hidden)" ✓

---

### 20. which package.json `name` do we use?

**issue**: assumption #2 was ambiguous in monorepo context

**how i fixed it**: clarified to "the `name` field of the package.json under modification" ✓

---

## summary of all findings

### issues found and fixed

| issue | how fixed |
|-------|-----------|
| link:. preservation with exact version declares | added to edgecases table in vision |
| check vs fix phase behavior | added as question #4 to validate with wisher |
| "cannot" is technically wrong | changed to "should not" in example warn message |
| dep types incomplete | expanded question #3 to cover all dep types |
| which package.json | clarified assumption #2 |
| plan output visibility | updated timeline to say "explicitly shows" |

### non-issues: why they hold

| assumption | why it holds |
|------------|--------------|
| partial name matches | npm treats `@org/pkg` and `pkg` as different packages; exact string match is correct per npm spec |
| private packages | `private: true` still has circular dep problem locally; same logic applies |
| multiple self-deps in one practice | each dep evaluated independently; only matching name omitted, others proceed |
| workspace protocol excluded | workspace:* is for cross-package refs, not self-refs; wisher correctly excluded |

### deferred to research

| assumption | why deferred |
|------------|--------------|
| monorepo package.json context | need to verify FileCheckContext knows which package.json it targets — technical implementation detail |
