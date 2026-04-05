# self-review r3: has-consistent-mechanisms

## found issue

**duplication**: `isSelfRefProtocol.ts` duplicated `isLinkedDependencyVersion` from check.minVersion.ts

both performed identical logic:
```ts
value.startsWith('link:') || value.startsWith('file:')
```

## fix applied

1. removed `isSelfRefProtocol.ts` and its test
2. updated `processSelfDepsForFix.ts` to import and use `isLinkedDependencyVersion` instead

**before**:
```ts
import { isSelfRefProtocol } from './isSelfRefProtocol';
// ...
if (isSelfRefProtocol({ value: extantValue })) {
```

**after**:
```ts
import { isLinkedDependencyVersion } from '@src/.../check.minVersion';
// ...
if (isLinkedDependencyVersion({ value: extantValue })) {
```

## verification

- `npm run test:types` — passed
- `npm run test:unit` — 204 passed (8 tests removed with deleted file)

## other mechanisms reviewed (no issues)

### isSelfDependency.ts

**search**: `grep -r 'packageName.*===' src/` and `grep -r 'name.*===.*name' src/`

**result**: no hits except my new file. the codebase has no utility that compares a dependency key against the package's own name.

**why it holds**: this is a new domain concept. declapract previously had no need to ask "is this dependency the same package as the one we're in?" — the self-dep footgun was unaddressed. no extant mechanism to consolidate with.

### emitSelfDepWarn.ts

**search**: `grep -r 'console\.(log|warn)' src/` — found 16 files

**analysis**: extant console.log usage is inline and unstructured. examples:
- `console.log('');` (blank lines for formatting)
- `console.log(\`...\`)` (ad-hoc messages)

no extant warn emitter encapsulates a specific warn format with treestruct box-draw characters. each log is written inline at point of use.

**why it holds**: emitSelfDepWarn follows the extant pattern (inline console.log) but encapsulates the self-dep warn format for reuse across check and fix phases. it does not duplicate an extant abstraction — it creates a new one for the new domain concept.

**alternative considered**: could i have just inlined the console.log? yes, but the warn format is used in two places (omit + preserve) with identical structure. extracting to a function follows rule.prefer.wet-over-dry threshold of 2+ usages.

### filterSelfDepsFromDeclared.ts

**search**: `grep -r 'filter.*[dD]ep' src/` — found only my new files

**analysis**: the codebase has no utility that filters dependencies from a declared JSON object. extant code paths:
- checkContainsJSON: checks key presence, does not filter
- fixContainsJSONByReplacingAndAddingKeyValues: merges declared into found, does not filter

**why it holds**: this is a new domain concept — remove self-deps from declared JSON before comparison in check phase. no extant filter mechanism to reuse.

### processSelfDepsForFix.ts

**search**: `grep -r 'process.*[dD]ep' src/` and `grep -r 'omit.*[dD]ep' src/` — no hits except my files

**analysis**: the codebase has no utility that selectively omits or preserves dependencies based on conditions. extant fix logic in deepReplaceOrAddCurrentKeyValuesWithDesiredKeyValues does unconditional merge.

**why it holds**: this is a new domain concept — conditionally omit self-deps (if version) or preserve (if link:./file:.) in fix phase. no extant mechanism to consolidate with.

## lesson

always search for extant utilities before you create new ones. the codebase already had `isLinkedDependencyVersion` which served the exact purpose needed.
