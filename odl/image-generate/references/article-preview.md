# Article preview card

Given an article URL, generate a clean article-preview PNG for Markdown embeds.

Design: **white**, neutral, distinct from the publisher’s page. Preserve the full hero whenever practical. Never stretch. Avoid cropping.

Instagram/TikTok/YouTube: embed original media; do not fake a site card. Do not hotlink OG/hero as the post thumbnail. Do not screenshot the live page.

## Extract

Fetch article HTML. Prefer structured metadata / meta tags.

Hero: `og:image` → `twitter:image` → first large image in `<article>` or `<main>`.

Reject: logos, icons, sprites, tracking pixels, ads, avatars, longest side under 400 px.

Download and **measure** the chosen hero.

Extract if available: publication, title, author, date, canonical URL, domain. Dates as `Nov 10, 2023`. Never invent missing metadata.

Favicon/small logo only if subtle. Plain publication-name text is always acceptable.

## Orientation

- horizontal: width / height > 1.2
- vertical: height / width > 1.2
- otherwise square-ish

## Horizontal

Flexible card. **Do not force 4:3.** Width ~**1200 px**. Full hero at full width, original aspect. Metadata in a **separate white block below**. Subtle fade at the image edge only — **no text in the fade**. All metadata on fully white. Do not shrink the image for type — make the card taller. Do not clip the last line.

Leave extra white under the domain: target **48–64 px**, floor **40 px**. A small extra band is correct.

**Hard rule:** measure the rendered metadata block before export. If clipped or pad < 40 px, increase canvas height and re-render.

## Vertical

Prefer ~**3:4** (900×1200). Full-width hero, aspect preserved. White gradient from the bottom; metadata in the readable lower fade; fade as low as practical.

If metadata cannot fit: complete image above, compact white block below (same as horizontal). Do not crop a taller-than-3:4 hero just to hit 3:4.

## Square-ish

Most natural of square / horizontal / vertical. Preserve the image. Minimize unused space.

## Metadata

publication → title → author · date → domain. Compact, grouped. Preserve the original title. Wrap; moderate font cut for long titles; truncate last resort. No excerpts. No `EXTERNAL ARTICLE`.

White background. Near-black primary, gray secondary. Neutral sans-serif. Do not imitate publisher fonts, colors, nav, or page chrome.

## Render

HTML/CSS → PNG (Playwright/Puppeteer or host browser). Viewport = canvas. No browser chrome, extra margins, or scrollbars. Do not download a browser unless the user confirms.

After screenshot, measure last ink in the metadata region. Grow height until pad is 48–64 px.

Hive/Waivio: `ipfs_upload_image` → `![](contentUrl)` in the post body; article URL separate.

Return: PNG; original URL; canonical; metadata; hero URL and dimensions; orientation; output size/layout; warnings.
