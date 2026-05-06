# self-review: behavior-declaration-coverage (r4)

## criteria matrix check

### from 2.2.criteria.blackbox.matrix.stone:

| input | expected output |
|-------|-----------------|
| string variable | string value |
| nested object variable | accessed value |
| array variable | JSON array literal |
| empty array | `[]` |
| single item array | `["item"]` |

### coverage by test:

**string variable:**
- covered by extant test: `'should replace all occurrences of declared variables'`
- input: `serviceName: 'super-cool-service'`
- output: `super-cool-service`

**nested object variable:**
- covered by extant test: `'should replace all occurrences of declared variables'`
- input: `databaseUserName: { serviceUser: 'super-cool-service-user' }`
- output: `super-cool-service-user`

**array variable:**
- covered by new test: `'should replace array variables with JSON array literals'`
- input: `productionApprovers: ['alice', 'bob']`
- output: `["alice","bob"]`

**empty array:**
- covered by new test: `'should handle empty array variables'`
- input: `approvers: []`
- output: `[]`

**single item array:**
- covered by new test: `'should handle single item array variables'`
- input: `approvers: ['alice']`
- output: `["alice"]`

---

## matrix coverage

| criterion | test exists? | test passes? |
|-----------|--------------|--------------|
| string | yes (extant) | yes |
| nested object | yes (extant) | yes |
| array | yes (new) | yes |
| empty array | yes (new) | yes |
| single item | yes (new) | yes |

**100% matrix coverage.** all criteria have test coverage.
