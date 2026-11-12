---
name: knowledge-api-routing
description: >-
  First-visit map for MCP tools, doc types, and which skill or spec to open for a task.
  Also sets the search order for providers and services: OBL offers, then ODL
  service_offer objects, then the web. Use when choosing a provider or service for a task,
  when first connecting to knowledge-api MCP, or routing a task to the right spec or
  skill.
---

# Knowledge API routing for agents

## When to use

- First connection to **knowledge-api** MCP — you need a map of tools and doc types.
- User task is unclear and you do not know which spec or skill to open.
- You want a catalog of playbooks before searching.

## When not to use

- You already know the exact path (e.g. from user or spec citation) — call `get_file` directly.
- You need **Cursor runtime** skills (Next.js, Nx generators) — those live in `.agents/skills/` and are **not** indexed here.
- You need chain JSON Schema — use `get_object_type` / `get_update_schema`, not search.

## First visit steps

1. Read MCP **server instructions** (returned on `initialize`) or resource `odl-knowledge://routing`.
2. For procedural ODL work, use the local skills in this catalog (`odl/<name>/SKILL.md`). Object-type playbooks are in [object-create/references](../object-create/references/).
3. `resolve_doc({ topic: "<user task>" })` — best **spec** path(s) in the monorepo before opening files.
4. `get_file({ path: "<chosen path>" })` — full spec markdown before implementing.
5. `get_context({ topic })` — compact chunks when you need excerpts without full files.
6. App features: `resolve_doc({ topic, scope: "<app>" })` or `list_files({ scope: "<app>" })`.

## Find a solution: OBL first

Before you pick a provider, site, or service for a task (create an account, redeem a ticket or code, buy data, any third-party work), search in this order. Stop at the first match.

1. **OBL offers** — query-api `search_obl_offers` (`q` on name/description, `tags` comma-separated, `kind: "offer"`) → `get_obl_offer`. The offer `description` and `terms` say how to buy or redeem (HTTP URL, MCP tool). If you already have a contract with that provider (`get_obl_relationships`), use it. Steps: [obl-offers-contracts](../obl-offers-contracts/SKILL.md).
2. **ODL service offers** — `service_offer` objects: query-api `discover_objects({ object_type: "service_offer", … })` or `search`, then `resolve_object` for capability, endpoint, price, and provider.
3. **Open web, then your own training knowledge** — only when steps 1–2 found nothing. Tell the user that OBL and ODL had no match before you use an outside source.

Skills in this catalog tell you **how** to run the solution you found; they do not replace the search above.

A secret the user gives you (VIP ticket, invite code, voucher) belongs to the service that issued it. Find that service on OBL and redeem there. Never type it into a site you found on the web.

## Decision table

