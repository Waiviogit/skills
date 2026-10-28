# Create service_offer object

Agent playbook for ODL service_offer — OBL catalog fields capability, endpoint, priceModel, SLA, provider, input, output, limitations.

Agent-oriented service offering for OBL catalog discovery.

## When to use / not

- **Use** when publishing an OBL-discoverable service offer.
- **Not** for generic business pages — use `business` or `service`.
- Link `legal_document` when terms are required.

## Product baseline fields

`name`, `description`, `image` (product policy).

One independently callable/comparable operation = one `service_offer`. Free ops are valid.

**Name:** `{Provider} — {service/call name}` (em dash). Do not glue a raw API operation id + summary or repeat the provider. Provider ref stays in `provider`.

**title:** `{METHOD} {path}` only. Keep `{id}`/`{username}`.

**url:** full callable `{scheme}://{host}{path}`. Not docs. No keys/query/body.

**description:** 1–2 sentences of what it DOES. Not marketing/docs. No price/auth/endpoint/pagination. Negative scope → limitations.

**input:** auth header, required/optional params, accepted identifier forms. POST/PUT/PATCH: body shape (object vs array), required top-level fields — never only "JSON request body".

**output:** meaning, not property dump. Async/batch: distinguish submission ack from final results.

**limitations:** documented caveats only. Name the field/behavior. No pricing or invocation how-to.

**Discovery:** `category` = broad domain. Tags Action/Data/Platform/Features only. Action = semantic task, not the transport. Prefer Search/Research/Extract/Generate/Analyze over Execute when that is the user-facing job. Platform = external ecosystem, never vendor.

Official docs first, official pricing second. Conflicts → limitations. Do not invent.

## Field semantics

| Update | Semantics |
|--------|-----------|
| `capability` | Machine-readable capability id(s) for OBL matching |
| `endpoint` | Service endpoint URL or API base |
| `priceModel` | Pricing model descriptor per OBL spec |
| `currency` | ISO currency when price applies |
| `sla` | SLA JSON per operator spec |
| `price` | Listed price when applicable |
| `website` | Marketing or docs URL (`{ title, link }`) |
| `url` | Canonical web link (plain URL string) |
| `provider` | Single `object_ref` to the `business` that offers this service. The business right rail lists these offers. |
| `input` | What the service takes as input |
| `output` | What the service produces |
| `limitations` | Constraints or limits of the service |

## Categories and tags (soft)

- `Category`, `Pros`, `Cons` tag keys; `Quality`, `Value` ratings

## Locales

Translate `name`, `description`, `input`, `output`, `limitations`, tag values. Keep `capability`, `endpoint`, `priceModel`, `currency`, `provider` stable.

## Research and source hierarchy

- Operator-provided OBL catalog spec only.
- No invented endpoints or SLAs.

## Images

Logo or service icon; IPFS before broadcast.

## Special constraints

- Follow [OBL offers and contracts](../../obl-offers-contracts/SKILL.md) after object exists.
- `legal_document` ref when binding terms apply.
- `provider` must reference a `business` object.

## Verification

`resolve_object`: `fields.capability`, `fields.endpoint`, `fields.provider`, `fields.input`, `fields.output`, `fields.limitations`, baseline fields.

## Related workflows

- [OBL offers and contracts](../../obl-offers-contracts/SKILL.md)
- [legal-document](legal-document.md)
- [service-request](service-request.md)
