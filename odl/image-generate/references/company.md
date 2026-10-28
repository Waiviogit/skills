# Company avatar

**Not a dish. Not a product.** Company `image` is the official mark.

Default — **no Imagine**: official site raster if it squares (aspect ≲2.5:1), else official social avatar as-is, else Maps thumb already IPFS’d into Photos. LANCZOS 1024. `ipfs_upload_image` → `{ cid }`. Do not invent a brand.

Imagine is **off** unless the user asks for a studio/logo pass. Then this prompt — never dish or product.

```
IMAGE EDITING — identity mark, not a product photo and not food.
Preserve this exact logo / wordmark / brand avatar from the reference.
Do not invent, redraw, restyle, recolor, or “improve” the brand.
Preserve visible text, letterforms, spacing, icon geometry, and color exactly.
Square 1:1. Center the complete mark with 8–12% breathing room.
If the source is already a logo on transparency or white, keep a bright pure-white seamless background.
Do not turn a logo into a storefront, a plated dish, or a packaged product.
Do not add taglines, seals, shadows-as-floor, people, or scenery.
Same mark. Different photographer only if the source is a photo of signage; if the source is a flat logo file, keep it flat.
```

QA: same letters and icon as the source. Reject a new lockup, a food plate, or a jar. Second fail → ship the official mark as-is.
