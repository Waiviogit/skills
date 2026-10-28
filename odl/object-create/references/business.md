# Create business object

Agent playbook for ODL business object_create and updates.

Business or brand entity with location and contact.

## When to use / not

- **Use** when creating a new `business` on chain via `odl_build_object_create`.
- **Use** `odl_build_update_create` when the object already exists.
- **Not** for read-only queries — use query-api MCP.

## Product baseline fields

Call `get_object_create_playbook({ object_type: "business" })` for `required_updates` (product policy). Common baseline: `name`, `description`, `image` when supported — not a chain requirement.

## Field semantics

Supported updates (registry): status, image, name, title, imageBackground, parent, tagCategory, tagCategoryItem, `listItem`, `menuItem`, ….

Group [`product`](product.md) objects via a [`list`](list.md) (Featured, Bestsellers, …) and link it from the business with `menuItem` or `listItem`.

Use `get_update_schema({ update_type })` for `value_kind`, `cardinality`, and `localizable`.

## Categories and tags (soft)

Registry `supposed_updates`:

- `aggregateRating`: "Overall"
- `tagCategory`: "Pros", "Cons"

See [object content standards](../../object-content-standards/SKILL.md) for shop `category` vs discover tags.

## Locales

See [object content standards](../../object-content-standards/SKILL.md).

## Publisher / imprint

If a book’s publisher is missing: Wikipedia + official site + contact/socials. Reuse imprint. No POD shells. After `website`, open homepage **and** About Us / Contact; add every official `link` shown. `link.value` = HTTPS profile URL (bare handles do not index). Website with no `fields.link` when those pages show socials = fail. Author-led imprint sharing the author site: copy those socials onto the business too. Avatar: website square first; else official social avatar. Do not pad a banner into image.

## Brand / DTC (from a product)

Missing or thin brand: create/enrich THIS business before attaching brand on the product. **No first-party site is not a skip.** Marketplace brand browse / store page is enough for `website`. Marketplace seller page is enough for a third-party merchant. Other catalog SKUs reuse this object. Gate: name, listing title (not “Brand”), listing description with no card fields, website `{title: company name, link}`, image `{cid}` (wordmark on white if no logo), social `link`s from the official footer when it exists. Contact/address/ids only from official pages. `featured` = triggering product. Overall rating dimension. Omit unknowns; do not invent HQ, year, phone.

## Threads

Title + description = listing copy (why this house). Never generate listing copy with an image model. No card fields, no aisle dump, no research voice. Last paragraph is still why-visit. Marketplace browse stays on `website` only. Description stays on the card — do not move it to a thread. Do not thread a single API/scraper record. Thread only interesting extra: synthesis from several web sources, a judgment the next agent needs, or a short coop note on this object.

## Research and source hierarchy

- Prefer official or authoritative sources for factual fields.
- Omit unknown facts; do not invent prices, hours, or claims.
- Mark generated marketing copy as generated.

## Images

Official/stable source → IPFS `{cid}` for avatar ([image-generate company](../../image-generate/references/company.md)). Gallery HTTPS ok. Create `imageGallery` before `imageGalleryItem` in initial create when using a gallery.

## Special constraints

- Dedupe before create (search / `resolve_object`).
- Web-compatible `object_id` when product URLs matter.
- No duplicate object/user refs in one payload.

## Verification

After broadcast, `resolve_object` and confirm:

- `object_type` = `business`
- `fields.name`, `fields.description`, `fields.image` when in product baseline
- Type-specific fields you set

## Related workflows

- [image-generate company](../../image-generate/references/company.md)
- [Object content standards](../../object-content-standards/SKILL.md)
- [Object content routing](../../object-content-routing/SKILL.md)
- [list](list.md) · [product](product.md)
- [Hive blockchain broadcast](../../hive-blockchain-broadcast/SKILL.md)
