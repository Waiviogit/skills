# Restaurant Photos galleries

When Photos look like icons, broken Wix tiles, or missing interior/exterior/food/ambience. After listing ingest that dumped the first two site `<img>` tags.

## What belongs in `Photos`

Keep, in this order of usefulness:

1. Interior (dining room, bar, hall)
2. Exterior / storefront
3. Table with food
4. Ambience (patio, packed room, garden)

Avatar (`image`) can stay a logo. **Gallery is not the logo dump.**

**Town listing harvest:** official site only, same HTML pass as email + socials. Cap ~1–2 interior, 1 exterior, 1 ambience, 1 table. Official durable URL only. Do not IPFS Maps `thumbnailUrl`.

Google Images is a later source — more stills, especially food photos for dish avatars on a menu job. Do not run image search across a town list just to fill Photos.

## Reject (vote `against`)

| Junk | Why |
|------|-----|
| UI chrome (arrows, Artboard-*.png, favicons, `.ico`) | First `<img>` tags are often nav sprites |
| Brand leaf / wordmark / 40–180px PNG | Tiny logos are not photos |
| `static.wixstatic.com`, `parastorage`, unsigned Squarespace hotlinks | Often 403 |
| Wrong-venue / sister-brand tiles | Sister-city assets |
| Skinny strips (<200px on a side, or <10 KB) | Wordmarks, nav sprites |
| Location-map / “find us” tiles | Map graphics are not interior/food |

`imageGalleryItem` is multi. New rows do **not** replace old ones. Always `update_vote` `{ update_id, voter: <running-hive-account>, vote: against }` the junk.

## URL first; IPFS is only for 1024 avatars

Restaurant `image` and dish/drink `image` avatars **must** be IPFS `{ cid }` at **1024×1024**.

Gallery `imageGalleryItem` must keep a **direct official HTTPS URL**. Do **not** rehost gallery stills to IPFS. Do **not** put `cid` on a Photos row. A Photos tile whose `url` is an ipfs-gateway is incomplete — vote it off and add `{ album: Photos, url: <official> }`.

Before `{ album, url }`:

1. `GET`/`HEAD` is `200` + `image/*` (not HTML 202/403).
2. Origin is the venue’s own site (or their durable CDN). Reject `wixstatic` / `parastorage`, Maps `lh3` / `gps-cs-s`, Facebook/IG expiring CDNs, image-model CDNs.
3. Do **not** put `url` + `cid` together.

If HEAD is not a durable official image, **skip that photo**. Do not IPFS it into Photos.

## Ingest check (do this before attach)

Site scrapes often return the first two `<img>` tags — those are frequently icons.

1. Collect official durable URLs (venue site / their CDN). Not Maps `lh3`, not IG/FB expiring CDNs.
2. `GET`/`HEAD` `200` + `image/*`. Short side ≥ 400px, file ≥ 20 KB, looks like venue/food (not a sprite).
3. Attach `{ album: "Photos", url }` only. Never `ipfs_upload_image` for Photos.
4. Pack with any `against` votes on cid/ipfs gallery rows.

## Envelope

```json
{
  "action": "update_vote",
  "v": 1,
  "payload": {
    "update_id": "<existing-imageGalleryItem-id>",
    "voter": "<running-hive-account>",
    "vote": "against"
  }
}
```

Do not `update_vote` your brand-new create.