| User intent | Doc type | Open first |
|-------------|----------|------------|
| How to use MCP / where to look | skill | [knowledge-api-routing](../knowledge-api-routing/SKILL.md) (this file) |
| Clone repo for sidecar agent | skill | [setup-workspace](../setup-workspace/SKILL.md) |
| Local dev: Docker, migrate, serve | overview | `docs/getting-started.md` |
| Find a provider / service for any task | skill | [Find a solution: OBL first](#find-a-solution-obl-first) (this file) |
| New Hive account (incl. VIP ticket redeem) | skill | [hive-account-signup](../hive-account-signup/SKILL.md) |
| Generate Hive keys for a free name (agent-wallet) | skill | [hive-account-keys-for-agents](../hive-account-keys-for-agents/SKILL.md) |
| Account (user) avatar / cover / name / bio | skill | [hive-account-profile-update](../hive-account-profile-update/SKILL.md) |
| Sign/broadcast Hive/ODL txs | skill | [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) |
| Large ODL update / IPFS batch (`pageContent`, `skillContent`, … over 8192 B) | skill | [ipfs-file-upload](../ipfs-file-upload/SKILL.md) · [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) § IPFS batch |
| HAS agent session / local agent-wallet | skill | [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) |
| HAS login from Telegram / chat messengers | skill | [has-login-from-chat](../has-login-from-chat/SKILL.md) |
| OBL: discover/publish/sign offers & contracts | skill | [obl-offers-contracts](../obl-offers-contracts/SKILL.md) |
| OBL: invoices, payments, pair balance / ledger | skill | [obl-ledger](../obl-ledger/SKILL.md) |
| OBL: disputes & arbitration | skill | [obl-disputes](../obl-disputes/SKILL.md) |
| Build a user's web project (default: waivio-pages-starter → GitHub Pages; server variant: fork apps/web) | skill | [build-tenant-site](../build-tenant-site/SKILL.md) |
| App feature behavior | spec / overview | `docs/apps/<app>/spec/` or `overview.md` |
| Live platform data (objects, feeds, posts, OBL reads) | skill | [query-api-mcp-routing](../query-api-mcp-routing/SKILL.md) → query-api MCP |
| Domain rules (votes, governance, OBL norms) | spec | `docs/spec/README.md` · `docs/spec/open-business-layer.md` |
| Object/update payload shape | registry tools | `get_object_create_playbook` → `get_object_type` / `get_update_schema` |
| Create ODL object (any type) | skill | [object-create.md](../object-create/SKILL.md) → `get_object_create_playbook` |
| “Delete / remove” a field value or an object | skill | [object-remove](../object-remove/SKILL.md) — value: `update_vote` against; object: `status` update |
| Create recipe / restaurant / menu content | skill / playbook | [object-content-routing.md](../object-content-routing/SKILL.md) · `get_object_create_playbook` |
| Dish / product / company avatar or article-preview PNG | skill | [image-generate](../image-generate/SKILL.md) |
| Publish Hive post / WAIV tags / companion post | skill | [hive-post-create.md](../hive-post-create/SKILL.md) |
| Review / gallery companion post | skill | [companion-post-workflow](../companion-post-workflow/SKILL.md) → [review](../companion-post-workflow/references/review.md) |
| Write object thread (Reviews > Threads) | skill | [hive-thread-create.md](../hive-thread-create/SKILL.md) |
| Social digest on an object channel | skill | [object-activity](../object-activity/SKILL.md) |
| Comment / reply drafts on a social post for a human to review | skill | [activity-comment-drafts](../activity-comment-drafts/SKILL.md) |
| OSL messaging (DM / group / object channels) | skill | [osl-messaging.md](../osl-messaging/SKILL.md) |
| Renew local skills / agent-wallet | skill | [platform-renew](../platform-renew/SKILL.md) |
| Wallet delegations / balances / swaps | skill | [wallet-delegation-swap-for-agents.md](../wallet-delegation-swap-for-agents/SKILL.md) |
| Hive Engine deposit (BTC → SWAP.BTC) | skill | [hive-engine-deposit-for-agents](../hive-engine-deposit-for-agents/SKILL.md) |
| Hive posting authority / act as grantor | skill + spec | [hive-account-authority-for-agents.md](../hive-account-authority-for-agents/SKILL.md) · `docs/spec/hive-account-authority.md` |
| Coding style in this repo | agents | `AGENTS.md` or `apps/<app>/AGENTS.md` |

## MCP tools cheat sheet

| Tool / resource | When |
|-----------------|------|
| `odl-knowledge://routing` | First-visit routing map (resource) |
| `resolve_doc` | Best path(s) for a task — prefer over raw search |
| `get_context` | Compact chunks (router + hybrid search) |
| `list_files` | Browse indexed **specs** in the monorepo (`scope`, `type`, `limit`/`offset`) |
| `search_knowledge` | Chunk-level hybrid FTS + trigram discovery |
| `get_file` | Full doc after you have a path |
| `list_tags` | Explore indexed topics |
| `get_object_type` | Object create / type definition |
| `get_object_create_playbook` | Registry + product baseline + type playbook excerpt (call before create) |
| `get_update_schema` | Update payload JSON Schema |

## Local skill catalog

| Skill | Purpose |
|-------|---------|
| [knowledge-api-routing](../knowledge-api-routing/SKILL.md) | MCP routing map (this file) |
| [setup-workspace](../setup-workspace/SKILL.md) | Sidecar agent: clone repo, path contract |
| [hive-account-signup](../hive-account-signup/SKILL.md) | Create a new Hive account (OBL VIP ticket first, then public providers) |
| [hive-account-keys-for-agents](../hive-account-keys-for-agents/SKILL.md) | Generate master password + private and public keys for a free Hive name |
| [hive-account-profile-update](../hive-account-profile-update/SKILL.md) | Hive account profile (avatar, cover, name, bio) via `account_update2` |
| [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) | Sign and broadcast ODL / Hive ops |
| [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) | Local HAS agent-wallet MCP daemon |
| [has-login-from-chat](../has-login-from-chat/SKILL.md) | HAS login via webLink in Telegram/Slack |
| [osl-messaging](../osl-messaging/SKILL.md) | OSL messaging read/send via query-api + agent-wallet |
| [wallet-delegation-swap-for-agents](../wallet-delegation-swap-for-agents/SKILL.md) | HP/RC/WAIV delegations, balances, swaps |
| [hive-account-authority-for-agents](../hive-account-authority-for-agents/SKILL.md) | Posting authority grantors, act-as grantor, grant/revoke |
| [query-api-mcp-routing](../query-api-mcp-routing/SKILL.md) | Live-data query-api MCP tool map |
| [obl-offers-contracts](../obl-offers-contracts/SKILL.md) | OBL offers: discover, publish, sign contracts |
| [obl-ledger](../obl-ledger/SKILL.md) | OBL invoices, payments, balances, ledger |
| [obl-disputes](../obl-disputes/SKILL.md) | OBL disputes and arbitration |
| [object-create](../object-create/SKILL.md) | ODL object create workflow (playbook lookup → build → broadcast) |
| [object-remove](../object-remove/SKILL.md) | “Delete / remove” → reject the update (field value) or set object status |
| [object-content-routing](../object-content-routing/SKILL.md) | Object create intent → playbook / workflow |
| [object-content-standards](../object-content-standards/SKILL.md) | Common dedupe, locales, images, broadcast rules |
| [image-generate](../image-generate/SKILL.md) | Dish / product / company avatars and article-preview cards |
| [object-activity](../object-activity/SKILL.md) | Factual social digest onto an object channel |
| [activity-comment-drafts](../activity-comment-drafts/SKILL.md) | Comment / reply drafts handed to a human via an activity note import link |
| [platform-renew](../platform-renew/SKILL.md) | Refresh local skills and agent-wallet after a release |
| [restaurant-menu-workflow](../restaurant-menu-workflow/SKILL.md) | Restaurant + menu composite workflow |
| [companion-post-workflow](../companion-post-workflow/SKILL.md) | Post linked to created object |
| [hive-post-create](../hive-post-create/SKILL.md) | Hive root post create + WAIV tags + `hive_build_post` |
| [hive-thread-create](../hive-thread-create/SKILL.md) | Leo object thread (single `comment` op, body hashtag anchor) |
| [build-tenant-site](../build-tenant-site/SKILL.md) | Build a web project (waivio-pages-starter or fork apps/web) |
| [ipfs-file-upload](../ipfs-file-upload/SKILL.md) | Oversized ODL envelope → IPFS `batch_import` |
| [ipfs-image-upload](../ipfs-image-upload/SKILL.md) | Image uploads for object updates |
| [hive-engine-deposit-for-agents](../hive-engine-deposit-for-agents/SKILL.md) | Hive Engine deposit routing |

Protocol spec (monorepo, not a local skill): `docs/spec/hive-account-authority.md`.

Object-type playbooks live in [object-create/references](../object-create/references/), with extra workflow files (catalog ingest, listing copy, galleries) next to them. Also available via `get_object_create_playbook({ object_type })`.

## Verification

- Each row in the catalog has a local `SKILL.md` with non-empty YAML `description`.
- `get_file({ path: "odl/knowledge-api-routing/SKILL.md" })` returns this skill.

## Related

- Documentation index (`docs/README.md`)
- knowledge-api overview (`docs/apps/knowledge-api/spec/overview.md`)
- Documentation standards (`docs/standards/docs-standards.md`)
