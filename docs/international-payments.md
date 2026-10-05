# International mode (USD display → Paystack)

## How it works today

1. **Display currency:** USD across student tools and public pricing labels (`lib/currency.ts`).
2. **Settlement:** Paystack still charges **NGN** by default (your existing Nigeria business).
3. **Visitor experience:** US/EU cards work once **International payments** are enabled on Paystack — the cardholder’s bank converts USD↔NGN.
4. **FX rate:** `USD_NGN_RATE` (default `1550`). Set on Vercel to update displayed USD without changing NGN catalog prices.

## What you must do in Paystack (ops)

1. Log in to [Paystack Dashboard](https://dashboard.paystack.com).
2. **Settings → Preferences / International payments** → request **International payments**.
3. Wait for approval (some categories need extra docs).
4. Optional: request **USD settlement** (Nigeria pilot — needs Zenith USD domiciliary account) if you want balances in USD.
5. Optional: set env `PAYSTACK_CURRENCY=USD` only after Paystack enables USD for your account **and** you store catalog amounts in cents (not NGN kobo).

## Recommended path for US traffic

| Step | Action |
|------|--------|
| A | Enable international cards on Paystack (NGN charge) — fastest |
| B | Keep site USD labels via `lib/currency.ts` |
| C | Monitor failed foreign cards in Paystack logs |
| D | Later: Stripe/PayPal as secondary if Paystack declines some US banks |

## Env vars

```
USD_NGN_RATE=1550
NEXT_PUBLIC_USD_NGN_RATE=1550
PAYSTACK_CURRENCY=NGN
```

## Code entry points

- `lib/currency.ts` — format & convert
- `lib/students/packages.ts` — student USD badges
- `app/api/paystack/initialize/route.ts` — charge currency
- Student hub `/students` — international copy
