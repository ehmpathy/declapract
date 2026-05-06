# self-review: has-zero-deferrals (r2)

## deeper review — what was missed in r1

r1 checked for explicit deferral markers. r2 examines the vision more carefully for any implicit requirements that may have been missed.

---

## vision re-read with fresh eyes

### the outcome world section

**vision stated (before → after):**

before:
```typescript
productionApprovers: '["uladkasach", "caseybrookes"]',  // workaround
reviewers: { users: JSON.parse('@declapract{variable.productionApprovers}'), ... }
```

after:
```typescript
productionApprovers: ['uladkasach', 'caseybrookes'],  // natural syntax
reviewers: { users: @declapract{variable.productionApprovers}, ... }

// output
reviewers: { users: ["uladkasach", "caseybrookes"], ... }
```

**implicit requirement:** the output should be `["uladkasach", "caseybrookes"]` — JSON array syntax with double quotes.

**blueprint addresses:** yes — `JSON.stringify()` produces exactly this output.

---

### usecases section

**vision listed:**
| usecase | goal |
|---------|------|
| github repo provision | declare branch protection reviewers as variable |
| ci/cd pipelines | declare allowed deploy targets as variable |
| config files | declare feature flags, allowed origins, trusted domains |
| package.json | declare workspaces, keywords, files arrays |

**implicit requirement:** support for all these usecases.

**blueprint addresses:** yes — all usecases are arrays of strings. the blueprint supports string arrays. no usecase requires nested objects inside arrays or other complex types not covered by `JSON.stringify()`.

---

### contract section

**vision stated:**

```yaml
# declapract.use.yml
productionApprovers:
  - uladkasach
  - caseybrookes
allowedOrigins:
  - https://example.com
  - https://api.example.com
```

**implicit requirement:** yaml list syntax works.

**blueprint addresses:** yes — research confirmed yaml parser already converts lists to JS arrays. blueprint does not need to change yaml parser.

---

### edgecases section

**vision stated:**

| edgecase | behavior |
|----------|----------|
| empty array `[]` | outputs `[]` |
| array with one item | outputs `["item"]` |
| array of numbers | outputs `[1, 2, 3]` |
| array of objects | outputs `[{"a": 1}]` |
| nested array | outputs `[[1, 2], [3, 4]]` |
| null/undefined in array | outputs `[null, null]` |

**implicit requirement:** all these edgecases should work.

**blueprint addresses:** yes — `JSON.stringify()` handles all these correctly. blueprint notes "pit of success: JSON.stringify handles all these correctly."

**are these tested?** blueprint marks edge case tests as "optional". but the vision states "pit of success" — this indicates they should work, not that they must be tested.

**is this a deferral?** no. the vision does not mandate tests for each edgecase. the vision trusts `JSON.stringify()` behavior. the primary test case covers the core functionality.

---

### what works vs what's broken section

**vision stated:**

| layer | problem | fix |
|-------|---------|-----|
| `flatten()` call | destroys arrays | add `{ safe: true }` |
| replacement logic | no array treatment | detect via `Array.isArray()`, use `JSON.stringify()` |

**blueprint addresses:** yes — both fixes included in codepath tree and implementation details.

---

### assumptions section

**vision stated:**
1. JSON array syntax is acceptable output (double quotes, not single)
2. no need for special array access syntax (e.g., `variable.approvers[0]`)

**blueprint addresses:**
1. yes — blueprint uses `JSON.stringify()` which produces double quotes
2. yes — blueprint does not implement array access syntax (not required)

---

### design decisions section

**vision stated:**
1. empty arrays should output `[]`, not error
2. nested objects inside arrays are valid

**blueprint addresses:**
1. yes — `JSON.stringify([])` outputs `[]`
2. yes — `JSON.stringify([{a:1}])` outputs `[{"a":1}]`

---

## no deferrals found

after careful re-read of the vision:

| vision item | addressed in blueprint | deferred |
|-------------|------------------------|----------|
| `{ safe: true }` fix | yes — codepath tree | no |
| `Array.isArray()` + `JSON.stringify()` | yes — codepath tree | no |
| yaml list syntax | yes — already works | no |
| all usecases (github, ci/cd, config, package.json) | yes — all are string arrays | no |
| all edgecases | yes — JSON.stringify covers | no |
| backwards compatible | yes — section in blueprint | no |
| double quote output | yes — JSON.stringify | no |
| no array access syntax | yes — not implemented | no |
| empty array → `[]` | yes — JSON.stringify | no |
| nested objects in arrays | yes — JSON.stringify | no |
| test coverage | yes — primary test case | no |

**why this holds:** every item from the vision either has explicit implementation in the blueprint, or is handled by a library feature (JSON.stringify, yaml parser) that the vision trusted. no vision items were marked deferred, skipped, or left to future work.

the only "optional" items are additional edge case tests beyond the primary test case — these are nice-to-haves we added, not vision requirements.

---

## conclusion

**zero vision items deferred.** all requirements addressed.
