# Create recipe object

Agent playbook for ODL recipe object_create — ingredients, servings, cook time, nutrition, categories, budget, images.

Recipe or cooking instructions with ingredients.

## When to use / not

- **Use** for standalone recipes with ingredients, cook time, and nutrition.
- **Use** `dish` when the primary goal is a restaurant menu item with price (no full recipe body).
- **Not** when a recipe object already exists — use `odl_build_update_create`.

## Product baseline fields

`name`, `description`, `image`, `ingredients` (from `get_object_create_playbook.required_updates`).

## Field semantics

| Update | Semantics |
|--------|-----------|
| `name` | Recipe title |
| `title` | Keywords, not a second name |
| `description` | 2–4 short paragraphs, ~80–150 words, the **dish**; no promo; no method dump |
| `ingredients` | Multi-value JSON array; clean strings, no brands (e.g. `🥚 2 eggs`) |
| `servings` | Compact yield (e.g. `4`, `4-6`, `Serves 6`) |
| `cookTime` | **Active** work only (mix, chop, assemble, fry/bake). Passive waits → Features, not cookTime |
| `calories` | kcal **per serving** |
| `budget` | `$` / `$$` / `$$$` from the shopping list |
| `nutrition` | Macros **per serving** only — no calories, no servings count |
| `featureList` | Optional highlights |
| `identifier` | External SKU or canonical id when known |
| `category` | Shop navigation categories (plural, e.g. `Breakfasts`, `Eggs`) |
| `aggregateRating` | `Rating` dimension when reviews exist |

Schema details: `get_update_schema({ update_type })`.

### Cooking instructions → post, not object

The `recipe` object holds **catalog metadata** (title, summary, ingredients, times, nutrition). Step-by-step directions belong in a **Hive post**, not in `description` or other object fields.

**Order of work:**

1. Create the `recipe` object on chain (`name`, `description`, `ingredients`, `image`, …).
2. Publish a companion post with the full cooking guide — numbered steps, techniques, tips, photos between steps.
3. Link the post to the recipe via `json_metadata.objects` (see [companion post workflow](../../companion-post-workflow/SKILL.md), [hive post create](../../hive-post-create/SKILL.md), and [recipe post format](../../hive-post-create/references/recipe.md)).

Keep `description` as a short appetizing summary for cards and search. Put the full “how to cook” narrative in the post body.

## Categories and tags (soft)

**Shop `category`** (navigation): 5–10 plural items relevant to the recipe (e.g. `Breakfasts`, `Eggs`, `Omelet Recipes`).

**Discover tags** (`tagCategory` / `tagCategoryItem` from `supposed_updates`):

- `Cuisine` — e.g. `asian`, `mediterranean`
- `Meal Type` — e.g. `breakfast`, `dinner`
- `Diet` — e.g. `vegetarian`, `gluten-free`

`tagCategoryItem.category` must match registry names exactly.

## Locales

Follow [object content standards](../../object-content-standards/SKILL.md). Localizable: `name`, `description`, `ingredients`, `servings`, `calories`, `budget`, `nutrition`, tag `value`. Not localizable: `cookTime`, `identifier`, refs. Confirm per field via `get_update_schema`.

## Research and source hierarchy

1. Authoritative cookbooks or official brand recipes when available.
2. User-provided source — cite in companion post if publishing.
3. Generated content — allowed for description/ingredients only when user requests; mark as generated.
4. Never invent nutrition or calories without a source — omit instead.

## Images

Avatar required `{ cid }`. Prefer dish studio 1:1 via [image-generate dish](../../image-generate/references/dish.md). If unavailable: crop a plated still, **pad** 1:1 white (do not crop the food to square), IPFS `{ cid }`. Do not ship a new recipe with no image.

## Creator

Named human → [`person`](person.md). Brand / kitchen / TV / show → [`business`](business.md). Identifier `value` = canonical HTTPS profile URL. Missing → create **full** person/business, then post. Description is the creator, not the triggering recipe, and **must not** restate website, email, address, or socials. Do not scrape Instagram from the agent IP.

## Special constraints

- Dedupe by name + key ingredients via search before create.
- Web-compatible `object_id` when linking from menus or sites.
- Do not paste full step-by-step instructions into object updates — use a linked post after the object exists.

## Verification

`resolve_object`:

- `fields.name`, `fields.description`, `fields.image`, `fields.ingredients`
- `fields.budget`, `fields.cookTime`, `fields.calories`, `fields.servings` when set
- Locale variants when bilingual

## Related workflows

- [Companion post workflow](../../companion-post-workflow/SKILL.md) — object linking add-on
- [Hive post create](../../hive-post-create/SKILL.md) — build + broadcast playbook
- [Recipe post format](../../hive-post-create/references/recipe.md) — body order for the cooking post
- [Restaurant menu workflow](../../restaurant-menu-workflow/SKILL.md) — when recipe is linked from a restaurant
- [Object content standards](../../object-content-standards/SKILL.md)
- [IPFS image upload](../../ipfs-image-upload/SKILL.md)
