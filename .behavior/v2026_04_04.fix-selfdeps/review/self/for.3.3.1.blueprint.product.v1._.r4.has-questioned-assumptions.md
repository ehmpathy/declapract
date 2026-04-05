# self-review r4: has-questioned-assumptions (deeper)

second pass at assumptions with fresh perspective.

---

## deeper dive: architecture assumptions

### assumption: separate transformers vs inline logic

**what we assume**: isSelfDependency and isSelfRefProtocol should be separate functions.

**what if wrong?**: could inline the logic where used.

**evidence for separation**:
- isSelfDependency used in both check and fix phases
- isSelfRefProtocol used for both preserve and skip decisions
- separation enables unit tests without orchestrator complexity

**counterargument**: inline would reduce file count.

**conclusion**: separation justified. reuse + testability outweighs file count concern.

**verdict**: ✓ holds

---

### assumption: synchronous package.json read is acceptable

**what we assume**: readFileIfExistsAsync is called to read root package.json.

**what if wrong?**: block i/o could slow large monorepos.

**analysis**: package.json is small (<10KB typical). single file read per fix invocation. not in hot path.

**verdict**: ✓ holds — acceptable performance

---

### assumption: no cache needed for package name

**what we assume**: read package.json each time fix runs for a dependency.

**what if wrong?**: repeated reads waste i/o.

**analysis**: the fix function processes one file at a time. within a single file fix, the package name doesn't change. cache adds complexity for minimal gain.

**verdict**: ✓ holds — simplicity over premature optimization

---

## deeper dive: behavioral assumptions

### assumption: warn is sufficient, error not needed

**what we assume**: self-deps get warn, not error.

**what if wrong?**: users might miss warn output.

**evidence**: vision explicitly says "warn" not "error". wish says "logged as a warn". criteria says "warn is emitted".

**verdict**: ✓ holds — vision is explicit

---

### assumption: omit silently is wrong, warn explicitly is right

**what we assume**: must warn user when we omit.

**what if wrong?**: silent omission might be cleaner UX.

**evidence**: vision says "explicitly shows omitted self-deps (not silently hidden)". criteria usecase.1 requires warn.

**verdict**: ✓ holds — explicit is required

---

### assumption: extant self-refs should warn too

**what we assume**: when extant link:./file:. is preserved, emit "preserved" warn.

**what if wrong?**: preservation is success, no warn needed.

**analysis**: the warn serves two purposes:
1. inform user about self-dep detection
2. explain why declared version was not applied

even for preservation, user should know their self-dep was detected.

**verdict**: ✓ holds — inform user in all cases

---

## deeper dive: scope assumptions

### assumption: only direct self-deps, not transitive

**what we assume**: we only detect `pkg-a` depends on `pkg-a`, not `pkg-a → pkg-b → pkg-a` cycles.

**what if wrong?**: transitive cycles also break installs.

**evidence**: vision question #6 says "out of scope — this is for DIRECT self-deps only". criteria usecase.8 explicitly states "only direct (not transitive)".

**verdict**: ✓ holds — scope is explicit

---

### assumption: bundledDependencies not in scope

**what we assume**: we handle dependencies, devDependencies, peerDependencies, optionalDependencies but not bundledDependencies.

**what if wrong?**: bundledDependencies could have self-refs.

**analysis**: bundledDependencies is a name list (strings), not version specs. the self-dep problem is about version specs that create circular install issues. bundledDependencies doesn't specify versions.

**verdict**: ✓ holds — bundledDependencies is distinct

---

## summary

| # | assumption | category | questioned? | holds? |
|---|------------|----------|-------------|--------|
| 1 | separate transformers | architecture | yes | ✓ |
| 2 | sync read acceptable | architecture | yes | ✓ |
| 3 | no cache needed | architecture | yes | ✓ |
| 4 | warn not error | behavior | yes | ✓ |
| 5 | explicit warn not silent | behavior | yes | ✓ |
| 6 | warn on preserve too | behavior | yes | ✓ |
| 7 | direct only | scope | yes | ✓ |
| 8 | bundledDeps excluded | scope | yes | ✓ |

**result**: 8 additional assumptions questioned in r4. all hold. no hidden issues.
