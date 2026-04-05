# self-review r8: has-ergonomics-validated

## the review

no repros artifact exists. i compared implemented ergonomics against vision.md planned design.

### planned ergonomics (from vision.md)

**warn format planned:**
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**behavior planned:**
- self-dep detected by name match
- version self-deps omitted with warn
- extant link:./file:. preserved with warn

### implemented ergonomics

**warn format implemented (from snapshot):**
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**preserved warn format implemented:**
```
⚠️ warn: preserve self-dependency sql-dao-generator
   ├─ extant self-ref was preserved
   └─ practice declared version was skipped
```

### comparison: planned vs implemented

| aspect | planned | implemented | match? |
|--------|---------|-------------|--------|
| warn emoji | ⚠️ | ⚠️ | yes |
| treestruct format | box-draw (`├─`, `└─`) | box-draw (`├─`, `└─`) | yes |
| omitted action text | "omit self-dependency {name}@{version}" | "omit self-dependency {name}@{version}" | yes |
| first reason line | "a package should not depend on itself" | "a package should not depend on itself" | yes |
| second reason line | "if intentional, use link:. or file:." | "if intentional, use link:. or file:." | yes |
| preserved action text | (not specified in vision) | "preserve self-dependency {name}" | n/a — added |
| color | (not specified) | yellow via chalk | natural |

### ergonomics delta

| delta | type | rationale |
|-------|------|-----------|
| preserved warn added | addition | vision mentioned preserve behavior but did not spec output; added for observability |
| color is yellow | addition | natural choice for warn; matches console convention |

### why it holds

1. **omitted warn matches vision exactly** — same emoji, same format, same text
2. **preserved warn is consistent extension** — follows same treestruct pattern
3. **no drift from planned design** — implementation matches what was sketched
4. **additions are natural** — yellow color and preserved warn follow established patterns

## conclusion

ergonomics validated. implemented output matches vision.md planned design. the preserved warn is a consistent addition that was implied but not explicitly spec'd. no drift detected.

