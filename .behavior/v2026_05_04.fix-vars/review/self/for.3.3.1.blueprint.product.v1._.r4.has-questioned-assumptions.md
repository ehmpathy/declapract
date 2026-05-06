# self-review: has-questioned-assumptions (r4)

## deeper review — what was missed in r3

r3 covered 7 assumptions. let me search for assumptions I may have overlooked.

---

## additional assumptions found

### assumption 8: the regex matches array variable keys

**what we assume:** `/@declapract\{variable.[\w.]+\}/g` matches keys like `productionApprovers`.

**what if opposite?** if the regex failed to match array variable references:
- array variables would be silently ignored
- the feature would not work

**examination:**
```javascript
const regex = /@declapract\{variable.[\w.]+\}/g;
'@declapract{variable.productionApprovers}'.match(regex);
// ["@declapract{variable.productionApprovers}"]
```

the key `productionApprovers` contains only word characters (`\w`). the regex matches.

**verdict:** holds — regex works for array variable keys.

---

### assumption 9: `replaceAll` accepts JSON.stringify output

**what we assume:** the `replaceAll` utility can replace with `JSON.stringify()` output.

**what if opposite?** if `replaceAll` expected a specific string format:
- the substitution might fail or corrupt output

**examination:** from `replaceAll.ts`:
```typescript
export const replaceAll = (
  inString: string,
  matchingString: string,
  toString: string,
) => {
  return inString.replace(
    new RegExp(escapeRegExp(matchingString), 'g'),
    () => toString,
  );
};
```

it accepts any string as `toString`. `JSON.stringify()` returns a string.

**verdict:** holds — replaceAll works with any string.

---

### assumption 10: no circular reference in arrays

**what we assume:** user-provided arrays do not contain circular references.

**what if opposite?** if an array had a circular reference:
```javascript
const arr = [1, 2, 3];
arr.push(arr);
JSON.stringify(arr);
// TypeError: circular structure to JSON
```

**is this a realistic concern?** no — config variables come from yaml files. yaml cannot represent circular references.

**verdict:** holds — yaml source prevents circular references.

---

### assumption 11: flat library version supports `safe` option

**what we assume:** the installed `flat` version has `{ safe: true }`.

**what if opposite?** if an older version lacked this option:
- the option would be ignored
- arrays would still be flattened

**examination:** `safe` option has been in `flat` since v1.x. current version in package.json should be checked.

**action:** verify at execution time that `flat` version supports `safe`.

**verdict:** holds if version is recent — should verify.

---

### assumption 12: performance is acceptable

**what we assume:** `JSON.stringify()` on small arrays is fast enough.

**what if opposite?** if arrays were huge:
- serialization could be slow
- this is a theoretical concern

**is this realistic?** no — config arrays are small (approvers, origins, keywords). typically <100 elements.

**verdict:** holds — config arrays are small by nature.

---

### assumption 13: array key names do not conflict with nested object paths

**what we assume:** `approvers` (array) does not conflict with `approvers.0` (flattened key).

**what if opposite?** if a user had both:
```yaml
approvers:
  - alice
approvers.0: "should not exist"
```

this is nonsensical yaml. the yaml parser would reject it.

**verdict:** holds — yaml prevents such conflicts.

---

### assumption 14: the simpler approach is correct

**question:** could a simpler approach work?

**alternatives considered:**

1. **string concatenation instead of JSON.stringify:**
   ```javascript
   const replacement = Array.isArray(variableValue)
     ? `[${variableValue.map(v => `"${v}"`).join(',')}]`
     : variableValue;
   ```
   problem: does not handle escape. `JSON.stringify()` is simpler and correct.

2. **no type change:**
   problem: TypeScript would error. type change is minimal.

3. **no `{ safe: true }`:**
   problem: arrays would be flattened. this is required.

**verdict:** the blueprint approach is the simplest correct approach.

---

## summary of r4 findings

| assumption | verdict |
|------------|---------|
| regex matches array keys | holds |
| replaceAll accepts JSON string | holds |
| no circular references | holds (yaml source) |
| flat version supports safe | verify at execution |
| performance acceptable | holds |
| no key conflicts | holds (yaml prevents) |
| simplest approach | holds |

**one action item:** verify `flat` version supports `{ safe: true }` at execution time.

**why all assumptions hold:** the design leverages well-specified behavior (JSON.stringify), documented library features (flat safe option), and natural constraints (yaml source). no hidden traps found.
