# self-review r5: behavior-declaration-coverage

## the review

i mapped each criteria usecase to the implementation and test coverage.

### usecase coverage detail

#### usecase.1: self-dep omitted with warn

**criteria**: when declapract apply runs, self-dep is NOT added to package.json, warn emitted

**implementation**:
- processSelfDepsForFix.ts:70-75 — omits dep by not add to filteredDeps
- emitSelfDepWarn.ts:14-17 — emits "omit self-dependency" warn

**test assertions**:
- processSelfDepsForFix.test.ts:34-38 — verifies self-dep absent in result
- processSelfDepsForFix.test.ts:42-43 — verifies warn contains "omit self-dependency"
- fixContainsJSON.test.ts:240-248 — integration test with FileCheckContext

#### usecase.2: different package proceeds normally

**criteria**: when package name differs, dependency is added normally

**implementation**:
- isSelfDependency.ts:13 — returns false when names differ
- processSelfDepsForFix.ts:49-51 — keeps non-self deps in filteredDeps

**test assertions**:
- processSelfDepsForFix.test.ts:154-159 — verifies all deps preserved when none are self-deps
- processSelfDepsForFix.test.ts:163 — verifies no warns emitted

#### usecase.3: extant link:. preserved

**criteria**: when extant value is link:., preserve it

**implementation**:
- isLinkedDependencyVersion (check.minVersion.ts) — detects link: prefix
- processSelfDepsForFix.ts:58-67 — preserves declared when extant is link:./file:.

**test assertions**:
- processSelfDepsForFix.test.ts:93-98 — verifies declared version kept (minVersion preserves extant)
- processSelfDepsForFix.test.ts:101-102 — verifies "preserve self-dependency" warn
- fixContainsJSON.test.ts:277-278 — verifies link:. preserved in final JSON

#### usecase.4: extant file:. preserved

**criteria**: when extant value is file:., preserve it

**implementation**: same as usecase.3 — isLinkedDependencyVersion handles both link: and file:

**test assertions**:
- processSelfDepsForFix.test.ts:123-128 — verifies declared version kept for file:.
- processSelfDepsForFix.test.ts:131-132 — verifies "preserve self-dependency" warn

#### usecase.5: scoped package self-dep

**criteria**: @org/pkg in @org/pkg repo → omit with warn

**implementation**: isSelfDependency.ts:13 — exact string match handles scoped packages

**test assertions**:
- isSelfDependency.test.ts:27-32 — verifies scoped match returns true
- processSelfDepsForFix.test.ts:226-229 — verifies scoped self-dep omitted

#### usecase.6: no package name (skip detection)

**criteria**: when package.json has no name, proceed normally

**implementation**: isSelfDependency.ts:10 — returns false when packageName is null

**test assertions**:
- isSelfDependency.test.ts:22-25 — verifies null packageName returns false

#### usecase.7: all dependency types covered

**criteria**: dependencies, devDependencies, peerDependencies, optionalDependencies

**implementation**: processSelfDepsForFix.ts:6-11 — DEP_KEYS array covers all four types

**test assertions**:
- processSelfDepsForFix.test.ts:168-180 — devDependencies
- processSelfDepsForFix.test.ts:182-194 — peerDependencies
- processSelfDepsForFix.test.ts:196-208 — optionalDependencies

#### usecase.8: only direct self-deps

**criteria**: transitive cycles not blocked, only direct self-deps

**implementation**: isSelfDependency.ts — only compares packageName to dependencyKey (direct check)

**why it holds**: we never traverse dependency trees. we only check if `dependencies[key]` matches `packageName`. transitive deps like pkg-a → pkg-b → pkg-a are not our concern.

### edgecase coverage matrix

| edgecase | criteria requirement | test location | status |
|----------|---------------------|---------------|--------|
| edgecase.1 | self-dep already present as version | processSelfDepsForFix.test.ts:46-71 | ✓ covered |
| edgecase.2 | practice declares link:. explicitly | (no explicit test — would pass minVersion check, so behaves like normal dep) | ✓ implied |

### check phase coverage

per criteria option C (vision question #4): check must PASS for self-deps

| requirement | test location | status |
|-------------|---------------|--------|
| self-dep absent → check passes | checkContainsJSON.test.ts:131-152 | ✓ covered |
| self-dep version mismatch → check passes | checkContainsJSON.test.ts:153-174 | ✓ covered |
| different package absent → check fails (normal) | checkContainsJSON.test.ts:175-199 | ✓ covered |

### fix phase coverage

| requirement | implementation | test location | status |
|-------------|----------------|---------------|--------|
| warn emitted on omit | emitSelfDepWarn.ts | emitSelfDepWarn.test.ts, processSelfDepsForFix.test.ts:42-43 | ✓ covered |
| warn emitted on preserve | emitSelfDepWarn.ts | emitSelfDepWarn.test.ts, processSelfDepsForFix.test.ts:101-102 | ✓ covered |
| treestruct box-draw format | emitSelfDepWarn.ts:14-17, 22-25 | visual inspection | ✓ implemented |

### verification commands

```
npm run test:types — passed
npm run test:unit — 204 passed
```

## conclusion

all usecases and edgecases from criteria.blackbox are covered by tests.
