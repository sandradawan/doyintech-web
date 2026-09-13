# Daily hot product routine (DoyinTech)

## Goal
Every day: research one high-demand digital product → create files → update `/products` catalog.

## One-message prompt (paste to Grok daily)
```
Run the DoyinTech daily product routine from digital-products/DAILY_PRODUCT_ROUTINE.md on sandradawan/doyintech-web: research today’s most demanded digital product for African SMEs/freelancers, create deliverable files, update lib/products.ts (max 8 one-time products, badge New), commit to GitHub.
```

## Rules for each run
1. Read `lib/products.ts` — avoid duplicates
2. Research demand (WhatsApp biz, freelancers, templates, starters, trackers, AI prompts)
3. One product only; price ₦8,000–₦75,000; Paystack `amountKobo` = NGN × 100
4. Create folder `digital-products/NN-slug/` with real files
5. Keep max 8 items in `DIGITAL_PRODUCTS`; mark today with badge `New`
6. Do not remove `SAAS_PRODUCTS` waitlist
7. Commit with message: `Daily product: [name]`

## Ideal niches (rotate)
- WhatsApp / Instagram business scripts
- Invoice, proposal, contract packs
- Next.js / Laravel / Flutter starters
- SME spreadsheets (inventory, clients, expenses)
- AI prompt packs for business
- Client onboarding kits for agencies

## After automation quota resets
Create schedule: daily 08:00 Africa/Lagos with the same prompt as in Grok Automations.
