# DoyinTech website

The DoyinTech site at [www.doyintech.com](https://www.doyintech.com): agency pages, free business tools, a digital shop (kits, ebooks, components, templates, paid tools), Report Studio, student project services, airtime/data bills, DoyinStore, DoyinOps, and recurring memberships.

Next.js 16 (App Router) · React 19 · Tailwind 4 · Supabase (Postgres + auth) · Paystack · Resend · Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

`npm run build` and `npm run lint` must both pass before deploying.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL, e.g. `https://www.doyintech.com`. Used for payment callbacks and email links. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase project (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only Supabase key. Never expose to the browser. |
| `PAYSTACK_SECRET_KEY` | yes | Paystack secret key. Also verifies webhook signatures. |
| `DELIVERY_TOKEN_SECRET` | yes | Random 32+ char string for signing download links. |
| `STORE_SESSION_SECRET` | yes | Random 32+ char string for DoyinStore sessions (must differ from other secrets). |
| `CRON_SECRET` | yes | Protects `/api/cron/*` (Vercel sends it automatically). |
| `RESEND_API_KEY` | yes | Transactional email, product delivery and the email list. |
| `RESEND_FROM`, `DELIVERY_FROM_EMAIL`, `NEWSLETTER_FROM_EMAIL` | recommended | Verified sender addresses, e.g. `DoyinTech <hello@doyintech.com>`. |
| `CONTACT_TO_EMAIL`, `ADMIN_EMAILS` | recommended | Where notifications go; comma-separated admin logins. |
| `ADMIN_SECRET` | optional | `x-admin-secret` header for automation. |
| `OPENAI_API_KEY` | optional | AI tools and Report Studio generation. |
| `VTPASS_API_KEY`, `VTPASS_SECRET_KEY` | optional | Live airtime/data delivery. |
| `PAYSTACK_PLAN_<PLAN_ID>` | optional | Pin a Paystack plan code, e.g. `PAYSTACK_PLAN_PRO_MONTHLY=PLN_xxx`. Otherwise plans are created automatically on first checkout. |

Generate secrets with `openssl rand -hex 32`.

## Database

Run the SQL files in `supabase/migrations/` in order in the Supabase SQL editor:

1. `001_wallet_bills.sql` — profiles, wallet, bill orders.
2. `002_security_hardening.sql` — locks the wallet functions to the server, enables row-level security on every table, adds `ops_workspaces`, `ops_payment_events` and `payment_claims`.
3. `003_recurring_revenue.sql` — `subscriptions` and `email_subscribers`.

The older schemas in `docs/*.sql` and `lib/store/schema.sql` must exist before `002` (it only touches tables that exist).

## Payments (Paystack)

Set the webhook URL in Paystack → Settings → API Keys & Webhooks to `https://www.doyintech.com/api/paystack/webhook`.

- **One-off products** go through `/api/paystack/initialize` (price comes from the server catalog) and are fulfilled by the webhook. Paid content is only released by `/api/unlock` and `/api/delivery/file` after `lib/payments/purchase.ts` confirms a full NGN payment for that exact product.
- **Paid files** live in `private/` (not web-served) and ship with the API functions via `outputFileTracingIncludes`.
- **Subscriptions** (`lib/subscriptions/`): DoyinTech Pro (`/pro`) and website care plans (`/care-plans`). Members sign in at `/account` (Supabase magic link) and manage billing through Paystack's hosted page.
- **Report Studio** orders are confirmed by the webhook or `/api/reports/confirm`, then generated in the background.

## Email list

`/api/newsletter` adds subscribers and sends the welcome email. `/api/cron/nurture` (daily, see `vercel.json`) sends the follow-up sequence defined in `lib/newsletter/sequence.ts`. Every email has a one-click unsubscribe link.

## Notes

- Security headers and the Content Security Policy are in `next.config.ts`; HTTPS redirect in `proxy.ts`.
- The service worker (`public/sw.js`) caches only the `/play` offline game and static assets.
- Rate limiting (`lib/rate-limit.ts`) is in-memory per instance. For heavier traffic, move it to Upstash Redis or Vercel Firewall rules.
