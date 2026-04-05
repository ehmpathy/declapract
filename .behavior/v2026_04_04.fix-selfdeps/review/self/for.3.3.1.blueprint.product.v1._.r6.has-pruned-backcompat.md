# self-review r6: has-pruned-backcompat (deeper)

deeper review with explicit wisher-request trace.

---

## what did the wisher say about backwards compat?

from wish:
> "by default, we should save users from themselves."

from vision:
> "no break changes" listed as evaluation criterion: ✅

**interpretation**: wisher wants to IMPROVE behavior without BREAK extant valid uses.

---

## trace each behavior change to wisher intent

### self-deps omitted

**wisher said**: "it should be omitted and that should be logged as a warn"

**backcompat question**: does this break extant valid uses?

**analysis**: extant self-deps cause circular install failures. there is no "valid use" to protect. omission fixes the footgun.

**verdict**: ✓ not a break — wisher explicitly requested this

---

### check passes for self-deps

**wisher said**: (implicit in vision question #4 option C)

**backcompat question**: does this break extant valid uses?

**analysis**: extant behavior was infinite "needs fix" loop. there is no "valid use" of this loop. pass behavior aligns with "save users from themselves".

**verdict**: ✓ not a break — fixes broken loop

---

### file:. preserved like link:.

**wisher said**: (vision edgecase table: "file:. preserved")

**backcompat question**: does this break extant valid uses?

**analysis**: extant file:. handle was inconsistent with link:. handle. this change makes them consistent. additive improvement, no break.

**verdict**: ✓ not a break — additive consistency

---

## what backcompat did we NOT add?

### config to disable detection

**wisher said**: no mention of config

**added?**: no

**correct?**: yes — not requested. link:. is the escape hatch per vision.

---

### deprecation period

**wisher said**: no mention of deprecation

**added?**: no

**correct?**: yes — the old behavior (circular dep) is not worth deprecate.

---

### version gate (new behavior behind flag)

**wisher said**: no mention of gradual rollout

**added?**: no

**correct?**: yes — footgun should be fixed immediately.

---

## summary

| backcompat concern | wisher requested? | we added? | correct? |
|--------------------|-------------------|-----------|----------|
| protect extant self-deps | no | no | ✓ |
| config to disable | no | no | ✓ |
| deprecation period | no | no | ✓ |
| version gate | no | no | ✓ |
| migration guide | no | no | ✓ |

**result**: zero unnecessary backcompat. all decisions trace to wisher intent or absence of wisher request. no over-protection.
