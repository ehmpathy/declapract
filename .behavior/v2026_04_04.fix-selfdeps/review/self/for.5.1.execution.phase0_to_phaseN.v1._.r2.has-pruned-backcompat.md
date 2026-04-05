# self-review r2: has-pruned-backcompat

## the review

i reviewed each modified file for backwards-compat code.

### file: check.minVersion.ts

**change**: extended `isLinkedDependencyVersion` to recognize `file:` alongside `link:`

**backwards-compat concern?** no.

**why it holds**: the `file:` protocol is the sister of `link:`. both are used for local development. the wish explicitly mentions "if not already `link:.` or `file:.`". the `file:` support is prescribed, not assumed.

the old behavior (only `link:`) still works. `file:` is additive.

### file: checkContainsJSON.ts

**change**: added optional `targetPackageName` parameter to enable self-dep filter

**backwards-compat concern?** no.

**why it holds**: the parameter is optional with a default that preserves old behavior. when `targetPackageName` is undefined or null, the filter is not applied. extant callers pass no third argument and get the same behavior as before.

### file: containsCheck.ts

**change**: reads root package.json to get target package name, passes to checkContainsJSON

**backwards-compat concern?** no.

**why it holds**: this is internal orchestration. the public contract (FileCheckContext, FileFixFunction) is unchanged. the behavior is additive — self-dep detection only activates when the file is package.json AND the root package.json has a name field.

### file: fixContainsJSONByReplacingAndAddingKeyValues.ts

**change**: reads root package.json, calls processSelfDepsForFix to omit/preserve self-deps

**backwards-compat concern?** no.

**why it holds**: same rationale as containsCheck.ts. the public FileFixFunction contract is unchanged. behavior is additive — only activates for package.json files.

## conclusion

no backwards-compat hacks. all changes are additive. old behavior preserved when new code paths don't activate.

no open questions for wisher — the `file:` support was explicitly requested in the wish/vision.
