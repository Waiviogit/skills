---
name: changelly-hive-deposit-for-agents
description: >-
  Create a Changelly exchange via query-api MCP so a payer can send BTC, ETH, USDT,
  SOL, LTC or any other supported coin and the chosen Hive account receives HIVE.
  Covers coin and network choice, limits, net amount, float vs fixed rate, someone
  else's account as recipient, and status tracking. Use when a user wants to pay,
  top up or deposit into a Hive account with another cryptocurrency, or asks for a
  Changelly BTC → HIVE (or any coin → HIVE) conversion.
---

# Changelly deposits into a Hive account

Any Changelly-supported coin → HIVE, paid out to a Hive account. query-api creates the exchange with the platform Changelly key and returns the pay-in address. The agent signs nothing and needs no key: the payer sends coins from their own wallet, Changelly converts them and transfers HIVE to the account.

## When to use

- "I have $50 of BTC, put it into my (or the agent's, or @bob's) HIVE account."
- "Where do I send USDT to get HIVE?" / "Start a BTC → HIVE conversion via Changelly."
- The payer and the recipient may be different people.

## When not to use

- HIVE → BTC/LTC/ETH: withdraw (`get_user_hive_withdraw_range`, `post_user_hive_withdraw_estimate`); `create` is web-only because the user signs the transfer.
- SWAP.BTC / SWAP.LTC on Hive Engine: [hive-engine-deposit-for-agents](../hive-engine-deposit-for-agents/SKILL.md).
- Moving HIVE that is already on Hive: a plain `transfer` (active key).

## MCP tools (query-api)

| Tool | Purpose |
|------|---------|
| `get_hive_deposit_currencies` | Coins that convert into HIVE, with `network`, `protocol`, `extraIdName`, `payinNotification`. Pass `search` (`usdt`, `tron`, `sol`) |
| `get_user_hive_deposit_range` | Min/max pay-in for `fromCoin` and `rateType` |
| `post_user_hive_deposit_estimate` | `amountToNet` = HIVE the account receives after the payout network fee |
| `post_user_hive_deposit_create` | Creates the exchange; returns `exchangeId`, `payinAddress`, `payinExtraId`, `payTill` |
| `get_user_hive_deposit_status` | Live status of one exchange |
| `get_user_hive_deposit_history` | Exchanges paying HIVE to the account (recover a lost `exchangeId`) |

`account` in every tool is the **recipient** Hive account.

## Must (order)

1. Confirm the recipient account (ask if "my account" is ambiguous: the user's or the agent's).
2. `get_hive_deposit_currencies({ search })` — pick the exact ticker **and network**. `usdt20` is ERC20 (Ethereum), `usdtrx` TRC20 (Tron), `usdtsol` Solana, `usdtpolygon` Polygon: different coins. Coins sent on another network are lost. Ask the payer which network their wallet uses when it is not obvious.
3. `get_user_hive_deposit_range` and `post_user_hive_deposit_estimate` — check the amount fits (minimum is roughly $30 floating, $50 fixed) and quote `amountToNet` HIVE.
4. `post_user_hive_deposit_create({ account, fromCoin, amount })` — once per payment. Every call creates a real exchange.
5. Show the result exactly as returned (never retype or invent an address):
   - `payinAddress`, and `payinExtraId` with its name (`payinExtraIdName`) when not null — the payer **must** include it.
   - Network (`network`) and coin; amount to send; expected `amountToNet` HIVE.
   - `exchangeId` — tell the user to keep it.
   - `payTill` for a fixed rate; `payinNotification` when present.
6. If create returns 503, say Changelly is unavailable and stop. Do not suggest an address from memory or another service.

## Amount advice

- Send a bit more than the minimum: the payer's wallet may deduct its own network fee, and a pay-in below Changelly's minimum ends as `failed` (support refund only).
- The float rate is set when the payment arrives; `amountExpectedTo` is an estimate.
- Fixed rate (`rateType: "fixed"`): locked rate, deadline `payTill` (about 15 minutes), needs `refundAddress` on the `fromCoin` network. Offer it only when the payer wants a guaranteed amount.

## Someone else's account

Set `account` to the recipient. Tell the payer who receives the HIVE and that the payout is a public Hive transfer to that account.

For an exchange or swap gateway account that needs a memo (for example `honey-swap` → SWAP.HIVE), pass `destinationMemo`; without it the HIVE may be lost. Personal accounts need no memo.

## Tracking

`get_user_hive_deposit_status({ account, exchangeId })`:

| Status | Meaning |
|--------|---------|
| `waiting` | No payment yet (pay-in address still shown) |
| `confirming` | Payment seen, waiting for confirmations |
| `exchanging` / `sending` | Converting / sending HIVE |
| `finished` | HIVE sent; `payoutHash` is the Hive transaction |
| `failed` | Usually below minimum; contact Changelly support with `exchangeId` |
| `refunded` | Returned to the refund address |
| `hold` | AML/KYC check by Changelly |
| `overdue` / `expired` | Not paid in time (float / fixed); create a new exchange |

Lost `exchangeId`: `get_user_hive_deposit_history({ account })`. The pay-in address is shown only while the exchange waits for payment.

After `finished`, the HIVE balance is in `get_user_hive_wallet`. Moving or powering up that HIVE is a separate step with the active key.
