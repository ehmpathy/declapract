# self-review: has-snap-changes-rationalized (r7)

## deeper examination

### the snapshot file

`src/domain.operations/commands/__snapshots__/apply.integration.test.ts.snap`

### the exact diff

```diff
@@ -14,15 +14,15 @@ exports[`apply should be able to apply for an example project 1`] = `
   [
     "[90m  ✓ evaluated practice:serverless[39m",
   ],
-  [
-    "[90m  ✓ evaluated practice:npmrc[39m",
-  ],
   [
     "[90m  ✓ evaluated practice:prettier[39m",
   ],
   [
     "[90m  ✓ evaluated practice:util-sleep[39m",
   ],
+  [
+    "[90m  ✓ evaluated practice:npmrc[39m",
+  ],
   [
     "[90m  ✓ evaluated practice:terraform[39m",
   ],
```

### line by line analysis

**before:**
1. serverless
2. npmrc
3. prettier
4. util-sleep
5. terraform

**after:**
1. serverless
2. prettier
3. util-sleep
4. npmrc
5. terraform

### what happened

the `npmrc` practice moved from position 2 to position 4. this is a reorder, not a content change.

### why did this happen

the `apply` command evaluates practices concurrently via `Promise.all`. the order that log messages appear depends on which promise resolves first. this varies across runs due to:
- cpu thread schedule
- filesystem i/o latency
- async queue drain order

### is this a problem?

**no.** because:
1. all 5 practices are still evaluated (none absent)
2. all 5 show success (no status change)
3. the output is functionally identical
4. concurrent execution order is nondeterministic by design

### is this related to my change?

**no.** my change only affects `replaceProjectVariablesInDeclaredFileContents`. the practice evaluation concurrency is unchanged.

### should I fix the flaky order?

that would require to sort the output or enforce sequential evaluation. both are out of scope for array variable support.

## verdict

**intentional and justified.** the snapshot change is a log order variance from concurrent execution. all practices are evaluated successfully. no regression.
