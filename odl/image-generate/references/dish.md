# Dish avatar

Image **editing**, not food generation. Transform the reference still into a professional restaurant-studio shot of the **same physical dish**. Change the photography, not the food.

Use this prompt verbatim on `grok-imagine-image-quality` **edits** (local still as `image`). HTTP `aspect_ratio: "1:1"`, `resolution: "1k"`. Do not rewrite it into a prettier-food brief.

```
TASK TYPE — IMAGE EDITING, NOT FOOD GENERATION

Transform the reference photo into a professional restaurant-studio image of the same physical dish.

Treat the food itself as protected subject matter. Preserve its visible physical structure and appearance as closely as possible. Improve the photography around it; do not regenerate the dish into a more ideal version.

Priority order

When instructions conflict, follow this order:

Identity and geometry of the exact photographed dish
Correct ingredients and serving vessel
Complete, useful avatar composition
Photorealism
Studio polish and attractiveness

Always sacrifice polish before sacrificing fidelity.

Preserve the exact specimen

Preserve the specific geometry of this individual dish, including its:

silhouette and overall shape
asymmetry and irregularities
folds, dents, bends, overlaps, and uneven edges
ingredient positions and relative proportions
thicknesses and layering
topping, garnish, piping, sauce, and cheese placement
doneness, browning, moisture, crumbs, and surface texture

Do not merely preserve the type of dish. Preserve the specific photographed instance.

Do not make buns rounder, pastries more symmetrical, piping neater, toppings more evenly distributed, patties more regular, cheese more dramatic, or ingredients more conventionally attractive.

Do not infer ingredients from what the dish appears to be. Use only visual evidence in the reference. Do not add, remove, substitute, rearrange, or reinterpret visible ingredients.

Viewpoint and reconstruction

Preserve the original camera viewpoint whenever practical.

Minor perspective correction or a small viewpoint adjustment is allowed only if it does not materially change the visible geometry of the dish.

If cropped or unseen areas must be reconstructed, extrapolate conservatively from visible evidence. Reconstruct only what is necessary for a complete image. Do not use reconstruction to redesign, beautify, or regularize the dish.

Output and composition

Create a square 1:1 restaurant-menu avatar.

Show the entire dish and complete serving vessel, with nothing cropped or touching the frame edges.

Default vessel orientation: **horizontal** (long axis left–right). Horizontal is easier to comprehend in a square. A slight diagonal is allowed only to win a little space so the whole vessel fits. Do not default to vertical / top-to-bottom for long platters.

Make the food visually dominant while keeping the full vessel visible. Center the presentation and use the square frame efficiently, with approximately 8–12% comfortable breathing room around the complete presentation.

Professional photographic treatment

Change the photography, not the food:

clean white seamless studio background
soft diffused professional lighting
accurate white balance
natural, appetizing color
realistic exposure and dynamic range
natural lens perspective
subtle realistic contact shadows
improved clarity and image quality
no props, people, furniture, extra tableware, or decorative background

Avoid plastic surfaces, excessive gloss, oversaturation, hyper-sharpness, artificial symmetry, exaggerated perfection, fake depth of field, or recognizable AI-food aesthetics.

Final test

The result should look as though the exact physical dish from the reference photo was carefully moved, unchanged, into a professional photography studio and photographed there.

Same physical dish. Same geometry. Same imperfections. Better photography.
```

Also keep: plate/bowl/cup as served; printed branding on cups/bags/bottles; never prompt “no text / no logo / no plate”.

Reject: regularized geometry, invented/rearranged ingredients, missing/garbled logos, food lifted off its plate, cropped vessel, leftover table/letterbox, invented vessel, white-bar padding around a table/wood/dark photo (the dish must sit on white, not the photo on a white canvas). Re-edit once; second fail → omit `image`.

Avatar `image` = IPFS `{ cid }` only.

If Imagine / xAI is unavailable: do **not** invent the plate. Use the **host built-in image generator** with the identified still as the reference image (same prompt above).

Many host tools ignore 1:1 and emit landscape (often **1280×720**). Prompt the dish (vessel + contact shadows) into the **central square**. Default ~middle **55%** of width. For **boards, trays, boxes, and other wide vessels**, use **40–45%** of width and say in the prompt that the **whole vessel must fit inside that middle square**. Left and right thirds empty seamless white. State the reference plating orientation (e.g. “long plate upper-right to lower-left”) so the model does not mirror it.

Then take the center 720×720. If that crop **cuts the vessel** but the field around the food is already **plain white** and the dish only touches the left/right crop edges: **extend the white canvas** to a square (keep the full vessel), then LANCZOS to **1024×1024**. Do **not** pad a real photograph that still has table, wood, or other background — those stay crop-or-reject. If the crop keeps the whole vessel, do not pad; LANCZOS 720→1024.

Square avatars: default **horizontal** (long axis left–right). Diagonal only to win a little space. Do not stand long platters vertical.

**Vessel integrity:** if the serving vessel, box, basket, tray, or wrapper is missing, cut away, or ragged vs the still, do not publish. Keep the live avatar and report it.

**White gate before IPFS:** sample edge pixels (corners + mid-edges). Fail if they are not near-white, or if the photo runs off the canvas (no 8–12% breathing room / full-bleed table). Padding a table still with white bars is not a pass.

Inspect against the reject list, then `ipfs_upload_image` → `{ cid }`. Before broadcast, the new CID **must differ** from the live dish `image` CID. Same CID = skip (filename-cache republish).

If the host generator is also unavailable: pad **only** an official transparent cutout or a still already on plain white. Do not pad table/wood photos. No usable still → omit `image`.

Live avatar whose **pixels do not match** the menu item: `update_vote` **against** it (no replacement). Do not Imagine shrimp into chicken/paneer.

Competing live avatar (table still, grey floor, wrong orientation): after publishing the studio `{ cid }`, `update_vote` **against** the old image as the account that can be decisive. Do not vote against a brand-new create from this job.
