# Recipe post format

Standalone cooking post. Useful even off the object page. Faithful to the source, organized as a practical recipe.

Object fields (ingredients, times, nutrition): [recipe playbook](../../object-create/references/recipe.md). Build + broadcast: [hive-post-create](../SKILL.md). Link the object: [companion-post-workflow](../../companion-post-workflow/SKILL.md).

Cooking steps go in this post, **not** in the recipe object's `description`.

## Order

1. **Title** — dish name, not SEO.
2. **Opening paragraph** — one short paragraph **before** media: what it is, prep style, distinctive traits, what was estimated. Do not repeat object Description.
3. **Primary image or video** immediately after opening. Prefer original source media.
   - LinkedIn: embed URL first (`https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:<id>` or `urn:li:activity:<id>`), then the canonical post URL on the next line. Post URL alone does not embed like YT/TT/IG.
   - **X:** `https://x.com/<handle>/status/<id>` — do not rewrite to twitter.com. Post must work if embed fails.
4. **Ingredients** — first-used order; quantities, units, prep, optionals. Estimate from frames/yield/cookware when missing. No false precision. Do not mark every estimated line.
5. **Method** — numbered steps; source sequence; combine tiny actions, do not reorder. Executable without rewatching. Times/temps/doneness. Optional steps marked optional. Action-oriented, not a transcript.
6. **Notes** — only if useful and not Ingredients/Method.
7. **Source & credit** — creator name; handle **without `@`**; profile URL; Waivio person/business `https://www.waivio.com/object/<creator_object_id>`. Do not repeat the video URL if already embedded. Estimation line after credit when needed.
8. **Recipe object last:** `Recipe: https://www.waivio.com/object/<object_id>`

## Fidelity

explicit source → visible → derived → estimate. Estimates for quantities, times, temps, servings, toppings, equipment. Cross-check against the whole recipe. Do not add culinary-practice steps the source skipped; optional if truly needed.

Never `@handle` in body text (Hive mention). URLs may contain `@` in the path.

English body even when the source is not. Not a transcript, review, creator bio, promo, or dump.
