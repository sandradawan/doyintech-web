# DoyinOps — company product plan

## What it is
SME operations platform under DoyinTech: contacts, sales pipeline, invoices, tasks.

## Live routes
- Marketing: `/ops`
- Workspace: `/ops/app`

## MVP (shipped)
- Browser workspace (localStorage)
- Contacts + search + WhatsApp
- Pipeline stages + deal values + follow-ups
- Invoices + mark paid + WA remind + **print / PDF**
- Tasks (to-do with due dates)
- JSON export / import
- Load demo data

## Next (cloud)
- Supabase multi-tenant orgs + RLS
- Auth (email/magic link)
- Paystack invoice payment links
- WhatsApp Cloud API notifications
- Team roles (owner / staff)

## Positioning
System of record for informal SMEs — AI may draft messages; DoyinOps holds state and money tracking.

## Pricing direction
- Free: single browser workspace
- Pro: cloud sync, team, Paystack links
- Custom: hire DoyinTech for vertical builds
