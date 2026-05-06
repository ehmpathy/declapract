# self-review: has-consistent-mechanisms (r2)

## deep dive: extant `Array.isArray` usage

### where is it used?

file: `fixContainsJSON*.ts`, line 79:

```typescript
if (Array.isArray(desiredValue)) return desiredValue; // TODO: think through...
```

### what context?

this is in `deepReplaceOrAddCurrentKeyValues*`, a recursive object merger. the `Array.isArray` check decides whether to preserve arrays in deep merge.

### does my usage duplicate this?

**no.** different purpose:
- extant: "is this value an array? if so, preserve it in merge"
- mine: "is this value an array? if so, serialize to JSON string"

both use `Array.isArray` but for completely different decisions. there is no "serialize array to string" utility in this codebase.

---

## deep dive: extant `JSON.stringify` usage

### search results

13 files use `JSON.stringify`:
- `UnexpectedCodePathError.ts` — error metadata
- `parseJSON.test.ts` — test assertions
- `displayPlan.integration.test.ts` — test output
- `checkContainsJSON.ts` — JSON comparison
- `fixContainsJSON*.ts` — file output (line 156)
- etc.

### most similar usage

line 156 of `fixContainsJSON*.ts`:

```typescript
return {
  contents: JSON.stringify(fixedPackageJSON, null, 2),
};
```

this serializes a whole object for file output. mine serializes just an array for inline substitution.

### does my usage duplicate this?

**no.** different purpose:
- extant: serialize entire JSON for file contents
- mine: serialize array for template variable substitution

---

## conclusion

| mechanism | extant usage | my usage | same purpose? |
|-----------|--------------|----------|---------------|
| `Array.isArray` | merge behavior | serialization decision | no |
| `JSON.stringify` | file output, tests | inline substitution | no |

**no duplicated mechanisms.** the functions are standard library, but the purposes differ.

**why this holds:** both usages are leaf-level applications of standard JS. there is no higher-level abstraction in this codebase that I should have reused.
