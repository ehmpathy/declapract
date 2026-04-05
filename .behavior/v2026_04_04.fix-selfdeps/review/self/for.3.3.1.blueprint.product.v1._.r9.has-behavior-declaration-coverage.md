# self-review r9: has-behavior-declaration-coverage

review blueprint coverage of vision and criteria requirements.

---

## vision requirements coverage

### vision usecases table

| vision usecase | blueprint coverage |
|----------------|-------------------|
| run declapract on `sql-dao-generator` repo | ✓ fixContainsJSON detects self-dep, omits with warn |
| run declapract on `sql-schema-generator` repo | ✓ isSelfDependency returns false, proceeds normally |
| run declapract on repo with `link:.` self-dep already | ✓ isSelfRefProtocol detects, preserves extant |
| run declapract on repo with `file:.` self-dep already | ✓ isSelfRefProtocol detects, preserves extant |

### vision warn format

**vision specifies**:
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**blueprint specifies**: emitSelfDepWarn with same format ✓

### vision edgecases table

| vision edgecase | blueprint coverage |
|-----------------|-------------------|
| package.json has no `name` field | ✓ isSelfDependency returns false when packageName is null |
| practice declares `link:.` explicitly | ✓ isSelfRefProtocol returns true, no omit |
| practice declares `file:.` explicitly | ✓ isSelfRefProtocol returns true, no omit |
| scoped package `@org/pkg` in `@org/pkg` repo | ✓ exact string compare handles scoped packages |
| dep already present as regular version | ✓ omit the fix, warn |
| extant `link:.` but practice declares version | ✓ preserve `link:.`, warn |
| extant `file:.` but practice declares version | ✓ preserve `file:.`, warn |

---

## criteria requirements coverage

### criteria usecase.1: self-dep omitted with warn

| requirement | blueprint coverage |
|-------------|-------------------|
| plan output shows self-dep as "omitted" | ✓ emitSelfDepWarn action='omitted' |
| plan output includes warn with explanation | ✓ treestruct format with explanation |
| apply: self-dep NOT added to package.json | ✓ skip assignment in fixContainsJSON |
| apply: warn emitted in treestruct format | ✓ emitSelfDepWarn |
| apply: other fixes proceed normally | ✓ only self-dep path is modified |

### criteria usecase.2: different package proceeds normally

| requirement | blueprint coverage |
|-------------|-------------------|
| dep added to package.json | ✓ isSelfDependency returns false, normal path |
| no self-dep warn emitted | ✓ emitSelfDepWarn not called when not self-dep |

### criteria usecase.3: extant link:. preserved

| requirement | blueprint coverage |
|-------------|-------------------|
| check passes | ✓ checkContainsJSON returns null for self-dep |
| extant `link:.` preserved | ✓ preserve extant when isSelfRefProtocol returns true |
| warn emitted: extant self-ref was preserved | ✓ emitSelfDepWarn action='preserved' |

### criteria usecase.4: extant file:. preserved

| requirement | blueprint coverage |
|-------------|-------------------|
| extant `file:.` preserved | ✓ isSelfRefProtocol handles file: |
| warn emitted | ✓ emitSelfDepWarn action='preserved' |

### criteria usecase.5: scoped package self-dep

| requirement | blueprint coverage |
|-------------|-------------------|
| self-dep omitted with warn | ✓ exact string compare handles @scope/name |

### criteria usecase.6: no package name (skip detection)

| requirement | blueprint coverage |
|-------------|-------------------|
| dependency added normally | ✓ isSelfDependency returns false when name is null |
| no self-dep check occurs | ✓ early return when packageName is null |

### criteria usecase.7: all dependency types covered

| requirement | blueprint coverage |
|-------------|-------------------|
| dependencies self-dep omitted | ✓ test case declared |
| devDependencies self-dep omitted | ✓ test case declared |
| peerDependencies self-dep omitted | ✓ test case declared |
| optionalDependencies self-dep omitted | ✓ test case declared |

### criteria usecase.8: only direct self-deps

| requirement | blueprint coverage |
|-------------|-------------------|
| transitive deps not blocked | ✓ scope states direct only |
| no warn for pkg-b that depends on pkg-a | ✓ isSelfDependency only compares names |

### criteria edgecase.1: self-dep already present as version

| requirement | blueprint coverage |
|-------------|-------------------|
| fix omitted | ✓ skip assignment for self-dep |
| warn emitted | ✓ emitSelfDepWarn |

### criteria edgecase.2: practice declares link:. explicitly

| requirement | blueprint coverage |
|-------------|-------------------|
| link:. added as declared | ✓ isSelfRefProtocol allows link:. through |
| no self-dep warn emitted | ✓ no warn for intentional self-ref in practice |

---

## gaps found

none.

---

## summary

| source | requirements | covered |
|--------|--------------|---------|
| vision usecases | 4 | 4/4 ✓ |
| vision edgecases | 7 | 7/7 ✓ |
| criteria usecases | 8 | 8/8 ✓ |
| criteria edgecases | 2 | 2/2 ✓ |

**result**: all vision and criteria requirements are covered in the blueprint.
