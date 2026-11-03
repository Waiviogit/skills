---
name: hive-account-profile-update
description: >-
  Update a Hive account profile (user avatar, cover image, display name, about, location,
  website) with agent-wallet hive_build_profile_update, which builds a posting-key
  account_update2 on posting_json_metadata. Explains account_update vs account_update2 and
  account profile vs ODL object avatar. Use when an agent or user asks to set, change, or
  remove their own profile picture, avatar, cover, name, or bio on Hive / Waivio.
---

# Hive account profile update

A **Hive account profile** (`@bob` avatar, cover, name, bio) is not an ODL object. It lives in the account's `posting_json_metadata.profile` and is changed with one `account_update2` op signed by the **posting** key.

## Account profile vs object avatar

Decide first — this is the usual source of confusion.

| User says | Target | Tool | Image value |
|-----------|--------|------|-------------|
| "Add the image to **my / your profile**", "set the account avatar", "update @name bio" | Hive account | `hive_build_profile_update` | `contentUrl` (full https URL) |
| "Set the avatar of **object** X" (skill, product, business, …) | ODL object | `odl_build_update_create` `updateType: "image"` | `{ "cid": "…" }` — see [ipfs-image-upload](../ipfs-image-upload/SKILL.md) |

The same uploaded image can be used for both: upload once with `ipfs_upload_image`, keep `cid` **and** `contentUrl`. Objects take `{ cid }`; the account profile takes `contentUrl`, because Hive frontends read a plain URL from `profile_image`.

OSL `update_user_metadata` is app settings (locale, night mode, vote percent) — not the profile.

## `account_update` vs `account_update2`

Both ops carry the same optional authority fields (`owner`, `active`, `posting`, `memo_key`). They are **not** profile-only ops — they can rewrite the account's keys.

| | `account_update` | `account_update2` |
|--|------------------|-------------------|
| Metadata field | `json_metadata` (legacy) | `json_metadata` and `posting_json_metadata` |
| `memo_key` | required field; overwritten with what you send | optional |
| `owner` / `active` / `posting` | optional; can change all three | optional; can change all three |
| Key required | active (owner if `owner` is set) — always, even for metadata only | **posting** only when the op sets nothing but `posting_json_metadata`; otherwise active (owner if `owner` is set) |
| Seen by Waivio / PeakD / Ecency | only when `posting_json_metadata` has no profile | **yes** — read first |

For a profile change use `account_update2` with only `account`, `json_metadata: ""`, `posting_json_metadata` and `extensions: []` — no authority fields, no `memo_key`.

### Authorities are replaced, not merged

When an op includes `owner`, `active` or `posting`, the chain **replaces that authority as a whole** (`weight_threshold`, `key_auths`, `account_auths`). Anything you leave out is removed.

- To change an authority, read the live account (`get_accounts`), copy the **full** current authority, apply your change, and send the result. Example: adding a posting `account_auths` entry must also resend every existing posting key and every existing app (`waivio.app`, `ecency.app`, …), or they lose access.
- An authority field you do not include stays unchanged. Omit what you do not change.
- `account_update` always writes `memo_key` — send the current one, or the memo key changes.
- Owner changes are rate-limited by the chain and need the owner key — never part of a profile task.
- Posting authority grants are a separate flow: `hive_build_posting_authority_grant` ([hive-account-authority-for-agents](../hive-account-authority-for-agents/SKILL.md)), which already resends the full authority.

### Metadata is replaced too

- `posting_json_metadata` is **replaced as a whole**. Never broadcast a hand-built `{"profile":{"profile_image":"…"}}` — it wipes name, about, cover, and any other keys. `hive_build_profile_update` reads the live account and merges for you.
- An empty string (`""`) in `json_metadata` / `posting_json_metadata` means "do not change".
- An `account_update` with a new `json_metadata.profile` is **silently ignored** by readers once `posting_json_metadata.profile` exists. The tx succeeds but the avatar does not change.
- Never ask for the active key to change a profile.

## Workflow (agent-wallet)

1. **Image ready?** Prepare a square image (1:1, up to 1024px) for the avatar; cover is landscape (about 3:1). Generated or temporary CDN images must be downloaded first — see [ipfs-image-upload](../ipfs-image-upload/SKILL.md) § Avatar preparation.
2. **Upload:** `ipfs_upload_image({ filePath, account })` → keep `contentUrl`. Confirm it opens (HTTP 200, image content-type). Reusing an image already uploaded for an object: build the URL from its `cid` as `{origin}/ipfs-gateway/content/image/{cid}` (same as `contentUrl`).
3. **Build:**

   ```json
   hive_build_profile_update({
     "account": "bob",
     "profile": { "profile_image": "<contentUrl>" }
   })
   ```

   Only pass fields you change. String sets, `null` removes, omitted keeps. Fields: `name`, `about`, `location`, `website`, `profile_image`, `cover_image`.
4. **Check result:** `changedFields` must list what you meant to change; `profile` is the full profile after the update. `ops: []` means the profile already has these values — do not broadcast.
5. **Broadcast** (posting key):
   - Local key: `wallet_broadcast({ ops, keyType: "posting", account })` → poll `wallet_broadcast_status`.
   - HAS session is the same account: `has_broadcast({ ops, keyType: "posting" })` → poll `has_broadcast_status`.
   - `canSignLocally: false` and no HAS session for that account → hand the ops to the user as a payload.
6. **Verify:** query-api `get_user_profile({ account })` — avatar URL updates after the indexer processes the block (seconds). Browser caches can lag; the API value is the source of truth.

## Without agent-wallet

Read the account first (`condenser_api.get_accounts`), parse `posting_json_metadata` (fall back to `json_metadata.profile` if empty), change only the needed `profile` keys, then sign with the posting key:

```json
["account_update2", {
  "account": "bob",
  "json_metadata": "",
  "posting_json_metadata": "{\"profile\":{\"name\":\"Bob\",\"about\":\"…\",\"profile_image\":\"https://…\",\"version\":2}}",
  "extensions": []
}]
```

Library: `mergeHiveProfileMetadata` + `buildAccountUpdate2ProfileOp` from `@opden-data-layer/hive-broadcast`. Signing modes and key custody: [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md).

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Used `odl_build_update_create` for the account avatar | That writes an ODL object field. Use `hive_build_profile_update` |
| Put `{ "cid": … }` in `profile_image` | Profile needs the full `contentUrl` |
| Put a temporary generator URL (`files-cdn.x.ai`, …) in `profile_image` | Download, upload via `ipfs_upload_image`, use `contentUrl` |
| Used `account_update` / asked for the active key | Profile is posting-key `account_update2` |
| Sent `posting` / `active` / `owner` with only the new entry | Authorities are replaced as a whole — resend the full current authority, or omit the field |
| Broadcast only `{ profile_image }` in `posting_json_metadata` | Use the tool (merges); never replace the whole metadata by hand |
| Waited for avatar in the browser only | Check `get_user_profile` via query-api |

## Related

- [ipfs-image-upload](../ipfs-image-upload/SKILL.md) — upload, image preparation, object avatars
- [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) — agent-wallet daemon, HAS signing
- [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) — key custody, signing modes
- Spec: `docs/apps/agent-wallet/spec/hive-profile-update.md`
