# Create person object

Agent playbook for ODL person object_create and updates.

Person or user profile.

## When to use / not

- **Use** when creating a new `person` on chain via `odl_build_object_create`.
- **Use** `odl_build_update_create` when the object already exists.
- **Not** for read-only queries — use query-api MCP.

## Product baseline fields

Call `get_object_create_playbook({ object_type: "person" })` for `required_updates` (product policy). Common baseline: `name`, `description`, `image` when supported — not a chain requirement.

`person` = a named human (even a solo consultant). **Not** a company, agency, studio, shop, consultancy brand, or product/team Instagram. Those are `business` even if the task said “list of persons.” Wrong type = stop.

## Identity

Author name + the specific book when this is an author job. Homonyms do not count as found. Fetch the **profile URL / slug they gave**, not a same-name search hit. Do not merge Scholar, news, or other slugs that share the name.

## Title

Who they are professionally. Not `Author`. Not awards-as-identity. Not `New York Times bestselling` / `acclaimed` / `award-winning`.

## Description

The **person / career**. Not a blurb of a triggering book. Not why they sit on a list.

**Fail and rewrite** if title or description contains: `this object`, `this profile`, `this listing`, `this record`, `supports authorship links`, `ODL`, `object_id`, `shortlist`, `outreach`, `added to this list`, `follower count`. List purpose stays on the list object.

## Website, socials, email

`website` = official site when it exists. Homepage socials → `link` HTTPS URLs. Public contact on that site → `email` (decode `[at]`). Placeholders skip. Do not scrape Instagram from the agent IP.

## LinkedIn (when the user gave an `/in/<slug>` URL)

1. Dedupe on name and that slug. Update if found.
2. Fetch **that slug**, not a homonym. On 404/private, ask for headline/role; do not pick a bio from web search.
3. `name` = display name, `title` = headline, `description` from summary or a factual role/education condensation. `identifier`/`link` for the profile URL. Occupation/Education `tagCategoryItem` from positions/schools. Skip empty About. Skip contact-enrichment endpoints.
4. Avatar — profile photo CDNs expire. Download, IPFS, `{ cid }`. Omit image if there is no photo.

## Field semantics

Supported updates (registry): status, image, name, title, description, imageBackground, parent, tagCategory, tagCategoryItem, website, link, email, identifier, …. Use `get_update_schema({ update_type })` for `value_kind`, `cardinality`, and `localizable`.

## Categories and tags (soft)

Registry `supposed_updates`:

- `tagCategory`: "Education", "Occupation", "Interests"

See [object content standards](../../object-content-standards/SKILL.md) for shop `category` vs discover tags.

## Locales

See [object content standards](../../object-content-standards/SKILL.md).

## Research and source hierarchy

- Prefer official or authoritative sources for factual fields.
- Omit unknown facts; do not invent prices, hours, or claims.
- Mark generated marketing copy as generated.

## Images

Photograph of the person's face. Not a company logo, book cover, or trailer thumb. Pad 1:1 white, IPFS `{cid}`. Do not generate a face unless asked.

## Special constraints

- Dedupe before create (search / `resolve_object`).
- Web-compatible `object_id` when product URLs matter.
- No duplicate object/user refs in one payload.
- Link from [`book`](book.md) via `author` when this person wrote one or more publications.

## Verification

After broadcast, `resolve_object` and confirm:

- `object_type` = `person`
- `fields.name`, `fields.description`, `fields.image` when in product baseline
- Type-specific fields you set

## Related workflows

- [book](book.md) — link as `author` ref. Do not ship a stub so a book can link.
- [Object content standards](../../object-content-standards/SKILL.md)
- [Object content routing](../../object-content-routing/SKILL.md)
- [Hive blockchain broadcast](../../hive-blockchain-broadcast/SKILL.md)
