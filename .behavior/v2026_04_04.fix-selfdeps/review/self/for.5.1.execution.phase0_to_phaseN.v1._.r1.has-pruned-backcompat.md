# self-review: has-pruned-backcompat

## review scope

check for backwards-compat code not explicitly requested.

## assessment

### changes made

1. **check.minVersion.ts** — added `file:` protocol support alongside `link:`
2. **checkContainsJSON.ts** — added optional `targetPackageName` parameter
3. **containsCheck.ts** — added self-dep filter in check phase
4. **fixContainsJSONByReplacingAndAddingKeyValues.ts** — added self-dep process in fix phase

### backwards-compat analysis

| change | backwards-compat concern? | assessment |
|--------|--------------------------|------------|
| `file:` support | no | additive — `link:` still works |
| `targetPackageName` param | no | optional — omit to get old behavior |
| self-dep filter in check | no | additive — only activates for package.json |
| self-dep process in fix | no | additive — only activates for package.json |

### explicit requests from wish/vision

- wish: "if not already `link:.` or `file:.` dep, then omit"
- vision: "extant `link:.`/`file:.` preserved" (usecase.3, usecase.4)

both `link:.` and `file:.` preservation were explicitly requested.

### hacks found

none. no deprecated paths, no re-exports, no shims.

## conclusion

no backwards-compat code beyond what was explicitly requested. all changes are additive and do not break extant callers.
