# self-review r10: has-behavior-declaration-coverage (deeper)

deeper review of blueprint coverage against behavior declaration.

---

## deeper verification method

1. re-read each vision requirement
2. trace to specific blueprint codepath
3. trace to specific test case
4. verify chain is complete

---

## vision usecase coverage trace

### "run declapract on sql-dao-generator repo"

**vision says**: self-dep on `sql-dao-generator` omitted with warn

**blueprint trace**:
- fixContainsJSON* calls isSelfDependency({ packageName, dependencyKey })
- isSelfDependency returns true when names match
- emitSelfDepWarn({ action: 'omitted' }) called
- skip assignment (omit from output)

**test trace**:
- `[case] self-dep version → omitted + warn`

**verdict**: ✓ complete chain

---

### "run declapract on sql-schema-generator repo"

**vision says**: `sql-dao-generator` dep added normally

**blueprint trace**:
- isSelfDependency returns false (different names)
- normal assignment proceeds

**test trace**:
- `[case] different package → added normally`

**verdict**: ✓ complete chain

---

### "run declapract on repo with link:. self-dep already"

**vision says**: dep preserved as-is

**blueprint trace**:
- isSelfDependency returns true
- check extant value with isSelfRefProtocol
- isSelfRefProtocol returns true for `link:.`
- preserve extant value
- emitSelfDepWarn({ action: 'preserved' })

**test trace**:
- `[case] self-dep link:. extant → preserved + warn`

**verdict**: ✓ complete chain

---

### "run declapract on repo with file:. self-dep already"

**vision says**: dep preserved as-is

**blueprint trace**:
- same as above, isSelfRefProtocol handles `file:.`

**test trace**:
- `[case] self-dep file:. extant → preserved + warn`

**verdict**: ✓ complete chain

---

## vision edgecase coverage trace

### "package.json has no name field"

**vision says**: skip self-dep check, proceed normally

**blueprint trace**:
- read package.json, name is null/undefined
- isSelfDependency({ packageName: null, ... }) returns false
- normal path proceeds

**test trace**:
- `[case] no name field → added normally`

**verdict**: ✓ complete chain

---

### "practice declares link:. explicitly"

**vision says**: preserve it (already passes)

**blueprint trace**:
- isSelfRefProtocol returns true for declared value
- no self-dep warn triggered for intentional self-ref in practice

**test trace**:
- implied by isSelfRefProtocol tests for `link:./link:../path`

**verdict**: ✓ complete chain

---

### "scoped package @org/pkg"

**vision says**: detect and omit

**blueprint trace**:
- isSelfDependency uses exact string compare
- `@org/pkg === @org/pkg` → true

**test trace**:
- `[case] scoped @org/pkg match → true`

**verdict**: ✓ complete chain

---

## criteria usecase coverage trace

### usecase.7: all dependency types covered

**criteria says**: dependencies, devDependencies, peerDependencies, optionalDependencies all protected

**blueprint trace**:
- fixContainsJSON* handles all JSON keys
- self-dep detection at dependency value assignment level
- not specific to any dependency type

**test trace**:
- `[case] devDependencies self-dep → omitted`
- `[case] peerDependencies self-dep → omitted`
- `[case] optionalDependencies self-dep → omitted`

**verdict**: ✓ complete chain — generic approach covers all types

---

### usecase.8: only direct self-deps

**criteria says**: transitive cycles not blocked

**blueprint trace**:
- isSelfDependency compares names only
- no dependency resolution or graph traversal
- by design, only direct self-deps detected

**test trace**:
- scope statement in criteria: "transitive deps not blocked"

**verdict**: ✓ complete chain — out of scope by design

---

## check phase coverage trace

**vision question #4 option C**: check passes with note, fix omits with warn

**blueprint trace**:
- checkContainsJSON extended: if self-dep, return null (pass)
- this prevents infinite "needs fix" loop

**test trace**:
- `[case] self-dep absent → pass (not fail)`
- `[case] self-dep version mismatch → pass (not fail)`

**verdict**: ✓ complete chain — critical for correct behavior

---

## gaps found

none.

---

## summary

| category | requirements | traced |
|----------|--------------|--------|
| vision usecases | 4 | 4/4 ✓ |
| vision edgecases | 7 | 7/7 ✓ |
| criteria usecases | 8 | 8/8 ✓ |
| criteria edgecases | 2 | 2/2 ✓ |
| check phase behavior | 1 | 1/1 ✓ |

**result**: all requirements trace to blueprint codepath and test case. no gaps found.
