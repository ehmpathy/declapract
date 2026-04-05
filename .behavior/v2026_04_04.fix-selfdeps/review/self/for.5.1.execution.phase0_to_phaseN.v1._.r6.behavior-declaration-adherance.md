# self-review r6: behavior-declaration-adherance

## the review

i verified each changed file adheres to the blueprint spec.

### blueprint vs implementation matrix

| blueprint spec | file | adherance | notes |
|----------------|------|-----------|-------|
| extend isLinkedDependencyVersion for file: | check.minVersion.ts | ✓ adheres | adds `value.startsWith('file:')` check |
| checkContainsJSON: self-dep detection in check phase | checkContainsJSON.ts | ✓ adheres | filters self-deps via filterSelfDepsFromDeclared |
| isSelfDependency: self-dep detection transformer | isSelfDependency.ts | ✓ adheres | compares packageName to dependencyKey |
| emitSelfDepWarn: warn emission communicator | emitSelfDepWarn.ts | ✓ adheres | emits treestruct box-draw warn |
| filterSelfDepsFromDeclared: filter for check phase | filterSelfDepsFromDeclared.ts | ✓ adheres | filters self-deps from declared JSON |
| processSelfDepsForFix: process for fix phase | processSelfDepsForFix.ts | ✓ adheres | omit or preserve based on extant |
| fixContainsJSON: integrate self-dep detection | fixContainsJSONByReplacingAndAddingKeyValues.ts | ✓ adheres | calls processSelfDepsForFix |
| containsCheck: get target package name | containsCheck.ts | ✓ adheres | reads root package.json for name |

### detailed verification

#### check.minVersion.ts

**blueprint**: add `value.startsWith('file:')` check to isLinkedDependencyVersion

**implementation verification** (line 8-13):
```ts
export const isLinkedDependencyVersion = (input: {
  value: unknown;
}): boolean => {
  if (typeof input.value !== 'string') return false;
  return input.value.startsWith('link:') || input.value.startsWith('file:');
};
```

**blueprint also required**: linked versions pass minVersion checks (line 47-49):
```ts
// linked versions always satisfy minVersion checks (the repo IS the package)
const isLinked = isLinkedDependencyVersion({ value: foundValue });
if (isLinked) return true;
```

**adherance**: ✓ exact match to spec — file: handled alongside link:

#### emitSelfDepWarn.ts

**blueprint**: warn format with box-draw treestruct per vision.md

**implementation verification** (line 7-29):

omit path (line 12-19):
```ts
if (input.action === 'omitted') {
  console.log(
    chalk.yellow(
      `⚠️ warn: omit self-dependency ${input.packageName}@${input.declaredVersion}\n` +
        `   ├─ a package should not depend on itself\n` +
        `   └─ if intentional, use link:. or file:. to self-reference`,
    ),
  );
```

preserve path (line 20-27):
```ts
} else {
  console.log(
    chalk.yellow(
      `⚠️ warn: preserve self-dependency ${input.packageName}\n` +
        `   ├─ extant self-ref was preserved\n` +
        `   └─ practice declared version was skipped`,
    ),
  );
}
```

**verification against vision format**:
- ✓ uses `⚠️ warn:` prefix
- ✓ uses box-draw characters (`├─`, `└─`)
- ✓ uses chalk.yellow as per extant console.log patterns
- ✓ includes packageName and version
- ✓ explains why and provides escape hatch info

**adherance**: ✓ exact match to vision warn format

#### isSelfDependency.ts

**blueprint**: transformer, input: { packageName: string | null; dependencyKey: string }, output: boolean

**implementation verification**:
```ts
export const isSelfDependency = (input: {
  packageName: string | null;
  dependencyKey: string;
}): boolean => {
  if (input.packageName === null) return false;
  return input.packageName === input.dependencyKey;
};
```

**adherance**: ✓ exact signature match

#### processSelfDepsForFix.ts

**blueprint**:
- omit self-deps (if version)
- preserve self-deps (if link:./file:.)
- emit warns for each action

**implementation verification**:
- line 58-67: preserves when extant is link:./file:., emits preserved warn
- line 70-75: omits when version, emits omitted warn

**adherance**: ✓ implements both paths correctly

### vision adherance

| vision requirement | implementation | adherance |
|-------------------|----------------|-----------|
| "omit the self-dep and that should be logged as a warn" | processSelfDepsForFix calls emitSelfDepWarn | ✓ |
| "if not already link:. or file:. dep, then omit" | isLinkedDependencyVersion check in processSelfDepsForFix | ✓ |
| "save users from themselves" (pit of success) | automatic detection, no config needed | ✓ |

### criteria adherance

| criteria check | implementation | adherance |
|----------------|----------------|-----------|
| check phase must PASS for self-deps (option C) | filterSelfDepsFromDeclared removes self-deps before comparison | ✓ |
| fix phase omits with warn | processSelfDepsForFix + emitSelfDepWarn | ✓ |
| fix phase preserves link:./file:. with warn | isLinkedDependencyVersion check + preserve path | ✓ |

## conclusion

all files adhere to the blueprint, vision, and criteria specifications. no deviations found.
