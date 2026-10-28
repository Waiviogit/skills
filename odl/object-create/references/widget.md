# Create widget object

Agent playbook for ODL widget — embeddable widget configuration.

Embeddable widget configuration object.

## When to use / not

- **Use** for reusable UI widget configs referenced from pages/shops.
- Primary config updates are type-specific JSON — see `get_update_schema` for supported fields.

## Product baseline fields

`name`, `description`, `image` when supported.

## Field semantics

- Widget config updates define rendering — do not invent schema keys; use registry-supported updates only.
- `parent` links widget to site container.

## Categories and tags (soft)

Omit unless tagging for discover.

## Locales

See [object content standards](../../object-content-standards/SKILL.md).

## Research and source hierarchy

- Config from operator spec; no invented API keys.

## Images

Optional preview image via IPFS.

## Special constraints

- Validate JSON config against `get_update_schema` before broadcast.

## Verification

`resolve_object`: `fields.name` and config updates present.

## Related workflows

- [page](page.md) · [shop](shop.md)
