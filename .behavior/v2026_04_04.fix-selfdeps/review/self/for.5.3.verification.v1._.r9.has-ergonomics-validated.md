# self-review r9: has-ergonomics-validated

## the review

i compared implemented output character-by-character against vision.md planned design.

### source comparison

**vision.md:31-33 (planned):**
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**emitSelfDepWarn.ts:15-17 (implemented):**
```ts
`⚠️ warn: omit self-dependency ${input.packageName}@${input.declaredVersion}\n` +
`   ├─ a package should not depend on itself\n` +
`   └─ if intentional, use link:. or file:. to self-reference`
```

**emitSelfDepWarn.test.ts.snap (actual output):**
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

### character-by-character verification

| line | vision.md | implementation | snapshot | match? |
|------|-----------|----------------|----------|--------|
| 1 | `⚠️ warn: omit self-dependency sql-dao-generator@0.22.0` | template with `${packageName}@${declaredVersion}` | `⚠️ warn: omit self-dependency sql-dao-generator@0.22.0` | exact |
| 2 | `   ├─ a package should not depend on itself` | literal string | `   ├─ a package should not depend on itself` | exact |
| 3 | `   └─ if intentional, use link:. or file:. to self-reference` | literal string | `   └─ if intentional, use link:. or file:. to self-reference` | exact |

### indentation verification

| element | expected | actual |
|---------|----------|--------|
| line 1 indent | 0 spaces | 0 spaces |
| line 2 indent | 3 spaces | 3 spaces |
| line 3 indent | 3 spaces | 3 spaces |
| box-draw char | `├─` and `└─` | `├─` and `└─` |

### color verification

vision.md did not specify color. implementation uses `chalk.yellow` (emitSelfDepWarn.ts:14). snapshot shows ANSI `[33m` (yellow). this is consistent with ergonomist brief rule.require.treestruct-output which shows warns use tree format.

### preserved warn verification

vision.md mentioned preserve behavior at edgecases table but did not spec output format. implementation added consistent format:

```
⚠️ warn: preserve self-dependency sql-dao-generator
   ├─ extant self-ref was preserved
   └─ practice declared version was skipped
```

this follows same treestruct pattern as omitted warn — consistent extension.

### why it holds

1. **line 1 exact match** — `⚠️ warn: omit self-dependency {name}@{version}` matches vision character-by-character
2. **line 2 exact match** — `   ├─ a package should not depend on itself` matches vision
3. **line 3 exact match** — `   └─ if intentional, use link:. or file:. to self-reference` matches vision
4. **indentation exact** — 3 spaces before box-draw, as designed
5. **color natural addition** — yellow for warn is standard, not spec'd but appropriate
6. **preserved warn consistent** — follows same pattern, fills gap in vision

## conclusion

ergonomics validated with character-level precision. the implemented output matches vision.md exactly for the omitted warn case. the preserved warn case follows the same pattern, which is a consistent extension. no drift detected.

