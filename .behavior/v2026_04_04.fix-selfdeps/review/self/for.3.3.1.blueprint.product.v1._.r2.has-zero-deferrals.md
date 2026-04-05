# self-review r2: has-zero-deferrals (deeper)

deeper review of vision requirements vs blueprint coverage.

---

## detailed vision analysis

### line 69 — plan output explicitly shows omitted

**vision says**: `declapract plan` — shows proposed changes, **explicitly shows omitted self-deps (not silently hidden)**

**blueprint says**: fix runs at plan time (research citation [11]), emitSelfDepWarn emits via console.log

**question**: is this sufficient? the warn goes to console during fix execution, which happens at plan time. so yes, the user sees it.

**verdict**: ✓ covered — warn emitted during plan phase, not silently hidden

---

### question #4 — check passes with note

**vision says**: option C: check passes with note, fix omits with warn

**blueprint says**: focuses on fix function behavior. does not explicitly address check phase.

**scrutiny**: what happens during CHECK phase?
- the check function uses checkContainsJSON
- checkContainsJSON uses check.minVersion which calls isLinkedDependencyVersion
- isLinkedDependencyVersion returns true for `link:.` → check PASSES
- but what if the dep is absent or a regular version?

**realization**: the CHECK phase currently would FAIL for a self-dep that's absent. the fix emits the warn and omits. but option C says "check passes with note".

**is this a gap?**

let me re-read vision option C more carefully:
- "check passes with note" — the check should not show FAIL for self-deps
- "fix omits with warn" — the fix should omit and warn

**analysis**:
- if check FAILS, the plan shows "needs fix"
- but the fix is a no-op (omits the dep)
- this might confuse users: "needs fix" but no changes occur

**however**: looking at extant behavior:
- if a practice declares a dep and it's absent, check FAILS
- fix adds the dep
- for self-deps, fix OMITS (doesn't add)
- check will STILL fail on subsequent runs

**wait**: but the fix leaves the dep out. so on next check run:
- declared dep exists in practice
- dep is NOT in package.json (was omitted)
- check will FAIL again
- infinite "needs fix" loop?

**critical realization**: the current blueprint approach has a flaw. if we omit the self-dep during fix, the check will keep failing forever. option C says "check passes" which means we need to also modify the CHECK logic to pass for self-deps.

**verdict**: ⚠️ GAP FOUND — blueprint doesn't address CHECK phase behavior

---

### question #5 — structured output (deferral)

**vision says**: nice-to-have, not core — add later if needed

**verdict**: ✓ acceptable deferral — self-declared as "nice-to-have"

---

### edgecases table line 128

**vision says**: dep already present as regular version | omit the fix, warn

**blueprint says**: test case [+] [case] self-dep version → omitted + warn

**scrutiny**: what if the dep is ALREADY present as a version? the blueprint handles this via "extant value" check in the orchestrator logic.

**verdict**: ✓ covered

---

## gap found — check phase must also pass

### the issue

blueprint focuses on FIX phase but vision question #4 explicitly says CHECK should pass (with note).

current flow:
1. practice declares self-dep
2. check runs → FAILS (dep not in package.json)
3. fix runs → omits self-dep, warns
4. next check → FAILS again (infinite loop)

required flow:
1. practice declares self-dep
2. check runs → PASSES with note "self-dep omitted"
3. fix runs → omits self-dep, warns (only if somehow triggered)

### how to fix blueprint

add to check.minVersion or checkContainsJSON:
- detect self-dep during check phase
- if self-dep detected: return PASS with note
- log note about self-dep

### blueprint changes needed

**filediff tree update:**
```
checkExpressions/
├── [~] check.minVersion.ts              # already in blueprint
└── [+] new: checkContainsJSON needs self-dep detection  # ABSENT
```

**codepath tree update:**
```
checkContainsJSON
├── [~] extend
├── add self-dep detection before fail
└── if self-dep detected: return null (pass) + emit note
```

---

## fixed issues

### issue: check phase not addressed

**gap found**: blueprint focused on FIX phase but vision question #4 option C says CHECK should pass (with note). this would cause infinite "needs fix" loop.

**fix applied**: updated blueprint 3.3.1.blueprint.product.v1.stone to include:

1. filediff tree update:
   ```
   checkMethods/composableActions/
       └── [~] checkContainsJSON.ts                   # extend: self-dep detection in check phase
   ```

2. codepath tree update:
   ```
   checkContainsJSON
   ├── [~] extend check method
   ├── reason: vision question #4 option C — check must pass for self-deps
   └── extend at dependency check:
       ├── [←] reuse: isSelfDependency transformer
       ├── [+] if self-dep detected AND value would fail:
       │   ├── emit note "self-dep omitted intentionally"
       │   └── return null (pass) instead of fail reason
       └── [○] retain: all other logic
   ```

3. test tree update:
   ```
   src/domain.operations/declaration/.../checkMethods/composableActions/
   ├── [○] checkContainsJSON.ts
   └── [~] checkContainsJSON.test.ts                            # unit: extend
       ├── [extant] pass when link:. for minVersion
       ├── [+] [case] self-dep absent → pass (not fail)
       ├── [+] [case] self-dep version mismatch → pass (not fail)
       └── [+] [case] different package absent → fail (normal)
   ```

4. key decision #5 added:
   > check phase behavior: per vision question #4 option C, check must PASS (not fail) for self-deps. this prevents infinite "needs fix" loops where fix omits the dep but check keeps failing.

5. implementation sequence updated to 5 steps (step 4 = checkContainsJSON)

**verdict**: ✓ gap closed — blueprint now addresses both check and fix phases

---

## summary after fix

| category | total | covered | deferred | gaps |
|----------|-------|---------|----------|------|
| vision requirements | 9 | 9 | 0 | 0 |
| acceptable deferrals | 1 | - | 1 (structured output) | - |

**result**: zero deferrals. all vision requirements addressed. check phase gap was found and fixed.
