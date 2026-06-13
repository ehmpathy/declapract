# handoff: declapract-typescript-ehmpathy

## contract change in declapract

declapract now enforces strict package exports. internal paths are no longer accessible.

```json
"exports": {
  ".": "./dist/contract/index.js"
}
```

## what this means

any import that reaches inside the package will fail:

```ts
// FORBIDDEN - will error with ERR_PACKAGE_PATH_NOT_EXPORTED
import { ... } from 'declapract/dist/domain';
import { ... } from 'declapract/dist/domain.objects';
import { ... } from 'declapract/dist/utils/...';

// ALLOWED - public api only
import { ... } from 'declapract';
```

## required action

1. **audit all imports** from `declapract` in declapract-typescript-ehmpathy
2. **eliminate any path that reaches inside the package** (e.g., `declapract/dist/...`)
3. **use only the public entry point**: `import { ... } from 'declapract'`

## known violations

```
declapract-typescript-ehmpathy@0.45.3
  - dist/practices/format/best-practice/package.json.declapract.ts
    imports: 'declapract/dist/domain'
```

## pattern forward

packages should only export via explicit `exports` field:

```json
"exports": {
  ".": "./dist/contract/index.js"
}
```

consumers must only import from the public entry point. reach inside packages is forbidden.

## error users will see

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './dist/domain' is not defined by "exports" in .../declapract/package.json
```

fix: upgrade declapract-typescript-ehmpathy to a version that uses public api only.
