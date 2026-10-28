---
name: object-content-routing
description: >-
  Route agent intent to the correct object-create playbook, workflow, or MCP tool. Use
  when routing create/enrich intent to the correct object-create playbook or workflow.
---

# Object content routing

## When to use

- User asks to create or enrich an ODL object (recipe, restaurant, product, …).
- You need the correct playbook before calling `odl_build_object_create`.

## When not to use

- Object already exists and only needs an update → `odl_build_update_create` + type playbook for field semantics.
- Read-only lookup → query-api MCP, not knowledge playbooks.

## Decision table

| User intent | Open first |
|-------------|------------|
| Any object create / field guidance | `get_object_create_playbook({ object_type })` |
| Browse all type playbooks | [object-create/references](../object-create/references/) |
| Restaurant + full menu | [restaurant-menu-workflow.md](../restaurant-menu-workflow/SKILL.md) |
| Dish / product / company avatar or article preview | [image-generate](../image-generate/SKILL.md) |
| Post about a created object | [companion-post-workflow.md](../companion-post-workflow/SKILL.md) → [hive-post-create.md](../hive-post-create/SKILL.md) |
| Recipe cooking post | [recipe post format](../hive-post-create/references/recipe.md) |
| Review / gallery companion post | [review](../companion-post-workflow/references/review.md) |
| Social digest on an object channel | [object-activity](../object-activity/SKILL.md) |
| Publish Hive root post | [hive-post-create.md](../hive-post-create/SKILL.md) |
| Write object thread (Reviews > Threads) | [hive-thread-create.md](../hive-thread-create/SKILL.md) |
| Common dedupe, locales, images, broadcast | [object-content-standards.md](../object-content-standards/SKILL.md) |
| Payload shape / Zod schema | `get_object_type` + `get_update_schema` |
| Sign and broadcast | [hive-blockchain-broadcast.md](../hive-blockchain-broadcast/SKILL.md) |

## Standard workflow

1. `get_object_create_playbook({ object_type })` — registry + required baseline + playbook excerpt.
2. `get_update_schema({ update_type })` for unfamiliar fields (`localizable`, `value_kind`, `cardinality`).
3. Dedupe via query-api search / `resolve_object`.
4. Build draft fields; upload images to IPFS.
5. `odl_build_object_create` → review warnings → broadcast on user approval.
6. `resolve_object` to verify.

## Related

- [Object content standards](../object-content-standards/SKILL.md)
- [Knowledge API routing](../knowledge-api-routing/SKILL.md)
