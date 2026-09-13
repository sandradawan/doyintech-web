# DoyinStore — Engineering plan

Independent marketplace for **apps** (Android APK, desktop installers) and **digital products**, with a security review pipeline. Goal: give African developers a path outside Google Play’s friction — without pretending the browser can bypass OS security.

## Hard limits (must not lie to users)

| Expectation | Reality |
|-------------|--------|
| Auto-download after payment | **Yes** — browser starts file download via signed URL |
| Silent auto-install on phone/PC | **No** — Android/Windows/macOS block silent install from websites |
| Install APK after download | **Yes** — user confirms “Install unknown apps” once |
| Install AAB like Play Store | **No** — AAB is not user-sideloadable; require **APK** |
| Google-level malware lab | **No** — we use scan + human review; improve over time |

Honest product copy: **“Download starts automatically after payment. Install requires your confirmation (device security).”**

## Architecture (MVP → production)

1. **Next.js storefront** `/store`, `/store/[slug]`, `/store/developer`, `/store/security`
2. **Listing catalog** (`lib/store`) → later Supabase tables `store_listings`, `store_developers`, `store_orders`
3. **Payments** Paystack (paid) / free unlock session
4. **Download** time-limited signed URL after free claim or successful payment
5. **Review queue** statuses: submitted → scanning → in_review → approved | rejected
6. **Storage** Vercel Blob or Supabase Storage for binaries (not in git)

## Security pipeline

See `SECURITY_PIPELINE` in `lib/store/catalog.ts`.

- Never publish without `reviewStatus === approved` and scan not `flagged`
- Show SHA-256 on listing when available
- Suspend listings on abuse reports

## Roadmap

- **Phase 1 (shipped UI):** browse, detail, developer submit form, security policy pages, download/purchase UX
- **Phase 2:** Supabase + Blob uploads, real Paystack product IDs per listing, admin review dashboard
- **Phase 3:** VirusTotal API, automated permission diff, developer payouts split
