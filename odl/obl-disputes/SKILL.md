---
name: obl-disputes
description: >-
  Open and resolve OBL invoice disputes, apply dispute_rule and arbiter, and read the
  arbitration inbox. Use when opening or resolving OBL invoice disputes or reading the
  arbitration inbox.
---

# OBL disputes and arbitration

Open and resolve disputes on Mutual Ledger invoices; read the arbiter inbox.

**Signing / broadcast:** [Hive blockchain broadcast](../hive-blockchain-broadcast/SKILL.md). Use `buildObl*` + `obl-mainnet` / `obl-testnet`.

## When to use

- Open a dispute on an invoice (`dispute_open` / `buildOblDisputeOpenOp`).
- Resolve a dispute as the authorized party (`dispute_resolve` / `buildOblDisputeResolveOp`).
- List disputes for a pair or the **arbitration** inbox for an arbiter account.

## When not to use

- Publish/sign offers and contracts — [obl-offers-contracts.md](../obl-offers-contracts/SKILL.md).
- Issue invoices or payments without a dispute — [obl-ledger.md](../obl-ledger/SKILL.md).
- Normative authority rules — `docs/spec/obl/disputes.md`.

## Cycle position

[Contract + invoice](../obl-offers-contracts/SKILL.md) / [ledger](../obl-ledger/SKILL.md) → **dispute open / resolve** → balance disputed/resolved buckets update.

## Network

| Network | Id |
|---------|-----|
| Mainnet | `obl-mainnet` |
| Testnet | `obl-testnet` |

## Who may resolve

Authority comes from the invoice’s linked contract:

| `dispute_rule` | Resolver |
|----------------|----------|
| `client` | Contract `client` |
| `provider` | Contract `provider` |
| `arbiter` | Contract `arbiter` account |

If the invoice has no contract, fall back carefully — prefer linking invoices to contracts at issue time. See `docs/spec/obl/disputes.md`.

## Read (query-api MCP)

| Intent | Tool |
|--------|------|
| Arbiter inbox | `get_obl_arbitration` (`status`: `open` \| `resolved`) |
| Pair ledger (includes disputes) | `get_obl_ledger` |
| Contract (`dispute_rule`, `arbiter`) | `get_obl_contract` |

HTTP: `GET /query/v1/obl/disputes/:disputeId`, ledger disputes cursor page. query-api OBL (`docs/apps/query-api/spec/obl.md`) · [query-api MCP routing](../query-api-mcp-routing/SKILL.md).

## Steps — open dispute

1. Invoice must be disputable (typically `confirmed` / `pending`, no open dispute).
2. Disputant is debtor or creditor; proposed amount USD.
3. Client id: `dispute-{uuid}` (or project convention).
4. Build and broadcast:

```ts
import { buildOblDisputeOpenOp } from '@opden-data-layer/hive-broadcast';

const op = buildOblDisputeOpenOp({
  id: 'obl-mainnet',
  disputeId: 'dispute-…',
  invoiceId: 'inv-…',
  disputant: 'bob',
  proposedAmountUsd: '80.00',
});
```

5. After index: invoice → `disputed`; amount moves into disputed balance bucket (mutual-ledger (`docs/spec/obl/mutual-ledger.md`)).

## Steps — resolve dispute

1. Load dispute + invoice + contract; confirm viewer === resolver for `dispute_rule`.
2. Set `finalAmountUsd` (settlement).
3. Broadcast:

```ts
import { buildOblDisputeResolveOp } from '@opden-data-layer/hive-broadcast';

const op = buildOblDisputeResolveOp({
  id: 'obl-mainnet',
  disputeId: 'dispute-…',
  resolver: 'judge',
  finalAmountUsd: '85.00',
});
```

4. After index: dispute `resolved`, invoice `resolved` with `final_amount_usd`; disputed bucket clears.

## Steps — arbitration inbox

1. For an arbiter account: `get_obl_arbitration({ account, status: 'open' })`.
2. Each row includes dispute, invoice, contract summary, offer name.
3. Resolve with `buildOblDisputeResolveOp` when `dispute_rule === 'arbiter'` and `arbiter === account`.

## Gotchas

- Only one **open** dispute per invoice.
- Resolver must match contract rule — wrong account fails validation on index.
- Open disputes affect the **disputed** balance card; do not treat them as confirmed debt.
- Prefer `get_obl_contract` before resolve so `arbiter` / rule are not guessed.

## Verification

- Body of this skill contains `buildOblDisputeOpenOp` and `get_obl_arbitration`.
- After open/resolve + index: dispute status and invoice state match; arbitration list updates for arbiter.
- `resolve_doc({ topic: "resolve obl dispute" })` routes here.

## Related

- [OBL offers and contracts](../obl-offers-contracts/SKILL.md) · [OBL ledger](../obl-ledger/SKILL.md)
- Disputes spec (`docs/spec/obl/disputes.md`) · Open Business Layer (`docs/spec/open-business-layer.md`)
- [Hive blockchain broadcast](../hive-blockchain-broadcast/SKILL.md)
