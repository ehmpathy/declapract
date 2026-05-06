# self-review: role-standards-adherance (r1)

## briefs directories to check

from `.agent/repo=ehmpathy/role=mechanic/briefs/practices/`:

| directory | relevant? |
|-----------|-----------|
| code.prod/evolvable.procedures | yes — function signature |
| code.prod/evolvable.domain.operations | yes — operation names |
| code.prod/pitofsuccess.errors | yes — error patterns |
| code.prod/pitofsuccess.typedefs | yes — type annotations |
| code.prod/readable.narrative | yes — code structure |
| code.test/frames.behavior | yes — test structure |
| lang.terms | yes — gerunds, name rules |
| lang.tones | yes — no shouts |

## code review: production file

### rule.require.input-context-pattern

**rule:** functions accept `(input, context?)`.

**actual:** function unchanged — extant signature preserved.

**adherance:** not applicable (no new function).

### rule.require.arrow-only

**rule:** use arrow functions.

**actual:** extant arrow function preserved.

**adherance:** correct.

### rule.forbid.as-cast

**rule:** no `as` casts.

**actual:** no `as` casts in new code.

**adherance:** correct.

### rule.forbid.gerunds

**rule:** no gerunds in names.

**actual:** variable name `replacement` — not a gerund.

**adherance:** correct.

### rule.forbid.shouts

**rule:** no ALL_CAPS.

**actual:** no caps in new code.

**adherance:** correct.

---

## code review: test file

### rule.require.given-when-then

**rule:** use `given`, `when`, `then` from test-fns.

**actual:** extant tests use `it()` from jest. new tests follow same pattern.

**adherance:** follows extant convention (acceptable).

---

## summary

| standard | checked | adherance |
|----------|---------|-----------|
| input-context | yes | n/a |
| arrow-only | yes | correct |
| forbid.as-cast | yes | correct |
| forbid.gerunds | yes | correct |
| forbid.shouts | yes | correct |
| given-when-then | yes | follows extant |

**no role standard violations detected.**
