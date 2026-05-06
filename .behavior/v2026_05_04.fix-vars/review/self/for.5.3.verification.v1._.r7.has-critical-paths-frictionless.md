# self-review: has-critical-paths-frictionless (r7)

## step 1: identify critical paths

no repros artifacts exist for this route. the critical path is derived from the vision:

**critical path:** array variables work like string variables
1. user declares array variable in `declapract.use.yml`
2. practice template references it with `@declapract{variable.X}`
3. declapract substitutes it with JSON array literal

## step 2: trace through the implementation

### line 26-29: flatten with safe option

```typescript
const flattenedProjectVariables: Record<string, string | string[]> = flatten(
  projectVariables,
  { safe: true },
);
```

**frictionless?** yes. arrays are preserved, not split into indexed keys.

### line 50-52: array detection and serialization

```typescript
const replacement = Array.isArray(variableValue)
  ? JSON.stringify(variableValue)
  : variableValue;
```

**frictionless?** yes. arrays become valid JSON array literals.

## step 3: verify via test cases

ran the tests:

```
npm run test:unit -- replaceProjectVariablesInDeclaredFileContents
```

all 5 tests pass:
1. string variables → replaced correctly
2. undefined variables → throws UserInputError
3. array variables → replaced with JSON array literals
4. empty arrays → outputs `[]`
5. single item arrays → outputs `["item"]`

## step 4: manual trace through example

**input:**
```typescript
projectVariables: {
  productionApprovers: ['alice', 'bob'],
}
fileContents: 'reviewers: @declapract{variable.productionApprovers}'
```

**trace:**
1. `flatten({ productionApprovers: ['alice', 'bob'] }, { safe: true })`
   → `{ productionApprovers: ['alice', 'bob'] }`
2. `Array.isArray(['alice', 'bob'])` → `true`
3. `JSON.stringify(['alice', 'bob'])` → `'["alice","bob"]'`
4. output: `'reviewers: ["alice","bob"]'`

**frictionless?** yes. no JSON.parse needed on the user side.

## verdict

**critical path is frictionless.** array variables work like string variables — declare, reference, substitute. no workarounds required.
