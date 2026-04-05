# self-review r10: has-behavior-declaration-adherance

review blueprint adherence to behavior declaration (does it match what the spec says?).

---

## adherence verification method

for each blueprint decision, check:
1. does it match what vision describes?
2. does it satisfy criteria correctly (not just cover it)?
3. any deviations or misinterpretations?

---

## warn format adherence

**vision specifies**:
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   ├─ a package should not depend on itself
   └─ if intentional, use link:. or file:. to self-reference
```

**blueprint specifies**:
```
emitSelfDepWarn
├─
│
│  ⚠️ warn: omit self-dependency {packageName}@{version}
│     ├─ a package should not depend on itself
│     └─ if intentional, use link:. or file:. to self-reference
│
└─
```

**check**: exact match? ✓ yes — blueprint uses vision format verbatim

**verdict**: ✓ adheres

---

## check phase behavior adherence

**vision question #4 option C**: "check passes with note, fix omits with warn"

**blueprint specifies**:
- checkContainsJSON: if self-dep, return null (pass)
- fixContainsJSON*: if self-dep, omit and warn

**check**: matches option C? ✓ yes

**note**: vision says "with note" for check phase — blueprint says "return null". is this a deviation?

**analysis**: return null means "no failure reason" which is a pass. the "note" in vision may mean the warn in fix phase, not a separate note in check phase. the criteria doesn't require a note in check phase, only that check passes.

**verdict**: ✓ adheres — pass behavior matches, no explicit "note" required in check phase

---

## preserve vs omit logic adherence

**vision says**:
- if self-dep detected and NOT already link:./file:.: omit and warn
- if self-dep detected and already link:./file:.: preserve and warn

**blueprint specifies**:
- isSelfDependency → check if self-dep
- if true AND value is version string → omit + warn
- if true AND extant value is link:./file:. → preserve + warn

**check**: logic matches? ✓ yes

**note**: blueprint says "extant value" but what if practice declares version AND extant is link:.? vision edgecase says "preserve link:., warn". blueprint must check extant, not declared.

**verification**: blueprint codepath tree says:
> "if true AND extant value is link:./file:.: preserve extant value"

**verdict**: ✓ adheres — checks extant value, not declared value

---

## scoped package adherence

**vision says**: scoped packages like `@org/pkg` should be detected

**blueprint specifies**: "exact string compare (scoped packages included)"

**check**: is exact string compare sufficient for scoped packages?

**analysis**: yes — `@ehmpathy/sql-dao-generator === @ehmpathy/sql-dao-generator` works with simple `===`

**verdict**: ✓ adheres

---

## no-name-field adherence

**vision says**: "skip self-dep check, proceed normally"

**blueprint specifies**: "if packageName is null → false (skip detection)"

**check**: skip detection means proceed normally? ✓ yes

**verdict**: ✓ adheres

---

## all dependency types adherence

**criteria says**: dependencies, devDependencies, peerDependencies, optionalDependencies

**blueprint specifies**: "at dependency value assignment" — generic approach

**check**: does fixContainsJSON* handle all dep types?

**analysis**: yes — it processes JSON keys generically. any `*Dependencies` key with package entries will be checked.

**verdict**: ✓ adheres

---

## direct-only adherence

**criteria says**: only direct self-deps, not transitive

**blueprint specifies**: "isSelfDependency compares names only"

**check**: does this prevent transitive detection?

**analysis**: yes — no dependency resolution. only compares declared dep key against package.json name.

**verdict**: ✓ adheres

---

## deviations found

none.

---

## summary

| aspect | vision/criteria says | blueprint does | adheres? |
|--------|---------------------|----------------|----------|
| warn format | box-draw treestruct | exact match | ✓ |
| check phase | pass for self-deps | return null | ✓ |
| omit logic | omit version self-deps | skip assignment | ✓ |
| preserve logic | preserve extant link:./file:. | check extant value | ✓ |
| scoped packages | detect @org/pkg | exact string compare | ✓ |
| no name field | skip, proceed | return false | ✓ |
| all dep types | generic | key-agnostic | ✓ |
| direct only | no transitive | name compare only | ✓ |

**result**: blueprint adheres to behavior declaration. no deviations or misinterpretations found.
