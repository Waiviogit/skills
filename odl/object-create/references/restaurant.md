# Create restaurant object

Agent playbook for ODL restaurant — hours, geo, address, menuItem navigation, tag categories.

Restaurant or dining venue.

## When to use / not

- **Use** for a dining venue with address, hours, and menu navigation.
- **Not** for a single menu item — use `dish` / `drink` / `recipe`; set `parent` on the menu item to this restaurant's `object_id`.
- **Not** when venue already exists — update or link instead.

## Product baseline fields

`name`, `description`, `image` when supported (product policy).

## Field semantics

| Update | Semantics |
|--------|-----------|
| `identifier` | `{ type: "google_place_id", value }` — **dedupe key**. Missing place id = incomplete |
| `workHours` | Structured hours from Maps/official only — do not guess |
| `address` | Street address from Maps/official; verify against maps |
| `geo` | Maps place lat/lng only. Never Nominatim / OSM / address-string geocode |
| `telephone`, `email` | Phone from Maps/official. Email from the official-site harvest (home/contact/about). Skip noreply/placeholders |
| `website` | `{ title: host without www, link }`. Never “Official site” / “Website” |
| `link` | Every official social including icon-only hrefs. `value` is the handle when one exists — never a full URL. Official `profile.php?id=<digits>` with no vanity slug: pack those digits |
| `button` | When the official site has Order / Pickup / Reserve. Full URL; `title` is the visible label — [restaurant-button-titles](restaurant-button-titles.md). Site CTA with zero buttons = incomplete. Phone-only pickup with no Order link: skip |
| `menuItem` | **Navigation row** — `title` + `link_to_object` or `link_to_web`; not dish/drink payload |
| `price` | Maps `priceLevel` when present (average band, not per-item) |
| `listItem` | Direct ref to a child object, or to a [`list`](list.md) section that groups dishes/drinks |
| `parent` | Chain or group parent when applicable |
| `image` | Always `{ cid }` **1024×1024**, mark **centered** on white. Ranked: official square raster → this-venue social avatar → pad-to-square. Never a live Google URL. Sibling-city IG/FB is a `link` only. Graph default silhouette is not a mark. Company mark: [image-generate company](../../image-generate/references/company.md) |
| `imageGalleryItem` | Album Photos: **official HTTPS `url` only** — [restaurant-gallery](restaurant-gallery.md). Maps thumbs expire: skip them in Photos |
| `aggregateRating` | Maps `rating` (0–5): dimension `Value`, then `rank_vote` `round(rating/5*10000)`. No rating → skip vote. Missing the field when Maps had a number = incomplete |

Menu items usually declare the restaurant on the **child** object: set `parent` on each [`dish`](dish.md) / [`drink`](drink.md) to this restaurant's `object_id`. Use `menuItem` / `listItem` on the restaurant for navigation and section layout.

## Copy (mandatory)

Before any `title` or `description`: [restaurant-listing-copy](restaurant-listing-copy.md) verbatim. Writer’s LLM + web search. Never an image model. Fail QA → rewrite, do not publish. After create, `resolve_object` winning `description`. One-paragraph directory blurb = vote **against** that row and republish copy-skill body.

## Must write on create

`identifier`, `geo`, `address`, `workHours`, `telephone`, `website`, `email` (when a visible site inbox exists), official `link`s, `button`s when the site has CTAs, Cuisine `tagCategoryItem` from Maps types when a cuisine noun exists (features-only = incomplete), `image` `{ cid }` 1024, Photos HTTPS, Value rating when Maps had stars. Object id `{town}-{venue-slug}` (e.g. `agz-hungry-bear-diner`), not a spelled-out city prefix.

## Create loop

1. Listing extract (placeId, geo, hours, phone, rating, thumb). Search Hive + query-api by placeId and website.
2. One site harvest: email, socials, buttons, official photos, logo. Do not scrape Instagram from the agent IP.
3. Copy skill → title/description/tags.
4. `object_create` with the must-write fields above.
5. Menus only when the job named a menu — then [restaurant-menu-workflow](../../restaurant-menu-workflow/SKILL.md).

Town / area dump: [place-import](place-import.md) first. One pin per placeId. Filter neighbor bloat.

## Categories and tags (soft)

**Discover tags** (`supposed_updates`):

- `Ambience`, `Service`, `Food`, `Value` — `aggregateRating` dimensions
- `Cuisine`, `Features`, `Good For` — `tagCategory` keys

Use canonical category names only.

## Locales

Translate `name`, `description`, `menuItem.title`, tag `value`. Keep `geo`, `telephone`, `website`, `link_to_object` unchanged across locales.

## Research and source hierarchy

1. Official restaurant website or Google Maps verified listing.
2. Delivery platforms (cross-check hours/address).
3. Omit unverified hours or phone — do not guess.

## Images

- Avatar: official mark, 1024×1024 IPFS `{ cid }` — [image-generate company](../../image-generate/references/company.md).
- Photos gallery: official HTTPS URLs — [restaurant-gallery](restaurant-gallery.md). Avatar-only with no Photos = incomplete.
- Menu dish images belong on `dish`/`drink` objects.

## Special constraints

- **`menuItem` is not the dish/drink** — create `dish`/`drink` first with `parent` → this restaurant, then add navigation rows.
- See [restaurant menu workflow](../../restaurant-menu-workflow/SKILL.md) for full composite flow.
- Dedupe by name + address + website.

## Verification

`resolve_object`:

- `fields.name`, `fields.address`, `fields.workHours`, `fields.geo` when set
- `fields.menuItem` entries resolve to existing objects
- Sample menu `dish`/`drink` children have `fields.parent` pointing at this restaurant
- Contact fields match source

## Related workflows

- [Restaurant listing copy](restaurant-listing-copy.md)
- [Restaurant gallery](restaurant-gallery.md)
- [Restaurant button titles](restaurant-button-titles.md)
- [Place import](place-import.md) — town dump
- [Restaurant menu workflow](../../restaurant-menu-workflow/SKILL.md)
- [list](list.md) — menu sections (Appetizers, Drinks, …)
- [dish](dish.md) · [drink](drink.md) · [recipe](recipe.md)
