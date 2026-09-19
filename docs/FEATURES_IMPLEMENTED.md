# Features implemented (Sept 2026 pass)

## Store
- Clean public store + hero carousel (screenshots)
- Password auth (scrypt + signed session tokens)
- Developer + admin dashboards (sidebar)
- Search, category, free/paid filters, sort
- Listing detail with screenshots + reviews panel
- My purchases (`/store/purchases`) — lookup by checkout email
- Developer profile (`/store/dev/[name]`)
- Reviews API (GET/POST) with rate limit
- Orders API + DB helpers
- Download tokens (memory + DB) + binary stream when file uploaded
- Unsplash product photos on seed listings
- Analytics event helpers + ops notify webhook hook

## Client
- Client portal project-code lookup (`DT-XXXX`) + WhatsApp handoff

## Still requires your config
1. Run `docs/doyintech-full-site.sql` + `docs/store-password-migration.sql` on Supabase
2. Vercel env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STORE_SESSION_SECRET`, `STORE_ADMIN_KEY`, `PAYSTACK_SECRET_KEY`
3. Optional: `OPS_WEBHOOK_URL` for Slack/Discord ops pings
4. Staff binary upload via `/api/store/upload` with admin key → files in `.data/store-binaries` (use Blob for multi-instance prod)

## Deferred (next sprints)
- DoyinOps multi-tenant cloud sync
- VirusTotal auto-scan job
- Full email SMTP transactional mail
- Buyer accounts with password (purchases currently email-receipt based)
