# fix: glob does not match files in nested hidden directories

## problem

declapract patterns like `.accept.blackbox/**/*.ts` fail to match files inside nested hidden directories such as `.accept.blackbox/.test/assets/file.ts`.

this occurs because the `**` globstar does not traverse into directories that start with `.`, even when `dot: true` is set in fast-glob options.

## reproduction

given a directory structure:
```
.accept.blackbox/
  foo.ts                    # matched ✓
  bar/
    baz.ts                  # matched ✓
  .test/
    assets/
      example.ts            # NOT matched ✗
```

the pattern `.accept.blackbox/**/*.ts` with `dot: true` will match `foo.ts` and `bar/baz.ts`, but will NOT match `.test/assets/example.ts`.

## root cause

this is a known limitation in glob implementations:
- https://github.com/nodejs/node/issues/56321
- the `**` globstar skips hidden directories in traversal, even with `dot: true`
- `dot: true` only affects whether dotfiles are included in results, not whether dot-directories are traversed

## proposed fix

modify `src/domain.operations/usage/evaluate/evaluateProjectAgainstFileCheckDeclaration.ts` to run additional glob patterns that explicitly match nested hidden directories.

### option a: expand glob patterns (recommended)

before the call to fast-glob, expand any pattern that contains `**` into multiple patterns that explicitly include hidden directory traversal:

```ts
const expandGlobForHiddenDirs = (pattern: string): string[] => {
  // if pattern doesn't contain **, no expansion needed
  if (!pattern.includes('**')) return [pattern];

  // expand to include hidden directory variants
  // e.g., "foo/**/*.ts" becomes:
  //   - "foo/**/*.ts"           (original)
  //   - "foo/**/.*/**/*.ts"     (hidden dirs at any depth)
  return [
    pattern,
    pattern.replace('**/', '**/.*/**/'),
  ];
};

// in the glob call:
const patterns = expandGlobForHiddenDirs(check.pathGlob);
const pathsFoundByGlob = await withDurationReport(
  `glob:${check.pathGlob}`,
  async () => {
    const results = await Promise.all(
      patterns.map((p) =>
        glob(p, {
          cwd: project.getProjectRootDirectory(),
          dot: true,
          onlyFiles: true,
          ignore: ['node_modules'],
        }),
      ),
    );
    // dedupe results
    return [...new Set(results.flat())];
  },
)();
```

### option b: use glob with `followSymbolicLinks` and manual recursion

alternatively, use a custom directory walker that explicitly enters hidden directories. this is more complex but gives full control.

### option c: document the limitation

if a fix is not feasible, document that patterns with `**` require explicit handle of nested hidden directories in practice definitions.

## test case

add an integration test that verifies nested hidden directories are matched:

```ts
it('should match files in nested hidden directories', async () => {
  // given a practice with pattern: .accept.blackbox/**/*.ts
  // and a project with: .accept.blackbox/.test/assets/example.ts
  // then the file should be matched and evaluated
});
```

## files to modify

1. `src/domain.operations/usage/evaluate/evaluateProjectAgainstFileCheckDeclaration.ts`
   - add glob pattern expansion for hidden directories

2. `src/domain.operations/usage/evaluate/evaluateProjectAgainstFileCheckDeclaration.integration.test.ts`
   - add test case for nested hidden directories

## references

- node.js glob issue: https://github.com/nodejs/node/issues/56321
- fast-glob repo: https://github.com/mrmlnc/fast-glob
- declapract repo: https://github.com/ehmpathy/declapract
