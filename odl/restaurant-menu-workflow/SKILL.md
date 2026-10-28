---
name: restaurant-menu-workflow
description: >-
  Composite workflow — restaurant object, dishes/drinks, menu navigation, images, and
  dedupe. Use when creating a restaurant plus its full menu (dishes, drinks,
  navigation).
---

# Restaurant menu workflow

End-to-end workflow for a restaurant with menu items. Read [object content standards](../object-content-standards/SKILL.md) first.

## Concepts

- **`parent`** — usual ownership link from a menu item to its venue. Set `parent` on each `dish` / `drink` (or `recipe`) to the restaurant `object_id`.
- **`menuItem`** — navigation row linking to another object or web URL. It is **not** the dish payload (name/price/image live on the target object).
- **Dishes/drinks** — create as `dish` or `drink` (or `recipe` when full recipe content exists), with `price`, `description`, `image`, and `parent` → restaurant. Add `menuItem` / [`list`](../object-create/references/list.md) on the restaurant for menu navigation.

```text
restaurant
  └─ menuItem title=Menu, style=standard → Menu list
Menu list
  └─ listItem → section lists (Breakfast / Lunch / Kids / …)
section list
  └─ listItem → dish / drink
dish / drink
  └─ parent → restaurant
```

Never dump dishes as restaurant `menuItem` rows. Never Breakfast/Lunch/Kids as restaurant `menuItem`. Shop is a list of products + `menuItem` Shop — never `object_type shop`. One official page/PDF can `listItem` dishes directly on Menu.

`menuItem` requires `style`. Official menu URL goes on the list `website`, not `link_to_web` on the restaurant row.

Ids `{town}-{venue-slug}-{item-slug}` (same town prefix as the restaurant). Lists need name, description (source + currency), image (reuse restaurant avatar CID), parent, website. `sortCustom.exclude` is required (empty array).

Cocktails/mocktails = `drink`, not `dish`. Add-ons stay on the parent. Skip extra sauce/side objects and rotting wine SKUs. Kids included when printed. Omit unknown prices. Never invent allergens.

## Steps

1. **Dedupe restaurant** (google_place_id / website). Create/enrich listing if missing — [restaurant](../object-create/references/restaurant.md) must-write fields first.
2. **Create dishes/drinks** (`price`, `description`, **`parent`** → restaurant). **Omit `image`** until the avatar harvest.
3. **Section lists** + `sortCustom`, then parent Menu list.
4. **Restaurant `menuItem` Menu last.**
5. **Avatar harvest** last — [image-generate dish](../image-generate/references/dish.md): white seamless studio 1024 `{ cid }`. Host generator with the plate still is the fallback. Uncertain / no still → omit. Do not write the restaurant logo cid onto dish `image`. After a studio cid is live, vote against the old table still.
6. **Verify** — one Menu row; Menu children are section lists; child `parent` → restaurant; prices match source; drinks are drinks; dish `image` pixels sit on white 1024 when a still was found.

Source order: printed board / in-venue photo / current official PDF → official site menu (current page) → first-party order (Toast/Square) for missing prices → delivery apps last; skip if they disagree.

## Images

- Restaurant avatar: [image-generate company](../image-generate/references/company.md). Photos: [restaurant-gallery](../object-create/references/restaurant-gallery.md).
- Dish/drink: [image-generate dish](../image-generate/references/dish.md). No still or generator fail → omit. Never invent food. A menu of table-crop avatars = incomplete.

## Related playbooks

- [restaurant](../object-create/references/restaurant.md)
- [restaurant-listing-copy](../object-create/references/restaurant-listing-copy.md)
- [dish](../object-create/references/dish.md)
- [drink](../object-create/references/drink.md)
- [list](../object-create/references/list.md) — menu sections
- [recipe](../object-create/references/recipe.md) — when recipe-style content is required
- [image-generate dish](../image-generate/references/dish.md)
