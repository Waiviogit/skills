---
name: platform-renew
description: >-
  Refresh local ODL skills and agent-wallet after a Waivio release. Use when the user
  says renew or refresh Waivio skills, agent wallet, or MCP tools.
---

# Platform renew

Keep the sidecar current after a Waivio MCP / agent-wallet release. Do not invent a new one-shot skill per bump.

## When to use

- User says renew / refresh Waivio **skills**, **agent wallet**, or **tools**.
- Knowledge-api or agent-wallet tagged a new release.
- Local playbooks look older than the catalog in this repo.

## When not to use

- Publishing objects, menus, or posts — type playbook + [object-content-standards](../object-content-standards/SKILL.md) / [hive-post-create](../hive-post-create/SKILL.md).
- First-time HAS login — [has-login-from-chat](../has-login-from-chat/SKILL.md).

## 1. Skills

Install / refresh from the public catalog:

```bash
npx skills add https://github.com/Waiviogit/skills
```

Repo: [Waiviogit/skills](https://github.com/Waiviogit/skills).

After sync, **re-read** [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md). If the catalog copy lagged behind a portable release, restore portable install from that skill.

## 2. Agent-wallet

Latest tag: GitHub `Waiviogit/open-data-layer` `releases/latest` (`agent-wallet-v*` / `agent-wallet.js`).

Install, hash check, MCP registration, and tool table live in [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md). Here only:

1. Download the portable / `agent-wallet.js` from that release.
2. Verify the published hash (`agent-wallet.js.sha256`) **before** running.
3. Do **not** kill the process on `:7500` unless the user separately says yes to stopping that daemon. “Renew wallet” is not enough.
4. Smoke `hive_build_post` only. Never broadcast the smoke ops.

## 3. Tools checkout

Compare each server’s `tools/list` against [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) (and knowledge-api / query-api routing skills). Report count + new names. Do not freeze a historic count.

| Server | How |
|--------|-----|
| knowledge-api | MCP `tools/list` |
| query-api | MCP `tools/list` (or HTTP `POST …/query/mcp`) |
| agent-wallet | local `127.0.0.1:7500` `tools/list` — `hive_build_post` present? |

If a knowledge tool is on the server `tools/list` but missing from this session’s deferred catalog, call it directly. Do not conclude it was removed.

## Pitfalls

- JWT is for IPFS only. Do not start `waivio_auth_start` while a HAS/local broadcast is waiting.
- **Stage, then ask, then swap.** Unpack + hash first. Do not retry a blocked kill of `:7500`.
- `agent-wallet-portable` may be a real directory, not a junction. After the process is stopped: move the old dir aside, then junction to the unpacked upgrade.
- On Windows, `mklink /J` is the reliable junction for `node_modules`. bash `ln -s` often copies.

## Verification

- Installed skills match [Waiviogit/skills](https://github.com/Waiviogit/skills).
- `GET http://127.0.0.1:7500/agent-wallet/health` → `signingMode` + `localKeys.ready` as expected.
- `tools/list` on each server matches the live routing skills, not a frozen count.
