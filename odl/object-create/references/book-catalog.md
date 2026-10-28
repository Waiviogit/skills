# Book catalog ingest

Unique *works* on a `person` via `author`. Not every marketplace SKU.

Per-title field rules: [book](book.md). Authors: [person](person.md). Publisher: [business](business.md).

## When / not

Use to add an author's books, or a named publisher `business` + N titles they issued. Books already appear on author and publisher pages from `author` / `publisher` refs.

**Do not add Shop / menuItem lists on a publisher unless they explicitly ask.**

One known ASIN/ISBN that already matches a product page → [book](book.md). Never invent siblings or mutate check digits.

## Scope

Unique English works this person wrote, or unique English works **this imprint issued**. Never pad with biographies about them, other imprints, box sets, translations-as-separate-objects, or audio SKUs. Skip works already linked. Two marketplace titles for the same project = one work.

Publisher collection: honor cap N, **one print object per work**, **diversify authors** — do not drain remaining N on one novelist’s sequels while other imprint authors remain. Substitute another real title this imprint issued; do not pad. Skip sibling imprints. Details `Publisher` is the test, not ASIN prefix or the house marketing page.

A query-api hit on mainnet is not permission to write mainnet.

## Pipeline

1. **Work identity** — Open Library + Wikipedia / publisher series. One bibliographic work. First-publication year. Marketplace author stores are contaminated.
2. **Marketplace search** — title + author. Never scrape amazon.com HTML from the agent IP. Never guess ISBN/ASIN. Skip sponsored. Prefer print. Audio-only → one retry adding hardcover/paperback. Unusable after one retry → substitute.
   Same-edition Paperback/Hardcover/Kindle in that row’s variations = one group, several book objects **only if they asked for formats**. When they ask for N unique works, **one print object per work**. Do **not** put `option` / Format on a singleton SKU.
3. **Details** — from that product page. Empty `authors` is not unknown authorship. Match details `title` to the bibliography; wrong title → drop and substitute.
4. **Person first** — full profile ([person](person.md)), not a stub. Then book. Unattributed house books: omit `author`. Never attach a name-stub person.

## Copy gate (blocks broadcast)

N≥2: write copy for all titles first, then pack. Fail closed: title <12 chars, description <280, banned phrases, two books sharing first 80 chars of description, book `title` equal to author person `title`.

Banned: `this object`, `this listing`, `this entry`, `this record`, `kept in print`, `colophon`, `gadget edition`, `authorized English print edition`.

`title` = work premise/argument, never the author’s career. `description` = this **work**. Fail if the prose still fits another novel by the same author. `name` = jacket of the cover we upload — drop retailer SEO after a colon. `Fiction` alone is incomplete when Historical Fiction applies. `Tags` required when distinctive shared subjects exist. Never Category/Pros/Cons on a book.

## Cycle

Batch **reads**. Serialize **writes**. One work at a time. Pack until N or a real blocker, then **one** list of live book URLs. Hive 5 `custom_json` per block.
