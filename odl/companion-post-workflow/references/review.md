# Review / gallery posts

**Reviews → Posts** (Hive companion post) or **Photos gallery attach**. Not OSL Activity ([object-activity](../../object-activity/SKILL.md)), not a Leo thread ([hive-thread-create](../../hive-thread-create/SKILL.md)).

Listing/menu/hours → [restaurant](../../object-create/references/restaurant.md) / [restaurant-menu-workflow](../../restaurant-menu-workflow/SKILL.md).

Two stages. Finish Stage 1 before public prose. Do not broadcast until the user approves.

Do not scrape Instagram from the agent IP. Stop on `429`/`430`. No Tripadvisor HTML from the agent IP.

Sign as the Hive account running the job. Hive root posts: one per **5 minutes** per author.

**Video / reel / YouTube / TikTok / IG:** embed original media. Do not fake a site card.

**Article / text with no video embed:** do not hotlink OG/hero. Render a preview PNG via [image-generate article-preview](../../image-generate/references/article-preview.md), `ipfs_upload_image`, put `![](contentUrl)` **after the opening paragraph** (first markdown image = Waivio `thumbnailUrl`). Then the article URL.

Photos gallery attach: URL-first, do not duplicate Photos — [restaurant-gallery](../../object-create/references/restaurant-gallery.md) when the attach is on a restaurant.

## Stage 1

```
classification: gallery | review
source_type: independent | brand | sponsored_or_affiliate | unclear
language:
format: single | multi | not_applicable
objects:
  - name:
    type: product | business | restaurant | dish | person | service | brand | book | place | other
    role: primary | secondary | mentioned
    waivio_match: <object_id> | none
    match_basis: type+geo | official_url_or_handle | unique_name | none
    create: yes | no
    attach_post: yes | no
    notes:
source:
  creator:
  platform:
  date:
  url:
  profile_url:
```

**gallery** if no concrete evaluative claim (brand hype, tour, “looks good”). **review** if at least one concrete claim (taste, price, service, wait, portion, fit, durability, comparison, caution). Sponsored can still be a review.

gallery → Stage 2 is only `action: add_to_gallery` (Photos URL-first). No review article.

Match Waivio only when identity is confident (type+geo, official URL/handle, unique name). Do not guess chains/cities. Do not invent matches or ASINs. Do not create objects from incidental mentions. Do not create private-person objects.

create: primary+identified+no match → yes; secondary only if useful substance; mentioned → no.
attach_post: primary usually yes; mentioned no.

Record the creator’s claims; do not “correct” them against Waivio.

format **single** vs **multi** by whether two+ objects have their own claims.

## Stage 2 (review only)

Neutral voice. Report what the creator said. Do not invent balance. Preserve original title text; do not rewrite the source.

Title: one concise supported takeaway. Opening ~50–140 words.

Then video/reel: `[Embedded original media]`. Article: IPFS preview PNG, then article URL.

After that: remaining useful observations (single) or per-object sections for Primary/Secondary (multi). **Also mentioned** = names only.

Attribution: Originally published by [creator] on [platform] on [date]. Article sources keep the article URL after the preview. Do not repeat a media URL already embedded.

## Packing

1. Stage 1 for every candidate. Batch before Stage 2 when more than one.
2. `hive_build_post` + `wallet_broadcast` (`author` = named account; signer = running account). `json_metadata.objects` only where attach_post yes. One WAIV-eligible tag (`food` or `waivio`). No beneficiaries unless asked. Edits: `comment` only — never a second `comment_options`.
3. Verify `get_post` (thumbnailUrl = first `![]()`). If Hive has the image but Waivio does not, re-broadcast the same body so the indexer picks it up.
