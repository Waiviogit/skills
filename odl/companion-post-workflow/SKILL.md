---
name: companion-post-workflow
description: >-
  Link a Hive post to an ODL object after create — json_metadata.objects and body
  references; build via hive-post-create. Use when linking a Hive post to an ODL object
  after create.
---

# Companion post workflow

Add-on for publishing a **companion post** that references a created ODL object. For build, tags, beneficiaries, reward mode, and broadcast, follow **[hive-post-create.md](../hive-post-create/SKILL.md)**.

## When not to use

- Factual digest of a social post onto an **object** channel — [object-activity](../object-activity/SKILL.md).
- Leo thread (Reviews > Threads) — [hive-thread-create](../hive-thread-create/SKILL.md).
- Recipe cooking post body order — [recipe post format](../hive-post-create/references/recipe.md) (then this skill for object linking).
- Review / gallery companion — [review](references/review.md) first.

## Prerequisites

1. Object must exist on chain (indexer drops unknown ids from `post_objects`).
2. User explicitly requested publication (draft preparation is OK without broadcast).

## What is specific to companion posts

1. **`json_metadata.objects`** per `docs/spec/data-model/post-json-metadata-objects.md`:
   - Typically `[{ "object_id": "<id>", "percent": 100 }]`
   - Sum of percents ≤ **100**
2. **Body** should link to or describe the object (Waivio `/object/…` URLs, name, hero image).
3. **Tags** — include at least one WAIV-eligible tag when WAIV potential matters (see [hive-post-create.md](../hive-post-create/SKILL.md)); e.g. `food` for recipes.

## Steps

1. Create or confirm object via object-create workflow.
2. Draft title/body with source links and hero image (IPFS or canonical URL).
3. `hive_build_post` with `objects` (and `tags`, `body`, …) — see [hive-post-create.md](../hive-post-create/SKILL.md).
4. `wallet_broadcast` / `has_broadcast` only after user approval.
5. Verify post via query-api.

## Related

- [Hive post create](../hive-post-create/SKILL.md) — full post playbook + `hive_build_post`
- [Recipe post format](../hive-post-create/references/recipe.md)
- [Review / gallery posts](references/review.md)
- [Hive blockchain broadcast](../hive-blockchain-broadcast/SKILL.md)
- [Object content standards](../object-content-standards/SKILL.md)
