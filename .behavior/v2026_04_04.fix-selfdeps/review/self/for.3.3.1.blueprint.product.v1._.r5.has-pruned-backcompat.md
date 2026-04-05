# self-review r5: has-pruned-backcompat

review for backwards compatibility concerns not explicitly requested.

---

## backwards compat mechanisms in blueprint

scan for:
- shims
- legacy support
- feature flags
- deprecation warnings
- migration paths
- opt-out mechanisms

**found**: none

---

## behavior changes analysis

this feature introduces behavior changes. are we over-protecting backwards compat?

### change 1: self-deps now omitted

**before**: practice declares `pkg-x` dep in `pkg-x` repo → dep added to package.json

**after**: same scenario → dep omitted with warn

**backcompat concern?**: no — the "before" behavior was a footgun. users who hit this had broken installs. no one relies on this broken behavior.

**verdict**: ✓ no backcompat needed — fix for footgun

---

### change 2: check phase passes for self-deps

**before**: practice declares `pkg-x` dep in `pkg-x` repo → check FAILS

**after**: same scenario → check PASSES (with note)

**backcompat concern?**: maybe — users might have automation that expects FAIL status?

**analysis**: this is the "infinite loop" fix from r2.has-zero-deferrals. the old behavior was broken (fix omits → check fails → fix omits → ...). no one would automate against this loop.

**verdict**: ✓ no backcompat needed — fix for broken behavior

---

### change 3: file:. treated like link:.

**before**: file:. self-ref might not be preserved

**after**: file:. self-ref preserved like link:.

**backcompat concern?**: no — this is additive. file:. users get better support, link:. users unaffected.

**verdict**: ✓ no backcompat needed — additive improvement

---

## potential backcompat we DID NOT add

| mechanism | did we add? | should we? |
|-----------|-------------|------------|
| config flag to disable self-dep detection | no | no — not requested |
| deprecation warn for old behavior | no | no — old behavior was broken |
| migration guide | no | no — no migration needed |
| opt-out pragma in practice files | no | no — vision says link:. is escape hatch |
| version-gated behavior | no | no — adds complexity |

**verdict**: ✓ correct — no unnecessary backcompat mechanisms

---

## summary

| category | backcompat mechanisms | requested? |
|----------|----------------------|------------|
| shims | 0 | n/a |
| feature flags | 0 | n/a |
| deprecation paths | 0 | n/a |
| opt-out mechanisms | 0 | n/a |

**result**: zero backwards compat mechanisms added. behavior changes are fixes for broken/footgun scenarios. no over-protection of old behavior.
