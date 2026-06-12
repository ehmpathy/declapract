# self-review: has-complete-hazard-scan

## question

what else was missed? any other real backward compat hazards?

## answer

after re-scanning git diff, found two additional hazards that were missed:

## additional hazards found

### 1. tsconfig.json module change (CRITICAL)
- **module** changed from `commonjs` to `node16`
- **moduleResolution** changed from `node` to `node16`
- this is a significant change that affects how TypeScript resolves imports
- may require `.js` extensions in imports for ESM compatibility
- verify: `npm run build:compile`

### 2. test.yml OIDC permissions
- added `id-token: write` permission for OIDC authentication
- added `secrets: inherit` for keyrack firewall
- this changes how CI authenticates to AWS
- verify: run CI pipeline

## why these were initially missed

1. tsconfig.json - focused on jest and biome configs, overlooked compiler config
2. test.yml - focused on test command changes, not workflow permissions

## verification updated

1. run lint:cycles to check for circular dependencies
2. run build:compile to verify module resolution works
3. run unit tests
4. run integration tests
5. verify CI pipeline works with new OIDC permissions
