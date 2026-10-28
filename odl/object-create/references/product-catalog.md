# Product catalog ingest

Bulk SKU ingest. Per-object fields: [product](product.md). Brand/merchant: [business](business.md). Avatar: [image-generate product](../../image-generate/references/product.md).

## Fetch

Remote catalog APIs first. Never amazon.com HTML or Tripadvisor from the agent IP. Do not scrape Instagram from this IP. Do not bulk-scan Shopify / many storefronts from the agent IP (`429`/`430` on unsigned bots). One shop ≤20 SKUs may use slow first-party HTTP.

Real browser only when HTML scrape fails (JS/login/Cloudflare): one session, many URLs, then close. Not for catalog JSON the page already has.

Full pack per listing that needs gallery/specs. Sibling prices only: product-details scrape, not a full pack. Thumbs are not studio avatars or gallery stills.

## All options

`variants[]` → one product per sellable SKU, shared `productGroupId` = parent id. Full pack each. Re-fetch per color when that SKU needs its own packshot/UPC/price.

## Copy

- `name`: Brand + line + this SKU’s option. No marketplace H1 stuffing.
- `title`: keyword extension of name. Do **not** repeat color/size already in name. Check every sibling, not just the seed.
- `description`: unique 4–5 paragraphs (≤2048). Never paste marketplace copy. Color in the last paragraph is OK.

## Brand

Same company → brand only (not manufacturer/merchant). Merchant only when the seller is a different company — create that merchant; do not skip for lack of a first-party shop URL. Missing or thin brand: create/enrich **before** attaching. **No first-party site is not a skip.** Marketplace brand page is enough as `website` `{title: brand name, link}`. Third-party sold-by: seller page as merchant `website`. Gate: name, listing title (not “Brand”), listing description with no card fields, website `{title: company name, link}`, image `{cid}`, social `link`s when a footer exists. No official logo → 1:1 wordmark on white. `link.value` = HTTPS profile URL. Contact/ids only from official pages. `featured` = triggering product. Overall rating dimension. Omit unknowns; do not invent HQ/year/phone.

Title + description = listing copy (why this house). No card fields, no aisle dump, no research voice. Last paragraph is still why-visit. Marketplace browse stays on `website` only. Do not move description to a thread. Do not thread a single scraper record. Thread only interesting extra (several web sources, a judgment, or a coop note).

## Fields

Copy when source has a value: ASINs + UPC/GTIN + MPN, price `$N.NN` (empty → leave existing), `option` `{category,value,position,image URL}`, `featureList` (skip Brand Name/Color/Manufacturer/Item Weight/Dimensions/UPC), departments = source breadcrumb names in order only, `productWeight`/`size` from **this** SKU only, Photos HTTPS (largest still), Buy button, website `{Amazon, dp URL}` when that is the listing.

Ratings: always create `aggregateRating` Quality and Value. First `rank_vote` only if this SKU’s source score is a number — vote Value, `round(score/5*10000)`. No source score → fields only. One number → Value not Quality.

Tags: always Category + Pros. Cons **only** with strong evidence. No reviews and no evidenced drawback → omit Cons items and omit the Cons tagCategory. Title-Case. **2–4** class tags — never aisle phrases. 3–5 Pros.

`featureList`: technical_details keys, or LABEL: rest. Never key `Feature`. Website is required when a product URL exists.

Avatar: first unique packshot for this SKU. Studio 1:1 via [image-generate product](../../image-generate/references/product.md); else pad 1:1 + `ipfs_upload_image`. Always `{ cid }`. Never marketplace `{ url }`. **One CID per look** — different-looking siblings each get their own cid.

## Merchant site (not Amazon)

A shop URL is a full pack. A factory/social demo with no marketplace URL: watch the media, match the official product page (model/MPN), create/enrich brand `business` first, then the SKU.

Omit `price` when the shop is quote-only. Omit `address` when `postal_code` is unknown. `telephone` value is `{ value: "<number>" }`.

Size/amount configurator with different SKU or price → sibling products, shared `productGroupId`, one Size `option` each. Drive live radios until URL+SKU+price change; do not invent SKUs. One SKU → omit option and productGroupId. Verify `get_object_options`.

Garbled studio labels → IPFS the official 1:1 packshot. Description: listing copy, not dose/ingredient dump. Pros: real labels only.

Source listing not English → dual-submit localizable text in the source locale **and** en-US. Create in the source locale, then `update_create` en-US.
