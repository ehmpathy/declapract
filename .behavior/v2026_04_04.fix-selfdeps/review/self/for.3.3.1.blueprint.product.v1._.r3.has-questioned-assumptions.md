# self-review r3: has-questioned-assumptions

surface and question all technical assumptions in the blueprint.

---

## assumption 1: getProjectRootDirectory() provides correct package.json path

**what we assume**: FileCheckContext.getProjectRootDirectory() returns the path to the package.json we modify.

**what if opposite were true?**: self-dep detection would compare against wrong package name.

**evidence**: research citation shows FileCheckContext already has this method, and extant tests use it for package.json access. monorepo handle is built into the context.

**verdict**: ✓ holds — verified by research

---

## assumption 2: exact string match is sufficient for self-dep detection

**what we assume**: compare `packageName === dependencyKey` catches all self-deps.

**what if opposite were true?**: package name alias support could bypass detection.

**counterexample check**: npm/pnpm do not support package name aliases in dependency declarations. the `name` field is the canonical identifier.

**verdict**: ✓ holds — no alias support in npm ecosystem

---

## assumption 3: link:. and file:. are the only self-ref protocols

**what we assume**: `isSelfRefProtocol` checks only link: and file: prefixes.

**what if opposite were true?**: other protocols like `workspace:` could be self-refs.

**analysis**:
- `workspace:*` — monorepo cross-package reference, not self-ref
- `git://` — remote reference, not self-ref
- `npm:` — npm alias, not self-ref
- `link:.` — local symlink, IS self-ref
- `file:.` — local file reference, IS self-ref

**verdict**: ✓ holds — only link: and file: are self-reference protocols

---

## assumption 4: console.log with chalk.yellow is correct for warn output

**what we assume**: emitSelfDepWarn uses console.log, not console.warn.

**what if opposite were true?**: console.warn would go to stderr, might be filtered differently.

**evidence**: research showed extant declapract patterns use console.log with chalk.yellow for warn-level output. follows codebase convention.

**verdict**: ✓ holds — follows extant patterns

---

## assumption 5: null return from check phase is sufficient for "pass with note"

**what we assume**: checkContainsJSON returns null (no failure reason) when self-dep detected.

**what if opposite were true?**: might need special return type to indicate "passed but with note".

**analysis**: vision says "check passes with note". the note is emitted via console at check time. null return = pass. this achieves the stated behavior.

**could be simpler?**: this IS the simplest approach. no new return types needed.

**verdict**: ✓ holds — simplest approach that meets requirements

---

## assumption 6: all dependency types should omit self-deps

**what we assume**: dependencies, devDependencies, peerDependencies, optionalDependencies all get self-dep omission.

**what if opposite were true?**: peerDependencies has distinct semantics — maybe self-peer-deps are valid?

**analysis**: circular peer dependencies also cause npm/pnpm resolution issues. there is no valid use case for `pkg-x: "^1.0.0"` as a peerDependency of pkg-x itself.

**criteria coverage**: usecase.7 explicitly lists all dep types.

**verdict**: ✓ holds — criteria explicitly requires all dep types

---

## assumption 7: fixContainsJSONByReplacingAndAddingKeyValues is the correct location

**what we assume**: self-dep detection belongs in the fix function, not in a wrapper or pre-processor.

**what if opposite were true?**: could process package.json before fix function sees it.

**analysis**: research identified this function as the "deep merge" point where declared values are assigned. this is the natural interception point. a pre-processor would add complexity without benefit.

**verdict**: ✓ holds — research identified correct location

---

## summary

| # | assumption | questioned? | evidence | holds? |
|---|------------|-------------|----------|--------|
| 1 | getProjectRootDirectory path | yes | research | ✓ |
| 2 | exact string match | yes | npm behavior | ✓ |
| 3 | link:/file: only | yes | protocol analysis | ✓ |
| 4 | console.log for warns | yes | codebase patterns | ✓ |
| 5 | null return = pass | yes | simplicity check | ✓ |
| 6 | all dep types | yes | criteria + npm behavior | ✓ |
| 7 | fix function location | yes | research | ✓ |

**result**: 7 assumptions questioned. all hold under scrutiny. no hidden issues found.
