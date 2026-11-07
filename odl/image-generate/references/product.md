# Product avatar

Edit an official packshot. Do not rewrite this into a prettier-product brief. HTTP `aspect_ratio: "1:1"`, `resolution: "1k"`. Non-square → re-edit, do not pad. Downscale huge packshots (max side ~1536) before edit.

```
OUTPUT — HARD REQUIREMENT: Create a square 1:1 image, composed natively as a square product avatar. Do not output landscape or portrait.
Create a photorealistic professional studio photograph of the exact physical product shown in the reference photo.
Instance fidelity — highest priority
Preserve this specific photographed product, not merely the model, category, or type of product it represents. Someone comparing the original and final images should recognize it as the same physical item.
Preserve its distinctive silhouette, geometry, proportions, dimensions, asymmetry, surface shape, edges, corners, seams, folds, dents, scratches, wear, manufacturing irregularities, material texture, transparency, gloss, reflections, color variations, and the precise arrangement of visible components.
For packaged or branded products, preserve the exact packaging design visible in the reference, including label placement, logos, typography, printed graphics, color blocks, windows, caps, lids, closures, stickers, seals, and other identifying visual features.
Preserve visible text exactly whenever it can be reliably read from the reference. Do not invent, rewrite, autocorrect, translate, simplify, or replace branding, product names, numbers, symbols, or label text. If text is unclear or unreadable, reproduce its visual appearance conservatively rather than hallucinating specific wording.
Do not beautify, redesign, normalize, or manufacture an idealized version of the product. Do not make packaging straighter, surfaces cleaner, shapes more symmetrical, labels more perfectly aligned, corners sharper, materials glossier, colors richer, or the object more conventionally attractive unless those characteristics are supported by the reference.
Do not infer features from what you think the product should look like. Reproduce only features supported by the reference image. Do not add, remove, substitute, rearrange, repair, complete, or reinterpret visible components, branding, accessories, attachments, contents, or packaging.
Change the photography, not the product
Professionalize the photographic conditions around the product—background, lighting, exposure, white balance, framing, perspective, clarity, and image quality—while keeping the physical product faithful to the reference.
Preserve the reference camera viewpoint whenever practical. Minor perspective correction or a modest viewpoint adjustment is allowed when useful, but instance fidelity takes priority over achieving a standardized camera angle.
Do not expose sides, surfaces, labels, openings, interiors, connectors, or product details that are not reasonably supported by the reference.
If cropped or unseen areas must be reconstructed to produce a complete image, extrapolate conservatively from visible evidence. Reconstruction must continue the existing physical structure and packaging design rather than inventing, redesigning, or improving it.
If the reference contains multiple pieces that clearly belong to the product as sold or presented—such as a bottle and cap, device and attached cable, container and lid, paired items, or included accessories—preserve their identity, relative scale, orientation, and arrangement unless a small adjustment is necessary to fit the square composition. Do not introduce accessories that are not visible.
Composition
Show the entire product and all intentionally included components, with nothing cropped or touching the frame edges.
Make the product visually dominant. Center the presentation and use the square canvas efficiently, leaving approximately 8–12% breathing room around the complete product without excessive empty space.
Maintain the product’s natural orientation unless the reference clearly shows it positioned unusually. Do not rotate, stand upright, flatten, unfold, open, close, or otherwise reconfigure the product simply to make it look better.
Professional studio treatment
Use:
clean bright pure-white seamless background (not gray, cream, or off-white)
soft, diffused professional studio lighting
accurate white balance and faithful product color
realistic exposure and dynamic range
natural lens perspective
small, subtle realistic contact shadows (keep them; do not remove and do not enlarge into a gray floor)
controlled, physically plausible reflections on glossy, metallic, glass, or transparent surfaces
crisp photographic detail without artificial sharpening
no props, hands, people, furniture, decorative elements, shelves, scenery, or unrelated objects
Maintain authentic material appearance and natural imperfections. Glass should look like glass, metal like metal, plastic like plastic, paper and cardboard like paper and cardboard, fabric like fabric, and so forth.
Avoid plastic-looking reconstruction, excessive gloss, oversaturation, artificial symmetry, exaggerated perfection, fake reflections, fake transparency, fake depth of field, distorted typography, invented branding, or recognizable AI-generated product aesthetics.
Final test
The result should look as though this exact physical product was removed from its original environment, left physically unchanged, placed into a high-end commercial photography studio, and professionally photographed.
Same product. Same packaging. Same physical details and imperfections. Different photographer.
```

Reject garbled labels, invented text, regularized jars, leftover table, or a product rotated/stood upright vs the still. Re-edit once; second fail → omit.

If corners are gray (RGB under ~240), photography-only second pass: keep the exact product; brighter pure white; keep the small contact shadow. Do not regenerate the product.

Shop avatars: `image` = IPFS `{ cid }` only. Gallery/Photos may keep original HTTPS URLs.

If Imagine / xAI is unavailable: host built-in image generator with the packshot as reference (same prompt). If the tool emits landscape (often 1280×720), compose the product in the central square on seamless white, center-crop that square, LANCZOS to 1024×1024. Else pad the official packshot 1:1 with white (never crop the product) and IPFS. No packshot → omit.
