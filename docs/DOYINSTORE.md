# DoyinStore — Engineering plan

Independent marketplace for **apps** (Android APK, desktop installers) and **digital products**, with a security review pipeline.

## Hard limits

| Expectation | Reality |
|-------------|--------|
| Auto-download after payment | **Yes** — token URL starts download |
| Silent auto-install | **No** — OS blocks websites from silent install |
| AAB for users | **No** — require **APK** |

Copy: **“Download starts automatically. Install requires your confirmation.”**

## Shipped

### Phase 1 — Storefront
- `/store` browse + search + categories
- `/store/[slug]` detail + buy/download panel
- `/store/developer` submit form (rejects AAB)
- `/store/security` pipeline explainer
- Nav: Store

### Phase 2a — Review & delivery (this pass)
- `/store/admin` review queue (approve / request changes / reject)
- `POST /api/store/submit` → in-memory queue + scan simulation
- `GET|PATCH /api/store/admin` (protect with `STORE_ADMIN_KEY` in production)
- Download **tokens** (`lib/store/tokens.ts`) — 120 min TTL
- `POST /api/store/download` issues token; paid path verifies Paystack when key set
- `GET /api/store/file` token-gated delivery (MVP: secure receipt file; Blob next)
- Supabase SQL: `lib/store/schema.sql`

## Env vars

```
STORE_ADMIN_KEY=long-random-secret
PAYSTACK_SECRET_KEY=...
NEXT_PUBLIC_SITE_URL=https://doyintech.vercel.app
# Later:
# SUPABASE_URL=
# SUPABASE_SERVICE_ROLE_KEY=
# VIRUSTOTAL_API_KEY=
```

## Next (Phase 2b)

1. Run `lib/store/schema.sql` in Supabase
2. Private bucket `store-binaries`
3. Upload APK/ZIP from developer form
4. `file` route → signed Blob URL
5. VirusTotal scan job on submit
6. Persist queue (replace process memory)
