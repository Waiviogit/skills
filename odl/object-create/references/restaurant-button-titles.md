# Restaurant button titles

Fix generic `Order` / `Reservations` CTAs on restaurant objects. The web page prints `button.title` as the orange label. A stack of identical `Order` buttons is a data bug.

**Not** for creating restaurants, logos, or menus — [restaurant](restaurant.md).

## Title rules

`button` is `{ title, link }` (multi). Guests need to know **what** they are doing and **who** they pay.

| Situation | Title |
|-----------|--------|
| Venue gift-card URL (`toasttab.com/egiftcards`, “Buy gift card”) | `Gift Cards` |
| First-party order (Toast `/online`, Square `.square.site`, Clover `/online-ordering`, venue `/order`) | `Order Online` |
| Venue `/order-delivery` vs `/order` | `Delivery` + `Order Online` |
| DoorDash / Uber Eats / Skip / Ritual / Domino’s store | **Provider name only** — `DoorDash`, `Uber Eats`, `Skip`, `Ritual`, `Domino's`. Never `Order via DoorDash`. |
| Two reservation links | `Reserve via OpenTable`, `Reserve via Toast`, `Reserve via Google`, `Reserve via SevenRooms` |
| Venue’s own `/reserve` next to a platform | `Reservations` (no `via`) |
| Group / private booking page | `Group Booking` |
| Contact page scraped as Order | `Contact` |
| iVvy / event book | `Book` |
| Single unique non-platform action | Venue’s own label; no `via` |

Never copy Maps booking type (`ORDER`, `RESERVE`, `BOOK`) as the title.

### Kill, do not retitle

Vote `against` and do not publish a replacement:

- Favicon / `.ico` / `.png` / `manifest.webmanifest` / apple-touch
- Duplicate same-provider URLs (second OpenTable profile, generic Domino’s `/pages/order/` when a `storeid=` URL exists)
- Wrong-city delivery (a sister-city Ritual/DoorDash on this pin)

If a junk Square asset was the only “button”, add the real `https://<slug>.square.site/` as `Order Online`.

## Pass on a list

1. `resolve_object` the list → `fields.listItem` object ids.
2. `resolve_nested_objects` in chunks of 32 with `update_types: ["button","name"]`. Skip objects with no `button`. Skip rows already titled under the table above.
3. For every object that still has generic or stacked titles: `get_object_updates` `update_type=button` (need `update_id` for votes).
4. Classify each URL. Build:
   - `update_create` `{ title, link }` for every **changed** title
   - `update_vote` `{ update_id, voter: <running-hive-account>, vote: against }` on the generic / junk / duplicate / wrong-city rows
5. Pack into **one** `custom_json` until ~7800 UTF-8 bytes (Hive max 8192). Split only when the next event would overflow.
6. Re-resolve. Resolved `button` titles must match the table; rejected junk must be gone.

Creator `against` **replaces** the auto-`for` on that `(update_id, voter)` → `approve_percent` 0 → hidden.

## Pitfalls

1. **Same `{title, link}` as an existing row.** Indexer skips the new create. If you also `against` the old row, the CTA vanishes. Leave that row, or flip its vote back to `for`. Only against+recreate when the **title** (or link) actually changes.
2. **Do not emit 8 separate `custom_json` ops.** One op, many `events`.
3. **Do not `update_vote` your brand-new create.** Votes are only for existing rows you are hiding or restoring.
4. **OpenTable `.com` + `.ca` + `/restaurant/profile/`** are one provider. Keep one bookable URL; against the extras.

## Verification

- Resolved buttons have distinct, specific titles
- No favicon/manifest/wrong-city links remain
- Duplicate same-JSON rows were restored with `vote: for`, not left hidden
