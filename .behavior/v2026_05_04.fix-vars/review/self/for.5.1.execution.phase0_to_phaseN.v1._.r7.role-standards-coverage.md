# self-review: role-standards-coverage (r7)

## final standards sweep

### briefs I may have missed

| brief | checked in prior reviews? |
|-------|---------------------------|
| rule.require.pinned-versions | no (not applicable - no package.json change) |
| rule.forbid.barrel-exports | no (not applicable - no index.ts) |
| rule.forbid.index-ts | no (not applicable - no index.ts) |
| rule.require.hook-wrapper-pattern | no (not applicable - no hooks) |

### any standards that should apply but don't?

**rule.require.snapshots:** not applicable. this is not a contract/acceptance test.

**rule.require.test-covered-repairs:** not applicable. this is a feature, not a bug fix.

**rule.require.what-why-headers:** not applicable. we modified an extant function, did not create new one.

---

## comprehensive coverage matrix

| category | standards | coverage |
|----------|-----------|----------|
| types | shapefit, forbid.as-cast | complete |
| procedures | immutable-vars, arrow-only | complete |
| errors | failfast, failloud, forbid.failhide | complete |
| tests | coverage-by-grain, forbid.failhide | complete |
| domain | bounded-contexts, directional-deps | complete |
| narrative | narrative-flow, forbid.else | complete |
| names | sync-filename, forbid.gerunds | complete |

**all applicable standards covered.** no gaps.
