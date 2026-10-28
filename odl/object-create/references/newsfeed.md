# Create newsfeed object

Agent playbook for ODL newsfeed — feed configuration via newsFeed update.

News feed configuration container.

## When to use / not

- **Use** for curated Hive/social feeds on a site.
- Primary content: `newsFeed` config JSON (semantic baseline).

## Product baseline fields

`name`, `description`, `image` when supported.

## Field semantics

| Update | Semantics |
|--------|-----------|
| `newsFeed` | Feed source filters and layout config |
| `newsFilter` | Additional filters when supported |
| `parent` | Site parent |

## Categories and tags (soft)

Omit unless needed.

## Locales

See [object content standards](../../object-content-standards/SKILL.md).

## Research and source hierarchy

- Feed rules from operator; verify filter accounts/tags exist.

## Images

Optional feed icon via IPFS.

## Special constraints

- Do not include private account filters without authorization.

## Verification

`resolve_object`: `fields.newsFeed` or equivalent config.

## Related workflows

- [page](page.md) · [group](group.md)
