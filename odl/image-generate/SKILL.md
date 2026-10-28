---
name: image-generate
description: >-
  Produce ODL avatars and article-preview cards: pick kind, edit from a source still,
  QA, then IPFS. Use when generating dish, product, or company avatars, or an article
  preview PNG for a Hive post.
---

# Image generate

Produce a square object avatar or an article-preview card. Kind comes from the **object type**, not from what the photo looks like. A restaurant logo that happens to show food is still **company**. A jar on a brunch table is still **product**. A plated special is **dish**.

Prefer **Grok Imagine** (`grok-imagine-image-quality`) for dish/product edits when xAI is available. Do not use PIL/numpy cutouts, rembg, or a raw YouTube/Facebook still as the avatar.

If Imagine / xAI is unavailable: use the **host built-in image generator** with the source still as the reference. Follow the kind reference for the landscape 1280×720 path. Do not require a named IDE plugin. Company stays official-mark / pad unless the user asked for a studio pass.

## When to use

- Object `image` needs a studio avatar (dish, drink, product, restaurant, business, shop).
- A Hive post about an article needs a preview PNG (not a hotlinked OG image).

## When not to use

- Upload an already-correct local file — [ipfs-image-upload](../ipfs-image-upload/SKILL.md).
- Gallery Photos rows that keep original HTTPS URLs — see [restaurant-gallery](../object-create/references/restaurant-gallery.md).

## Kinds — pick one, never mix prompts

| Kind | Objects | Source | Edit | Reference |
|------|---------|--------|------|-----------|
| **dish** | `dish`, `drink` | Plated still | Yes | [dish](references/dish.md) |
| **product** | `product` | Official packshot | Yes | [product](references/product.md) |
| **company** | `restaurant`, `business`, `shop` | Official logo or social avatar | Default **no** | [company](references/company.md) |
| **article-preview** | Hive post thumbnail | Article hero + metadata | Render card | [article-preview](references/article-preview.md) |

Wrong kind = omit or redo. Add a new kind as its own reference + a row here — never reuse dish or product prompts.

## Edit vs generate

Prefer **edit** when a source still exists. Request **1:1** and **1k**. Non-square output → re-edit, do not pad. Host `image_generate(aspect_ratio="square")` on edits often returns **1184×880**.

Save bytes immediately. Temporary CDN URLs expire. Never print API keys.

## Workflow

1. Pick kind (table). Read that reference **before** editing.
2. Source still (dish/product) or official mark (company). No still → omit `image` (company last fallback = Maps thumb already IPFS’d into Photos).
3. Edit with Imagine when that kind uses it and xAI is available. Else host generator per the kind reference. Local files only.
4. QA against that kind’s reject list. Re-edit once; second fail → omit (dish/product) or official mark as-is (company).
5. `image` = IPFS `{ cid }` via [ipfs-image-upload](../ipfs-image-upload/SKILL.md). Gallery may keep original HTTPS URLs.
6. Broadcast after user approval — [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md).

Do **not** store YouTube `hqdefault`. Do not ellipse-cutout.

## Verify

- Kind matches the object — prompt is that kind’s reference
- File is 1:1 (typically 1024×1024)
- Dish/drink: long vessels **horizontal** in the square unless a slight diagonal is needed to fit
- Dish sits **on** white (edge pixels near-white). White letterbox around a table photo fails
- Vessel/box/basket still present vs the still; ragged cutout → do not publish
- New `{ cid }` differs from the live avatar CID
- On-chain `image` is IPFS `{ cid }`
