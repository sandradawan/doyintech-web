# DoyinTech Tools Hub

Free business & career tools at `/tools`.

## Categories

### Core
- `/tools/website-calculator` — NGN website cost estimator
- `/tools/business-audit` — digital presence audit
- `/tools/cv-builder` — CV + portfolio builder
- `/tools/digital-readiness` — transformation readiness score

### Business & growth
- `/tools/project-brief`
- `/tools/tech-stack`
- `/tools/hosting-planner`
- `/tools/roi-calculator`
- `/tools/invoice-generator`
- `/tools/whatsapp-checklist`
- `/tools/maintenance-picker`
- `/tools/email-signature`

### Career & learning
- `/tools/salary-calculator`
- `/tools/skill-gap`
- `/tools/cover-letter`
- `/tools/project-ideas`
- `/tools/interview-practice`

### AI & automation
- `/tools/ai-usecase`
- `/tools/chatbot-script`

### Utilities
- `/tools/qr-generator`
- `/tools/password-generator`

## Config files

| What | File |
|------|------|
| Catalog, WhatsApp, Academy URL | `lib/tools/config.ts` |
| Website pricing engine | `lib/tools/pricing.ts` |
| Audit questions | `lib/tools/audit.ts` |
| Readiness questions | `lib/tools/readiness.ts` |
| Stack, salary, ROI, ideas, etc. | `lib/tools/extra.ts` |
| UI for extended tools | `components/tools/ExtendedTools.tsx` |

## Env (leads)

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=doyintechnology@outlook.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

## Notes

- Estimates are not formal quotes.
- Audit/readiness are self-reported.
- CV/invoice print via browser print dialog.
- QR uses public `api.qrserver.com` image URL.
