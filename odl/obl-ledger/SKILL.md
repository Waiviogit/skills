---
name: obl-ledger
description: >-
  Issue OBL invoices, declare/confirm payments, and read pair balances, ledger history,
  and relationships. Use when issuing OBL invoices, declaring/confirming payments, or
  reading pair balances and ledger.
---

# OBL mutual ledger

Issue invoices, record off-chain payments, and read Mutual Ledger balances / history for an account pair.

**Signing / broadcast:** [Hive blockchain broadcast](../hive-blockchain-broadcast/SKILL.md). Use `buildObl*` + `obl-mainnet` / `obl-testnet`.

## When to use

- Issue an invoice (`invoice_issue` / `buildOblInvoiceIssueOp`).
- Declare or confirm a payment (`payment_declare` / `payment_confirm`).
- Read pair **balance**, full/paginated **ledger**, or **relationships** list.
- Convert USD → WAIV for display (`convert_usd_to_waiv`).

## When not to use

- Discover/publish/sign offers and contracts, or create/cancel service orders — [obl-offers-contracts.md](../obl-offers-contracts/SKILL.md).
- Open/resolve disputes or arbiter inbox — [obl-disputes.md](../obl-disputes/SKILL.md).
- Normative balance rules — `docs/spec/obl/mutual-ledger.md`.

## Cycle position

[Sign contract](../obl-offers-contracts/SKILL.md) → [service order](../obl-offers-contracts/SKILL.md#steps--service-orders) → **invoices / payments / balances** → [disputes](../obl-disputes/SKILL.md).

## Network

| Network | Id |
|---------|-----|
| Mainnet | `obl-mainnet` |
| Testnet | `obl-testnet` |

## Read (query-api MCP)

| Intent | Tool |
|--------|------|
| Pair USD balance | `get_obl_balance` |
| Full ledger (legacy) | `get_obl_ledger` |
| Counterparties + balances | `get_obl_relationships` |
| USD → WAIV hint | `convert_usd_to_waiv` |
| Contract context | `get_obl_contract` |
| Service order | `get_obl_service_order` |

HTTP also: cursor pages `/query/v1/obl/ledger/{payments|invoices|contracts|disputes|service-orders|reports}`, `GET /obl/invoices/:invoiceId`, `GET /obl/service-orders/:serviceOrderId`. See query-api OBL (`docs/apps/query-api/spec/obl.md`) and [query-api MCP routing](../query-api-mcp-routing/SKILL.md).

Balance buckets (confirmed / pending / disputed) — `docs/spec/obl/mutual-ledger.md`.

## Steps — issue invoice

1. **Classic single:** `issuer`, `debtor`, `creditor`, `amountUsd`.
2. **Attestor / beneficiary / multi:** `issuer`, `debtor`, `contractId` (governing contract), `beneficiaries: [{ beneficiary, amountUsd, role? }]`.
3. Optional `details` JSON — omit when empty.
4. Client id: `inv-{uuid}`.
5. Build and broadcast:

**Classic single** — `buildOblInvoiceIssueOp`:

```ts
import { buildOblInvoiceIssueOp } from '@opden-data-layer/hive-broadcast';

const op = buildOblInvoiceIssueOp({
  id: 'obl-mainnet',
  invoiceId: 'inv-…',
  issuer: 'alice',
  debtor: 'bob',
  creditor: 'alice',
  amountUsd: '100.00',
  contractId: 'contract-…', // optional
});
```

**Attestor / multi-beneficiary** — use `buildOblEnvelopeOp` until a dedicated builder exists:

```ts
import { buildOblEnvelopeOp } from '@opden-data-layer/hive-broadcast';

const op = buildOblEnvelopeOp({
  id: 'obl-mainnet',
  action: 'invoice_issue',
  required_posting_auths: ['organizer'],
  payload: {
    invoice_id: 'inv-…',
    issuer: 'organizer',
    debtor: 'sponsor',
    contract_id: 'contract-…', // required for attestor
    beneficiaries: [
      { beneficiary: 'winner', amount_usd: '50.00', role: 'user_reward' },
      { beneficiary: 'referral', amount_usd: '5.00', role: 'referral_fee' },
    ],
  },
});
```

6. **Gotcha:** if the debt pair has no started ledger yet, classic lines stay `pending` until a ledger exists for `(debtor, beneficiary)` — see `docs/spec/obl/contracts.md`. Attestor invoices auto-start the debt-pair ledger per line.

## Steps — payments

Off-chain path (Mutual Ledger):

| Action | Builder | Who |
|--------|---------|-----|
| Declare | `buildOblPaymentDeclareOp` | payer |
| Confirm | `buildOblPaymentConfirmOp` | receiver (may partial-confirm) |

On-chain WAIV transfers / upvote rewards can also credit the ledger when indexed — see `docs/spec/obl/payments.md`. Agents building UI flows usually use declare → confirm.

1. `get_obl_balance` / ledger payments before and after.
2. Broadcast declare; wait for index; receiver confirms with `declarePaymentId` when linking to a pending declare.
3. Payments are **not** contract-linked (pair-scoped only).

## Steps — read history and relationships

1. Relationships list: `get_obl_relationships({ account })`.
2. Pair detail: `get_obl_balance({ accountA, accountB })` + `get_obl_ledger` or HTTP sublists with cursor.
3. After any broadcast, poll until the new row / balance appears (indexer lag).

## Gotchas

- Amounts are USD strings/numbers validated strictly on chain and in web builders.
- Invoice without `contract_id` is allowed; dispute authority then falls back when resolving — prefer linking a contract when the pair has one.
- `invoice_issue` / `report_create` with a **cancelled** `service_order_id` are skipped entirely (do not persist a nulled ref). Create/cancel SO — [obl-offers-contracts.md](../obl-offers-contracts/SKILL.md#steps--service-orders).
- Do not treat query-api drafts as ledger state.

## Verification

- Body of this skill contains `get_obl_balance` and `buildOblInvoiceIssueOp`.
- After broadcast + index: invoice/payment appears in ledger; balance buckets move as expected.
- `resolve_doc({ topic: "obl pair balance" })` / `"issue invoice"` routes here.

## Related

- [OBL offers and contracts](../obl-offers-contracts/SKILL.md) · [OBL disputes](../obl-disputes/SKILL.md)
- Mutual ledger (`docs/spec/obl/mutual-ledger.md`) · Payments (`docs/spec/obl/payments.md`)
- [Hive blockchain broadcast](../hive-blockchain-broadcast/SKILL.md)
