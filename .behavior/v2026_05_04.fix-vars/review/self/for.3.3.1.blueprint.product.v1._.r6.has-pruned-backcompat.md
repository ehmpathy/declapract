# self-review: has-pruned-backcompat (r6)

## deeper review — what was missed in r5

r5 checked three backcompat concerns. let me look harder at whether any were "to be safe" assumptions.

---

## re-examination with vision quotes

### concern 1: string variables still work

**vision explicitly states:**
> "backwards compatible — strings still work as before"

**wisher explicitly requested?** yes.

**why this holds:** direct quote from vision pros section.

---

### concern 2: nested object access still works

**vision shows this example:**
> `the database service user is named '@declapract{variable.databaseUserName.serviceUser}'. you can auth under that in dev`

**wisher explicitly requested?** implicitly — this example must continue to work.

**did we assume "to be safe"?** no — the vision includes nested object access in its examples.

**why this holds:** if nested object access broke, the vision's example would fail. the vision implicitly requires it.

---

### concern 3: backwards compat section exists

**is this section "to be safe" documentation?**

let me check what the vision says about backwards compatibility:

from vision "evaluation" section:
> | goal | solved? |
> |------|---------|
> | backwards compatible | yes — strings still work as before |

from vision "pros" section:
> - backwards compatible

**wisher explicitly requested?** yes — backwards compatibility is listed as a goal.

**why the section holds:** the blueprint section documents that we verified this goal. it is not speculation — it is confirmation.

---

## no unrequested backcompat found

every backcompat concern traces to the vision:

1. **string variables** — vision pros: "backwards compatible"
2. **nested object access** — vision example uses `databaseUserName.serviceUser`
3. **backcompat section** — vision goal: "backwards compatible"

**no "to be safe" assumptions made.**

**why this holds:** the vision explicitly states backwards compatibility as a requirement. we documented what was requested, not what we assumed.
