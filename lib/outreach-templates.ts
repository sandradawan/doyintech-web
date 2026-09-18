export type OutreachTemplate = {
  id: string;
  channel: string;
  title: string;
  /** Optional weakness tags this template is built for */
  weakness?: string;
  body: string;
};

/** Copy-paste outreach scripts — personalize [BRACKETS] before sending */
export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "wa-status-hire",
    channel: "WhatsApp Status",
    title: "Fixed-price website offer",
    body: `Local businesses: get a professional website in 7–14 days.\n\nFixed price. 50% deposit. WhatsApp-ready.\n\n→ https://doyintech.vercel.app/hire\n\nReply HIRE if you want details.`,
  },
  {
    id: "wa-status-audit",
    channel: "WhatsApp Status",
    title: "Free audit",
    body: `Free 3-minute website audit for SMEs.\n\nSend your URL → we reply with 2–3 specific problems holding back enquiries.\n\n→ https://doyintech.vercel.app/free-audit\n\nOr reply AUDIT with your link.`,
  },
  {
    id: "wa-status-product",
    channel: "WhatsApp Status",
    title: "SME Launch Bundle",
    weakness: "content_chaos",
    body: `Selling on WhatsApp Status but not getting chats?\n\nSME Launch Bundle: 30-day Status calendar + 120 captions.\nPay online. Instant download.\n\n→ https://doyintech.vercel.app/products\n\nReply STATUS for the link.`,
  },
  {
    id: "wa-dm-no-site",
    channel: "WhatsApp DM",
    title: "No website → Landing Starter",
    weakness: "no_website",
    body: `Hi [Name], I came across [Business] ([source: Instagram / Google / referral]).\n\nI couldn't find a simple website that explains what you offer and sends people straight to WhatsApp — a lot of customers search first, then message.\n\nI run DoyinTech. We have a fixed Landing Page Starter (₦100k, ₦50k deposit) built exactly for that.\n\n→ https://doyintech.vercel.app/hire\n\nIf budget is tight this month, the Status/caption packs also help: https://doyintech.vercel.app/products\n\nWant a free 3-min note on what I'd put on page one?`,
  },
  {
    id: "wa-dm-outdated",
    channel: "WhatsApp DM",
    title: "Outdated site → rebuild",
    weakness: "outdated_site",
    body: `Hi [Name] — quick look at [website URL].\n\nTwo things stood out: [issue 1 e.g. hard to use on phone] and [issue 2 e.g. no clear WhatsApp button]. That usually means fewer enquiries even when the business is good.\n\nI can send a free 3-minute audit (specific points only): https://doyintech.vercel.app/free-audit\n\nWhen you're ready for a fix, fixed packages are here: https://doyintech.vercel.app/hire\n\n— Silas, DoyinTech`,
  },
  {
    id: "wa-dm-booking",
    channel: "WhatsApp DM",
    title: "No booking → WhatsApp system",
    weakness: "no_booking",
    body: `Hi [Name], for [Business] (salon/clinic/service), I noticed booking still depends on long chat threads.\n\nWe set up sites that push "Book / WhatsApp" clearly and reduce missed appointments.\n\nPackages: https://doyintech.vercel.app/hire\nFree quick audit: https://doyintech.vercel.app/free-audit\n\nReply if you want the short audit first.`,
  },
  {
    id: "wa-dm-ops",
    channel: "WhatsApp DM",
    title: "Manual ops → DoyinOps",
    weakness: "manual_ops",
    body: `Hi [Name] — if you're juggling clients, quotes, and unpaid invoices in your head or Excel, try DoyinOps (free to start).\n\nContacts + pipeline + invoices + follow-ups in one workspace.\n\n→ https://doyintech.vercel.app/ops\n\nBuilt by DoyinTech for SMEs.`,
  },
  {
    id: "wa-dm-product-low",
    channel: "WhatsApp DM",
    title: "Low budget → products/ebooks",
    weakness: "content_chaos",
    body: `Hi [Name], if a full website isn't in the budget yet, start with tools you can use this week:\n\n• SME Launch Bundle (Status calendar + captions) — https://doyintech.vercel.app/products\n• Practical ebooks (marketing, WhatsApp, VA) — https://doyintech.vercel.app/ebooks\n\nPay online → instant access. When you're ready for a site, we still help: https://doyintech.vercel.app/hire`,
  },
  {
    id: "email-us-cold",
    channel: "Email (US)",
    title: "Cold email — US local business",
    body: `Subject: Quick note on [Business]'s website\n\nHi [First name],\n\nI came across [Business] while looking at [City] [industry] businesses.\n\nI noticed [specific issue — e.g. the site is hard to use on mobile / no clear way to book]. That often costs enquiries even when the service is excellent.\n\nI run DoyinTech — we help local businesses fix this with modern sites, booking paths, and simple automation.\n\nI can send a free 3-minute digital audit (two concrete issues + one recommended fix). No obligation.\n\nWorth a look?\n\nSilas · DoyinTech\nhttps://doyintech.vercel.app/hire\nhttps://doyintech.vercel.app/free-audit\ndoyintechnology@outlook.com`,
  },
  {
    id: "email-uk-cold",
    channel: "Email (UK)",
    title: "Cold email — UK local business",
    body: `Subject: [Business] — small digital observation\n\nHello [First name],\n\nI was researching [industry] businesses in [City] and found [Business].\n\nOne thing stood out: [specific issue]. Many UK microbusinesses have a site that works, but still lose leads because booking or mobile experience is weak.\n\nI'm with DoyinTech. We offer a complimentary 3-minute digital audit — two specific points and one practical next step.\n\nHappy to send it over if useful.\n\nKind regards,\nSilas · DoyinTech\nhttps://doyintech.vercel.app\ndoyintechnology@outlook.com`,
  },
  {
    id: "email-weakness-close",
    channel: "Email / WhatsApp",
    title: "After audit — recommend package",
    body: `Hi [First name],\n\nHere's the short audit for [Business]:\n\n1) [Weakness 1 — specific]\n2) [Weakness 2 — specific]\n\nRecommended next step: [Package name] — [price].\nWhy: it directly fixes [weakness] so more people [call / WhatsApp / book].\n\nDetails & deposit: https://doyintech.vercel.app/hire\n\nIf you'd rather a lower-ticket start: https://doyintech.vercel.app/products\n\nReply with the best time for a 15-min call, or "deposit" and I'll send payment steps.\n\nSilas · DoyinTech`,
  },
  {
    id: "linkedin-connect",
    channel: "LinkedIn",
    title: "Connection note (short)",
    body: `Hi [First name] — saw [Business] in [City]. Noticed [specific issue]. I help local businesses fix that (DoyinTech). Open to a free 3-min digital audit?`,
  },
  {
    id: "linkedin-follow",
    channel: "LinkedIn",
    title: "After they accept",
    body: `Thanks for connecting, [First name].\n\nIf useful, I can send a short digital audit for [Business] — two specific issues on the site/Google presence and one recommended fix. No pitch deck, just practical notes.\n\nReply "audit" and I'll send it this week.`,
  },
  {
    id: "follow-day3",
    channel: "Email / LinkedIn",
    title: "Day-3 follow-up",
    body: `Hi [First name] — following up on my note about [Business]. Still happy to send the free audit (2 issues + 1 fix). Takes a few minutes; zero pressure.\n\nSilas · DoyinTech\nhttps://doyintech.vercel.app/free-audit`,
  },
  {
    id: "follow-day7",
    channel: "Email / LinkedIn",
    title: "Day-7 last touch",
    body: `Hi [First name] — last note from me. If timing is wrong, no problem. If you'd like the free digital audit for [Business], just reply "audit" and I'll send it.\n\nSilas · DoyinTech`,
  },
  {
    id: "reply-interested",
    channel: "Any",
    title: "They said yes / interested",
    body: `Great — thanks [First name].\n\nPlease send:\n1) Your website URL (or "no site")\n2) Main goal (more calls / WhatsApp / bookings)\n3) Best number or email for a 15-min call\n\nI'll reply with the 3-minute audit and, if it fits, a clear fixed package: https://doyintech.vercel.app/hire`,
  },
  {
    id: "reply-too-expensive",
    channel: "Any",
    title: "Price objection",
    body: `Understood — budget matters.\n\nTwo options:\n1) Start with a smaller scope (Landing Page Starter — ₦100k)\n2) DIY packs first: https://doyintech.vercel.app/products\n\nWhich is closer to what you need this month?`,
  },
  {
    id: "reply-has-developer",
    channel: "Any",
    title: "They already have a developer",
    body: `Makes sense.\n\nIf you ever need a second opinion on conversion (mobile, WhatsApp path, booking), the free audit is still open: https://doyintech.vercel.app/free-audit\n\nHappy to stay a useful contact either way.`,
  },
  {
    id: "ig-dm",
    channel: "Instagram DM",
    title: "Local business IG",
    body: `Hi — love what [Business] is doing in [City].\n\nOne thing: your bio/link doesn't make it super easy to book. I help businesses fix that (site + WhatsApp).\n\nFree quick audit if you want: https://doyintech.vercel.app/free-audit`,
  },
  {
    id: "product-push",
    channel: "WhatsApp / Status",
    title: "Digital product only (no service)",
    body: `If you run sales on WhatsApp, this helps this week:\n\n• Status & Caption Pack\n• 30-day Status Sales Calendar\n• Or SME Launch Bundle (both)\n\nPay with Paystack → instant download\nhttps://doyintech.vercel.app/products`,
  },
];
