# Create html object

Agent playbook for ODL html — raw HTML content via htmlContent update.

HTML embed object.

## When to use / not

- **Use** for controlled HTML snippets embedded in a site.
- **Not** for full tenant sites — see [build-tenant-site.md](../../build-tenant-site/SKILL.md) (prefer `apps/web` or waivio-pages-starter).

## Product baseline fields

`name`, `description`, `image` when supported.

## Field semantics

| Update | Semantics |
|--------|-----------|
| `htmlContent` | Primary HTML body (semantic baseline) — sanitize; no script injection unless explicitly allowed by product; large body → IPFS `batch_import` when `requiresIpfsBatch` |
| `parent` | Site container |

## Categories and tags (soft)

Not supported — omit.

## Locales

Separate objects or locale rows for translated HTML when needed.

## Research and source hierarchy

- HTML from approved template or operator-provided markup only.

## Images

Not typical; assets embedded in HTML should use IPFS URLs.

## Special constraints

- Do not embed untrusted third-party scripts.

## Verification

`resolve_object`: `fields.htmlContent` renders expected structure.

## Related workflows

- [page](page.md)
- [build-tenant-site.md](../../build-tenant-site/SKILL.md)
