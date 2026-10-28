# Create book object

Agent playbook for ODL book — metadata, authors, publisher, commerce.

Book or publication with metadata, authors, and commerce.

## When to use / not

- **Use** for a book or publication with bibliographic metadata.
- **Use** `odl_build_update_create` when the book already exists.
- **Not** for read-only queries — use query-api MCP.

## Product baseline fields

`name`, `description`, `image` (from `get_object_create_playbook.required_updates`).

## Field semantics

| Update | Semantics |
|--------|-----------|
| `name` | Jacket / canonical published title. Keep a *real* subtitle. Drop retailer SEO after a colon. Same on format siblings. |
| `title` | Compact ~two-line subject/premise/**argument**. Complements `name`. Attribute the author's case; do not state a contested argument as fact. |
| `description` | Original encyclopedia-style prose, 3–5 short paragraphs of **this** work. Never marketplace/publisher copy. Never “this object/listing/record.” Neutrality = attribution (`the author argues`). |
| `author` | Object ref(s) to [`person`](person.md) — multi-value. Create the person first. Do not attach a stub. |
| `publisher` | Object ref to [`business`](business.md) (imprint). Reuse. Not `shop`. No POD shells. |
| `identifier` | `{type,value}` from a **product page**: ISBN-10 (10 chars only), ISBN-13, ASIN. Never guess. |
| `datePublished` | First publication of the **work**. Do not overwrite with a reprint date. |
| `inLanguage` | `English` (not `en`) unless schema forces BCP-47. |
| `printLength` | Page count as a **string** (`"540"` not `540`). |
| `productWeight` / `size` | From **this** format’s product page. Omit ebook weight/size. Omit marketplace placeholder `2.31 pounds`. |
| `option` | Exactly **one** Format on this object: Paperback, Hardcover, or Ebook. Other formats are sibling `book` objects with the same `productGroupId`. |
| `productGroupId` | Marketplace parent ASIN or `{author-slug}-{work-slug}`. |
| `price`, `compareAtPrice` | This format’s page only. |
| `category` | Bookstore Departments/Sections; multiple OK. Not tautological `Books`. |
| `website` | `{title: host, link: product URL}`. `title` is the host label. No affiliate tag unless asked. |
| `image` | Cover `{cid}` after pad-to-square with **white margins (never crop)**. Not an HTTPS URL. |

Schema details: `get_update_schema({ update_type })`.

### Linking authors

`author` is an **object ref** to `person` objects (`applies_to: person`). Do not put author names only in `description` when a `person` profile exists or should exist.

1. Dedupe / create each author as [`person`](person.md) (`name`, `description`, `image` from source).
2. Create or update the `book`.
3. Add `author` updates with each author's `object_id` (multiple authors = multiple `author` rows).

```text
person-jane-doe
person-john-smith
  └─ book-example
        └─ author → person-jane-doe
        └─ author → person-john-smith
```

`author` refs are not localizable — translate names on the `person` object instead.

## Copy quality (fail = rewrite)

Name = jacket, not marketplace SEO colon-tail. Title + name give this work’s premise without repeating the title. Description explains **this** work — distinctive setting/institution/event and living-strand role when sources name them. Fail if the last paragraph is SKU packing (ASIN, ISBN, “this listing”); if independent sources name a distinctive setting and the description omits all of them; if the prose would still be true of another novel by the same author; if critic-voice is the spine. Argumentative nonfiction: state the case and attribute it. Fiction: premise/conflict without major spoilers.

`category` = every useful bookstore shelf. `Fiction` alone is incomplete when Historical Fiction applies. `Tags` = shared discovery hashtags for this work’s subjects — not character names. Never Category/Pros/Cons on a book (those Tag Categories are **business** only).

Photos album — extra product pictures as HTTPS `{album: Photos, url}`. Album row first. Do not IPFS gallery.

## Categories and tags (soft)

**Discover tags** (`supposed_updates`):

- `aggregateRating`: `Rating` — stars = `rank_vote` `round(sourceStars/5*10000)` on that field. No source score → field only.
- `tagCategory`: `Tags`
- `category`: bookstore shelves, not tautological `Books`

## Locales

Translate `name`, `description`, `title` on the book. Author display names live on linked `person` objects.

See [object content standards](../../object-content-standards/SKILL.md).

## Research and source hierarchy

1. Publisher site, ISBN databases, or library catalog for metadata.
2. Official author pages for biographical `person` fields.
3. Omit unknown ISBN, page count, or publication date — do not invent.

## Images

Cover image on the book (IPFS). Author portraits belong on `person`, not duplicated on the book unless a cover composite is intentional.

## Special constraints

- Dedupe by `identifier` (ISBN/ASIN) or work title + author before create.
- Create `person` authors before `author` refs on the book.
- One bibliographic work; one `book` object per format ASIN in the chosen edition.
- Author catalog / many titles → [book-catalog](book-catalog.md) first.
- No duplicate object refs in one payload.

## Verification

`resolve_object`:

- `fields.name`, `fields.image` when set
- each `fields.author` ref resolves to `object_type` = `person`
- `fields.identifier` matches source when set

## Related workflows

- [person](person.md) — author profiles
- [business](business.md) — publisher imprint
- [book-catalog](book-catalog.md) — many titles on one author/imprint
- [Object content standards](../../object-content-standards/SKILL.md)
