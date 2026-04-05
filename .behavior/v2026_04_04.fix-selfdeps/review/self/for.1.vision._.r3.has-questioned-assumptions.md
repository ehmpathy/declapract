# self-review r3: has-questioned-assumptions (deepest)

fresh eyes. what assumptions did i embed as fact?

---

## assumptions i embedded as fact

### 16. the warn message format

**what i wrote**:
```
⚠️ warn: omit self-dependency sql-dao-generator@0.22.0
   → a package cannot depend on itself
   → if intentional, use link:. or file:. to self-reference
```

**did wisher specify this?** no. wisher said "logged as a warn" — not what the warn says.

**what i assumed**:
- emoji prefix `⚠️`
- specific words "omit self-dependency"
- the claim "a package cannot depend on itself" — technically FALSE. npm allows it, just causes problems.
- the hint about `link:.` or `file:.`

**is this an issue?**

the exact message is UX detail, not architecture. but "cannot" is wrong — should be "should not".

**how i'll fix**: update the example message to say "should not" instead of "cannot".

---

### 17. "dependencies" only, or all dep types?

**what i wrote**: question #3 asks about devDependencies

**what i missed**: optionalDependencies, peerDependencies, bundledDependencies

**did wisher specify?** no. wisher said "a dep" generically.

**what if opposite?**
- peerDependencies: can a package peer-dep on itself? actually... no, this would be weird. same issue.
- optionalDependencies: same issue.
- bundledDependencies: this is a list of package names to bundle, not version specs. different beast.

**is this an issue?**

yes — should explicitly list ALL dep types covered. bundledDependencies is special (just names, no versions).

**how i'll fix**: update question #3 to be comprehensive.

---

### 18. workspace protocol `workspace:*`

**what i wrote**: only `link:.` and `file:.` are intentional self-refs

**did wisher specify?** yes — "link:. or file:."

**what about workspace:*?**
- `workspace:*` is for monorepo inter-package refs (different packages)
- a package wouldn't use `workspace:*` to reference itself — that's for siblings
- self-reference in monorepo would still be `link:.`

**is this an issue?**

no — workspace protocol is for cross-package refs, not self-refs. the wisher was right to exclude it.

**verdict: HOLDS** ✓

---

### 19. plan output specificity

**what i wrote**: "declapract plan — shows proposed changes, warns about omitted self-deps"

**did i specify HOW the plan shows this?**

no. options:
- self-dep appears as "will omit" explicitly
- self-dep just doesn't appear (implicit omission)
- self-dep appears with "(self-dep, will skip)" annotation

**is this an issue?**

UX detail, but worth capture. users should see clearly what will happen.

**how i'll fix**: add note that plan output should explicitly show omitted self-deps, not silently hide them.

---

### 20. which package.json `name` do we use?

**what i wrote**: assumption #2 says "package.json `name` field is authoritative"

**but which package.json?**

in monorepo:
```
my-monorepo/
  package.json (name: "my-monorepo")
  packages/
    foo/
      package.json (name: "@org/foo")
```

if we modify `packages/foo/package.json`, which name do we compare against?

**answer should be**: the `name` from the package.json we modify.

**is this clear in the vision?**

no — assumption #2 is ambiguous.

**how i'll fix**: clarify assumption #2 to specify "the `name` field of the package.json under modification".

---

## changes made to vision

| issue | fix applied |
|-------|-------------|
| "cannot" is technically wrong | changed to "should not" in example warn message ✓ |
| dep types incomplete | expanded question #3 to cover all dep types (dependencies, devDependencies, peerDependencies, optionalDependencies; noted bundledDependencies is separate) ✓ |
| which package.json | clarified assumption #2 to specify "the package.json under modification" ✓ |
| plan output visibility | updated timeline to say "explicitly shows omitted self-deps (not silently hidden)" ✓ |

---

## non-issues: why they hold

| assumption | why it holds |
|------------|--------------|
| workspace protocol excluded | workspace:* is for cross-package refs, not self-refs; wisher correctly excluded |
| warn format (general) | wisher specified "warn", format is UX detail that can evolve |
