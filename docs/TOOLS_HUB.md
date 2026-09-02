# DoyinTech Tools Hub

Free business & career tools integrated into the main site.

## Routes

| Path | Tool |
|------|------|
| `/tools` | Hub |
| `/tools/website-calculator` | Website price calculator (NGN) |
| `/tools/business-audit` | Business digital audit |
| `/tools/cv-builder` | CV & portfolio builder |
| `/tools/portfolio-builder` | Redirects to CV builder |
| `/tools/digital-readiness` | Digital readiness checker |

## Where to change settings

| What | File |
|------|------|
| WhatsApp number, email, Academy URL, brand | `lib/tools/config.ts` |
| Website price bases & feature costs | `lib/tools/pricing.ts` |
| Audit questions & weights | `lib/tools/audit.ts` |
| Readiness questions & weights | `lib/tools/readiness.ts` |
| Analytics hook | `lib/tools/analytics.ts` |

## Environment variables

Same as contact form (optional for leads):

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=doyintechnology@outlook.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

Without `RESEND_API_KEY`, lead forms still succeed in demo mode (logged server-side).

## Lead API

`POST /api/tools/lead` — name, email, phone, businessName, tool, resultSummary, message.

## Notes

- Calculator shows **estimated ranges**, not formal quotes.
- Audit / readiness scores are **self-reported** (no live site crawl).
- CV drafts use **localStorage**; print/PDF via browser print.
- Public portfolio URLs (`/portfolio/username`) can be added later with Supabase auth.

## Academy

Link Academy → Tools: `https://doyintech.vercel.app/tools`  
Navbar includes Academy → `https://doyintechacademy.vercel.app`
