# Place import

Import a town or area of restaurants / dining venues onto ODL from one structured listing dump. Bulk place create, not a single restaurant research pass.

Per-venue fields after import: [restaurant](restaurant.md). Copy: [restaurant-listing-copy](restaurant-listing-copy.md).

## When to use

- User asks to pull “all restaurants in X” (or cafes/venues) onto Waivio/ODL.
- A listing API already returned name, address, hours, phone, website, geo, place id.

## When not to use

- One named restaurant with a human still → [restaurant](restaurant.md) + [image-generate company](../../image-generate/references/company.md).
- Object already exists → `odl_build_update_create` only.
- User has a dedicated Maps MCP/key they told you to use → use that, not a paid catalog.

## Pull (fewest billed units)

1. Prefer one keyword+location search that returns **full place records** (name, address, geo, phone, website, hours, categories, place id).
2. **One query, one location.** Do not pass an array of search terms. A second `cafe` pass overlaps and double-bills.
3. Set `max_results` to cover the town. Charged **per returned row**, not per cap. Skip a 10-row probe when they asked for the full set.
4. Maps usually returns ~120 unique `placeId`s per search even with a 300 cap.
5. Save the JSON locally before mapping.

## Map every paid field

| Listing | ODL update | Notes |
|---------|------------|-------|
| `title` | `name` | Required |
| `description` | `description` | Source prose only |
| `address` | `address` | Omit if no postal (`street`, `locality`, `postal_code`, `country` required) |
| lat/lng | `geo` | `{latitude, longitude}` |
| `phoneNumber` | `telephone` | `{value}` |
| `website` | `website` | `{title: host, link}` |
| `openingHours` | `workHours` | Plain text, one weekday per line |
| `priceLevel` | `price` | Average band |
| `placeId` | `identifier` | `{type: "google_place_id", value}` — **dedupe key** |
| `types` | Cuisine `tagCategoryItem` | Drop generic Restaurant/Takeout/Hotel/Golf |

Object id: `{3-letter}-{slug}`. Collisions get `-2`.

**Images (listing thumbs):** Maps often returns one `thumbnailUrl` per row. Those Googleusercontent URLs expire — **download immediately**, then IPFS. Do not hotlink.

1. Skip streetview stubs and files under ~4 KB.
2. Center-crop to 1:1, max 1024 (restaurant `image` avatar rule). Company mark: [image-generate company](../../image-generate/references/company.md).
3. `ipfs_upload_image` → `{ cid }`.
4. **One pin per venue** unless a later photos scrape actually returns more stills (those go to Photos — [restaurant-gallery](restaurant-gallery.md)).
5. Persist `object_id → cid` so a retry does not re-upload.

## Filter

Skip: hotel/ski-resort **property** listings (keep named dining rooms), golf-course listings, duplicate `placeId`, venues already on-chain (place id or name+street).

## Publish

One venue at a time: `odl_build_object_create` → broadcast → Hive `get_transaction` → append to the manifest → next. Pack **that venue's** events into `custom_json` ≤ 8192 B. Do not one-process 100 creates; a timeout then duplicates or drops the tail.

Manifest: object_id, placeId, txids, skip reasons. Resume = skip placeIds already in it.

## Neighborhood follow-ups (“add Creekside”)

Do **not** fire a second billed search first. Diff the first dump:

1. Unique `placeId` already published?
2. Geo bbox for the neighborhood.

If the bbox venues are already on-chain, say so and stop. Neighborhood keyword locations often do not change the result set — check bbox before paying again.

## Pitfalls

1. Do not start a per-venue reviews scrape **during this dump**. Review-attached plates belong to a later menu job ([restaurant-menu-workflow](../../restaurant-menu-workflow/SKILL.md)).
2. Do not set restaurant `image` to a live Google CDN thumb. Download → square → IPFS `{ cid }`.
3. Incomplete addresses without a postal → geo only.
4. Accents in names slug to ASCII; check collisions (`Café` → `caf`).
