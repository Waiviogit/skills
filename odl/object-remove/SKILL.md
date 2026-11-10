---
name: object-remove
description: >-
  Translate a user's "delete", "remove", "clear", "hide", or "get rid of" on an ODL
  object into the operation that exists: reject the update (update_vote against) for a
  field value, or set the object status (unavailable, closed, …) for the whole object.
  Use when a user asks to delete or remove a field, category, tag, photo, menu item,
  link, or an object itself.
---

# Remove a field value or an object

Nothing on ODL is deleted. The chain is append-only, and there is no "delete", "retract", or "clear field" operation. Do not tell the user removal is impossible — it is done with the operations below.

## What the user means

| User says | Target | Do this |
|-----------|--------|---------|
| Delete / remove / clear / hide a **value on an object** (category, tag, photo, title, description, link, menu item, button, …) | The update that added the value | `update_vote` **`against`** on that `update_id` |
| Delete / remove **the object** (gone, no longer sold, out of business, duplicate) | The object | `update_create` of type **`status`** — see [Object status](#object-status) |
| Undo my earlier approve/reject | Your vote | `update_vote` **`remove`** |
| Bring a rejected value back | The update | `update_vote` **`for`** |
| Move a value down a list | Order only | `rank_vote` — this **never** hides a value |

If it is unclear whether the user means a value or the whole object (e.g. "delete the dish from the menu": the menu's link to the dish, or the dish itself?), ask once.

## Field value: reject the update

1. `resolve_object` (query-api) — confirm the value is live and note its `update_type`.
2. `get_object_updates({ object_id, update_type })` — find **every** `update_id` that carries the value. Multi-value fields (categories, tags, gallery, menu items) have one update per value; duplicates may exist.
3. For each `update_id`: agent-wallet `odl_build_update_vote({ objectId, updateId, voter, vote: "against" })` → `wallet_broadcast`. Library: `buildOdlUpdateVoteOp`. Signing: [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md).
4. After index lag, `resolve_object` again — the value must be gone.

Rules:

- You may reject your **own earlier** updates and other people's. Your vote replaces your earlier vote on the same update (including the creator's automatic `for`).
- Do not vote on a brand-new `update_create` from the same job. If you just wrote a wrong value, write the correct one and reject the old one.
- Single-value fields (`title`, `name`, `image`, `status`, …): rejecting the shown value reveals the next valid one. To clear the field, reject every valid candidate of that `update_type`.
- To replace a value, add the new one with `odl_build_update_create`, then reject the old one.

### Still visible after your vote?

A vote decides validity only when the voter is decisive on that object: an exclusive owner recognized by governance, an admin, or a trusted account with authority. Otherwise community weight decides (`waiv_power`; the value hides when the signed weight goes below zero). `get_update_voters` shows who voted. If your vote is not decisive, tell the user who can decide. Detail: `docs/spec/vote-semantics.md`, `docs/spec/object-ownership.md`.

## Object status

Set with `odl_build_update_create({ objectId, creator, updateType: "status", value: { title } })`. Schema: `get_update_schema({ update_type: "status" })`.

| `title` | Use when |
|---------|----------|
| `unavailable` | No longer offered or sold, out of stock for good — the usual "delete this object" |
| `closed` | A venue (business, restaurant, place, shop) closed permanently |
| `relisted` | The object moved to another object — requires `link` (the new object id) |
| `active` | Restore |

Do not pick `nsfw`, `flagged`, or `privacy_erasure` unless the user asks for that moderation action.

Effect: a non-active object is left out of search, discover, favorites, and nested cards of other objects. Its own page still opens, with a status badge. The status is a single-value field, so the same validity rules apply: your status update counts only if it wins (see [Still visible after your vote?](#still-visible-after-your-vote)).

## Not for this

- Hiding a **post** from an object's feed or related album — that is the `remove` update type (value = post key `author/permlink`), not a vote.
- Deleting an OSL message — [osl-messaging](../osl-messaging/SKILL.md).
- Hive account profile fields — [hive-account-profile-update](../hive-account-profile-update/SKILL.md).

## Related

- [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) — builders, key custody, network
- [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) — agent-wallet tools
- [query-api-mcp-routing](../query-api-mcp-routing/SKILL.md) — `resolve_object`, `get_object_updates`, `get_update_voters`
