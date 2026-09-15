export type OutreachTemplate = {
  id: string;
  channel: string;
  title: string;
  body: string;
};

/** Copy-paste outreach scripts — personalize [BRACKETS] before sending */
export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "wa-status-hire",
    channel: "WhatsApp Status",
    title: "Fixed-price website offer",
    body: `Local businesses: get a professional website in 7–14 days.

Fixed price. 50% deposit. WhatsApp-ready.

→ https://doyintech.vercel.app/hire

Reply HIRE if you want details.`,
  },
  {
    id: "wa-status-audit",
    channel: "WhatsApp Status",
    title: "Free audit",
    body: `Free 3-minute website audit for SMEs.

Send your URL → we reply with 2–3 specific problems holding back enquiries.

→ https://doyintech.vercel.app/free-audit

Or reply AUDIT with your link.`,
  },
  {
    id: "wa-status-product",
    channel: "WhatsApp Status",
    title: "SME Launch Bundle",
    body: `Selling on WhatsApp Status but not getting chats?

SME Launch Bundle: 30-day Status calendar + 120 captions.
Pay online. Instant download.

→ https://doyintech.vercel.app/products

Reply STATUS for the link.`,
  },
  {
    id: "wa-dm-local",
    channel: "WhatsApp DM (Nigeria / local)",
    title: "Warm local outreach",
    body: `Hi [Name], I saw [Business] online / around [Area].

Quick question — do new customers find it easy to message you and book from your website (or do most people only find you by referral)?

I run DoyinTech. We build simple sites that push people to WhatsApp. Fixed packages here: https://doyintech.vercel.app/hire

Happy to send a free 3-min audit of your current page if you share the link.`,
  },
  {
    id: "email-us-cold",
    channel: "Email (US)",
    title: "Cold email — US local business",
    body: `Subject: Quick note on [Business]'s website

Hi [First name],

I came across [Business] while looking at [City] [industry] businesses.

I noticed [specific issue — e.g. the site is hard to use on mobile / no clear way to book]. That often costs enquiries even when the service is excellent.

I run DoyinTech — we help local businesses fix this with modern sites, booking paths, and simple automation.

I can send a free 3-minute digital audit (two concrete issues + one recommended fix). No obligation.

Worth a look?

Silas · DoyinTech
https://doyintech.vercel.app/hire
https://doyintech.vercel.app/free-audit
doyintechnology@outlook.com`,
  },
  {
    id: "email-uk-cold",
    channel: "Email (UK)",
    title: "Cold email — UK local business",
    body: `Subject: [Business] — small digital observation

Hello [First name],

I was researching [industry] businesses in [City] and found [Business].

One thing stood out: [specific issue]. Many UK microbusinesses have a site that works, but still lose leads because booking or mobile experience is weak.

I'm with DoyinTech. We offer a complimentary 3-minute digital audit — two specific points and one practical next step.

Happy to send it over if useful.

Kind regards,
Silas · DoyinTech
https://doyintech.vercel.app
doyintechnology@outlook.com`,
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
    body: `Thanks for connecting, [First name].

If useful, I can send a short digital audit for [Business] — two specific issues on the site/Google presence and one recommended fix. No pitch deck, just practical notes.

Reply "audit" and I'll send it this week.`,
  },
  {
    id: "follow-day3",
    channel: "Email / LinkedIn",
    title: "Day-3 follow-up",
    body: `Hi [First name] — following up on my note about [Business]. Still happy to send the free audit (2 issues + 1 fix). Takes a few minutes; zero pressure.

Silas · DoyinTech
https://doyintech.vercel.app/free-audit`,
  },
  {
    id: "follow-day7",
    channel: "Email / LinkedIn",
    title: "Day-7 last touch",
    body: `Hi [First name] — last note from me. If timing is wrong, no problem. If you'd like the free digital audit for [Business], just reply "audit" and I'll send it.

Silas · DoyinTech`,
  },
  {
    id: "reply-interested",
    channel: "Any",
    title: "They said yes / interested",
    body: `Great — thanks [First name].

Please send:
1) Your website URL (or "no site")
2) Main goal (more calls / WhatsApp / bookings)
3) Best number or email for a 15-min call

I'll reply with the 3-minute audit and, if it fits, a clear fixed package: https://doyintech.vercel.app/hire`,
  },
  {
    id: "reply-too-expensive",
    channel: "Any",
    title: "Price objection",
    body: `Understood — budget matters.

Two options:
1) Start with a smaller scope (landing page / core pages only)
2) Use a DIY pack first (Status calendar + captions): https://doyintech.vercel.app/products

Which is closer to what you need this month?`,
  },
  {
    id: "reply-has-developer",
    channel: "Any",
    title: "They already have a developer",
    body: `Makes sense.

If you ever need a second opinion on conversion (mobile, WhatsApp path, booking), the free audit is still open: https://doyintech.vercel.app/free-audit

Happy to stay a useful contact either way.`,
  },
  {
    id: "ig-dm",
    channel: "Instagram DM",
    title: "Local business IG",
    body: `Hi — love what [Business] is doing in [City].

One thing: your bio/link doesn't make it super easy to book. I help businesses fix that (site + WhatsApp).

Free quick audit if you want: https://doyintech.vercel.app/free-audit`,
  },
  {
    id: "product-push",
    channel: "WhatsApp / Status",
    title: "Digital product only (no service)",
    body: `If you run sales on WhatsApp, this helps this week:

• Status & Caption Pack
• 30-day Status Sales Calendar
• Or SME Launch Bundle (both)

Pay with Paystack → instant download
https://doyintech.vercel.app/products`,
  },
];
