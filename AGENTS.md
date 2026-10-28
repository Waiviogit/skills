# Agent instructions

This repo is an **ODL skill catalog**, not an application. Skills follow the [Agent Skills spec](https://agentskills.io/specification) and [Anthropic authoring practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices). Cursor layout notes: [Cursor skills](https://cursor.com/docs/skills). This file is the agent-facing companion to [README.md](README.md) ([AGENTS.md](https://agents.md/)).

Install:

```bash
npx skills add https://github.com/Waiviogit/skills
```

Do not put catalog skills in `.cursor/skills/` or `~/.cursor/skills-cursor/` (the latter is Cursor-internal).

## Layout

```
odl/<skill-name>/SKILL.md
odl/<skill-name>/references/   # optional, one level deep
odl/object-create/references/<type>.md   # type playbooks, not skills
```

`name` in YAML **must equal** the parent directory name.

## Frontmatter

Only `name` and `description` are required.

| Field | Rules |
|-------|--------|
| `name` | 1–64 chars; `a-z`, `0-9`, hyphens; no leading/trailing `-`; no `--`; no XML; no reserved `anthropic` / `claude` |
| `description` | 1–1024 chars; third person; **what** it does and **when** to use it; trigger keywords; no XML |

Do **not** set `disable-model-invocation` — this catalog should auto-attach from context. Optional spec fields (`license`, `compatibility`, `metadata`, `allowed-tools`) are unused unless a skill truly needs them.

Noun-phrase names (`object-create`, `hive-post-create`). Do not switch the collection to gerund (`creating-objects`).

## File names

Kebab-case everywhere: directories, `SKILL.md` folders, reference files (`service-offer.md`, `legal-document.md`, `book-catalog.md`).

**Data strings stay snake_case** when that is the on-chain identifier: `object_type` `service_offer`, `legal_document`, `service_request`. The file is still `service-offer.md`.

```markdown
| `service_offer` | [service-offer](references/service-offer.md) |
```

## Playbooks vs skills

Type field semantics live in `odl/object-create/references/<type>.md`. They are not separate skills (no YAML). Add a row to the table in [odl/object-create/SKILL.md](odl/object-create/SKILL.md). Do not grow that table with workflow files (catalog ingest, listing copy, galleries) — kebab reference next to the type, linked from the type playbook.

## Progressive disclosure

- `SKILL.md` body under **500 lines**. Agent is already smart; only add what it would not know.
- Put detail in `references/` and link **one level** from `SKILL.md`. No nested reference chains.
- Cross-skill links: relative paths, forward slashes only (`../hive-post-create/SKILL.md`). Never `scripts\helper.py`.
- One term per concept. No frozen tool counts or dated “as of” inventories. Network (`odl-testnet` / `odl-mainnet`) is asked in [hive-blockchain-broadcast](odl/hive-blockchain-broadcast/SKILL.md), not defaulted in other skills.

## Adding a skill

1. `odl/<kebab-name>/SKILL.md` with YAML `name` matching the folder.
2. `description` includes `Use when …`.
3. Catalog row in [odl/knowledge-api-routing/SKILL.md](odl/knowledge-api-routing/SKILL.md) (decision table and local skill catalog).
4. Verify: `name` == dirname; relative links resolve; no snake_case filenames under `odl/`.
