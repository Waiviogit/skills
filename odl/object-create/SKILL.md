---
name: object-create
description: >-
  Create an ODL object on chain. Use when the user asks to create a recipe,
  restaurant, product, or any registered ODL object type.
---

# Object create (ODL)

Create a new ODL object. Field semantics live in the type playbook — open that file before drafting fields.

## When to use

- User asks to create a recipe, restaurant, product, or any registered ODL object type.
- You need field semantics, categories, images, or verification steps before broadcast.

## When not to use

- Object already exists — update that object; still read the type playbook for field semantics.
- Restaurant + full menu — [restaurant-menu-workflow](../restaurant-menu-workflow/SKILL.md).
- Unsure which type — [object-content-routing](../object-content-routing/SKILL.md).

## Workflow

1. **Pick the type** from the table below. Composite intents (restaurant + menu, companion post) go to the matching workflow skill, not this file.
2. **Read the playbook** — `references/<objectType>.md`. Required baseline fields, value shapes, categories, and type-specific constraints are there. Do not draft from memory.
3. **Apply shared rules** — [object-content-standards](../object-content-standards/SKILL.md) (dedupe, locales, images, id format). Images: [ipfs-image-upload](../ipfs-image-upload/SKILL.md).
4. **Build and broadcast** after explicit user approval — [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md). HAS session: [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md). Oversized body: [ipfs-file-upload](../ipfs-file-upload/SKILL.md).
5. **Verify** the object on chain (`resolve_object`) against the playbook's verification section.

## Playbooks

| Type | Playbook |
|------|----------|
| `affiliate` | [affiliate](references/affiliate.md) |
| `book` | [book](references/book.md) |
| `business` | [business](references/business.md) |
| `dish` | [dish](references/dish.md) |
| `drink` | [drink](references/drink.md) |
| `governance` | [governance](references/governance.md) |
| `group` | [group](references/group.md) |
| `hashtag` | [hashtag](references/hashtag.md) |
| `html` | [html](references/html.md) |
| `legal_document` | [legal-document](references/legal-document.md) |
| `link` | [link](references/link.md) |
| `list` | [list](references/list.md) |
| `map` | [map](references/map.md) |
| `newsfeed` | [newsfeed](references/newsfeed.md) |
| `page` | [page](references/page.md) |
| `person` | [person](references/person.md) |
| `place` | [place](references/place.md) |
| `product` | [product](references/product.md) |
| `recipe` | [recipe](references/recipe.md) |
| `restaurant` | [restaurant](references/restaurant.md) |
| `service` | [service](references/service.md) |
| `service_offer` | [service-offer](references/service-offer.md) |
| `service_request` | [service-request](references/service-request.md) |
| `shop` | [shop](references/shop.md) |
| `skill` | [skill](references/skill.md) |
| `webpage` | [webpage](references/webpage.md) |
| `widget` | [widget](references/widget.md) |

## Related

- [object-content-routing](../object-content-routing/SKILL.md) — intent → playbook / workflow
- [object-content-standards](../object-content-standards/SKILL.md) — dedupe, locales, images
- [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) — builders and broadcast
- [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) — agent-wallet MCP setup
