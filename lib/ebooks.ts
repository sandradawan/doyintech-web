export type EbookChapter = {
  title: string;
  body: string;
  /** Demonstrative image URL for PDF / illustrated reader */
  image?: string;
  imageCaption?: string;
};

export type Ebook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  priceNgn: number;
  amountKobo: number;
  pagesLabel: string;
  category: string;
  coverFrom: string;
  coverTo: string;
  accent: string;
  icon: string;
  coverImage: string;
  blurb: string;
  benefits: string[];
  chapters: EbookChapter[];
  badge?: string;
};

/**
 * Original DoyinTech guides. Not copies of Amazon titles.
 */
export const EBOOKS: Ebook[] = [
  {
    id: "ebook-whatsapp-sme",
    slug: "whatsapp-business-playbook",
    title: "WhatsApp Business Playbook",
    subtitle: "Turn chats into paying customers — scripts, menus & follow-ups for SMEs",
    author: "DoyinTech",
    priceNgn: 7500,
    amountKobo: 750000,
    pagesLabel: "42-page practical guide",
    category: "Marketing",
    coverFrom: "#0b1f3a",
    coverTo: "#0d9488",
    accent: "#2dd4bf",
    icon: "💬",
    coverImage:
      "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=900&q=85",
    badge: "Hot niche",
    blurb:
      "A no-fluff playbook for salons, shops, agencies, and service businesses that live on WhatsApp.",
    benefits: [
      "Ready-to-copy greeting & menu scripts",
      "Away-message and after-hours rules",
      "How to qualify leads before you call",
      "Simple follow-up sequence (Day 0 / 2 / 5)",
    ],
    chapters: [
      {
        title: "1. Why WhatsApp is your real storefront",
        body: `Most small businesses do more selling in WhatsApp than on their website. Treat chats like a system: reply fast, sound professional, move from "how much?" to a paid booking.`,
        image:
          "https://images.unsplash.com/photo-1512941937669-90a1b58d7ffe?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Your phone is often the real storefront.",
      },
      {
        title: "2. The 4-message foundation",
        body: `Greeting · Menu · Away message · Quick replies. Without these, every chat starts from zero.`,
        image:
          "https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Structure beats scrambling for every reply.",
      },
      {
        title: "3. Greeting & menu scripts",
        body: `Welcome to [Business]. Reply:\n1 — Prices\n2 — Book\n3 — Location\n4 — Talk to a person\n\nPut your best offer on option 1.`,
      },
      {
        title: "4. Away message that still sells",
        body: `Collect name, need, and preferred time while offline. Offer a phone number only for true emergencies.`,
      },
      {
        title: "5. Follow-up without being annoying",
        body: `Day 0 confirm · Day 2 soft check-in · Day 5 polite close. One clear question beats a wall of text.`,
        image:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Follow-up is a system, not spam.",
      },
      {
        title: "6. Payment & professionalism",
        body: `Confirm order, price, method, and time. Use a numbered invoice — not only transfer screenshots.`,
      },
      {
        title: "7. 7-day action plan",
        body: `Build scripts, save quick replies, add a price list, collect three review lines, measure response time.`,
      },
    ],
  },
  {
    id: "ebook-first-clients",
    slug: "first-paying-web-clients",
    title: "Your First Paying Web Clients",
    subtitle: "A practical field guide for developers & freelancers who need real projects",
    author: "DoyinTech",
    priceNgn: 9500,
    amountKobo: 950000,
    pagesLabel: "38-page field guide",
    category: "Freelancing",
    coverFrom: "#1e1b4b",
    coverTo: "#c2410c",
    accent: "#fb923c",
    icon: "💻",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
    badge: "Career",
    blurb:
      "Find local and remote clients, package simple offers, price without panic, and close without sounding desperate.",
    benefits: [
      "Where to find clients this week",
      "Offer packages clients understand",
      "Pricing ranges and negotiation lines",
      "Proposal structure that gets replies",
    ],
    chapters: [
      {
        title: "1. Clients buy outcomes, not frameworks",
        body: `Lead with more enquiries, trust, and booking — not framework names.`,
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Sell the result the client feels.",
      },
      {
        title: "2. Where clients actually are",
        body: `Broken local sites, warm intros, LinkedIn founders, community networks.`,
      },
      {
        title: "3. Three offers that are easy to buy",
        body: `Fix & polish · New brochure site · Monthly care — fixed prices reduce fear.`,
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Clear packages close faster than hourly rates.",
      },
      {
        title: "4. Simple pricing logic",
        body: `Anchor on value and alternatives. State a number, then stop talking.`,
      },
      {
        title: "5. Proposal in one page",
        body: `Problem · Deliverables · Timeline · Investment · Terms · Out of scope.`,
      },
      {
        title: "6. Closing and delivery",
        body: `Invoice, kickoff, weekly updates, testimonial on launch day.`,
      },
    ],
  },
  {
    id: "ebook-sme-security",
    slug: "small-business-cyber-basics",
    title: "Small Business Cyber Basics",
    subtitle: "Protect accounts, customers, and payments — without an IT department",
    author: "DoyinTech",
    priceNgn: 6500,
    amountKobo: 650000,
    pagesLabel: "30-page security guide",
    category: "Security",
    coverFrom: "#14532d",
    coverTo: "#0f172a",
    accent: "#4ade80",
    icon: "🔒",
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=85",
    blurb:
      "Passwords, 2FA, fake invoices, staff access, and website hygiene for non-technical owners.",
    benefits: [
      "Password & 2FA checklist",
      "How fake payment scams work",
      "Staff access rules",
      "Website basics (HTTPS, updates, backups)",
    ],
    chapters: [
      {
        title: "1. You are a target",
        body: `Automation means small businesses are still targets. Remove easy wins.`,
        image:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Security is risk reduction, not perfection.",
      },
      {
        title: "2. Passwords and 2FA",
        body: `Unique passwords, manager if possible, 2FA on email and bank. Never share OTPs.`,
      },
      {
        title: "3. Invoice and payment fraud",
        body: `Verify bank changes by calling a known number. Urgency + secrecy = stop.`,
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Verify payment detail changes offline.",
      },
      {
        title: "4. Website hygiene",
        body: `HTTPS, updates, strong admin, backups, spam-protected forms.`,
      },
      {
        title: "5. 14-day hardening plan",
        body: `Week 1: accounts. Week 2: staff access, backup test, site update.`,
      },
    ],
  },
  {
    id: "ebook-founder-website",
    slug: "founder-website-launch",
    title: "Founder Website Launch",
    subtitle: "From blank page to live site — decisions that save money and time",
    author: "DoyinTech",
    priceNgn: 8500,
    amountKobo: 850000,
    pagesLabel: "36-page founder guide",
    category: "Business",
    coverFrom: "#312e81",
    coverTo: "#9f1239",
    accent: "#f472b6",
    icon: "🚀",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    badge: "Founders",
    blurb:
      "For non-technical founders: pages you need, how to brief a developer, budgets, and launch habits.",
    benefits: [
      "Page checklist for a v1 site",
      "How to brief a developer",
      "Budget and timeline reality",
      "Launch and post-launch habits",
    ],
    chapters: [
      {
        title: "1. A website is a sales tool",
        body: `Trust, offer clarity, contact path, mobile-friendly, fast enough.`,
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Ship a clear offer before fancy animation.",
      },
      {
        title: "2. Pages you actually need",
        body: `Home · Services · About · Proof · Contact. Blog later.`,
      },
      {
        title: "3. Briefing without jargon",
        body: `Customer · offer · competitors · must-haves · budget · deadline.`,
      },
      {
        title: "4. Budget honesty",
        body: `Cheap and vague costs more later. Fixed scope and milestones win.`,
      },
      {
        title: "5. Launch week",
        body: `Test forms, links, alerts. Google Business if local. One improvement a month.`,
        image:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Launch is a checklist, not a miracle day.",
      },
    ],
  },
  {
    id: "ebook-ai-sme",
    slug: "ai-for-small-business",
    title: "AI for Small Business",
    subtitle: "Practical ChatGPT workflows for owners — not hype, not coding",
    author: "DoyinTech",
    priceNgn: 8900,
    amountKobo: 890000,
    pagesLabel: "40-page AI playbook",
    category: "AI & Productivity",
    coverFrom: "#0f172a",
    coverTo: "#4c1d95",
    accent: "#a78bfa",
    icon: "🤖",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
    badge: "Amazon trend",
    blurb:
      "Use AI for offers, replies, content, and SOPs without becoming a prompt engineer.",
    benefits: [
      "Daily AI use-cases for SMEs",
      "Prompt patterns that stay useful",
      "Customer reply & content drafts",
      "What not to trust AI with",
    ],
    chapters: [
      {
        title: "1. AI is an intern, not a CEO",
        body: `Use AI to draft and accelerate. You still decide prices, promises, and legal claims. Never paste secrets or full customer databases into public tools.`,
        image:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
        imageCaption: "AI drafts. You decide.",
      },
      {
        title: "2. Five jobs AI does well for SMEs",
        body: `1) First-draft WhatsApp/email replies\n2) Service page outlines\n3) FAQ lists from real questions\n4) Checklist SOPs for staff\n5) Social captions from one offer bullet\n\nStart with one job for seven days.`,
      },
      {
        title: "3. Prompt pattern that works",
        body: `Role + audience + task + constraints + format.\n\nExample: You are a polite salon receptionist. Write a WhatsApp reply about bridal makeup price. Mention packages start at X. Ask date and location. 6 lines max.`,
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Clear prompts beat clever ones.",
      },
      {
        title: "4. Content without sounding fake",
        body: `Feed AI your real facts: prices, hours, cities, guarantees. Edit every output. Add one human detail AI cannot invent.`,
      },
      {
        title: "5. 14-day AI adoption plan",
        body: `Days 1–3: replies only.\nDays 4–7: one weekly post draft.\nDays 8–10: SOP for a repeated task.\nDays 11–14: measure time saved; keep only what stuck.`,
      },
    ],
  },
  {
    id: "ebook-one-page-marketing",
    slug: "one-page-marketing-plan",
    title: "One-Page Marketing Plan",
    subtitle: "Get customers without a 40-page strategy deck",
    author: "DoyinTech",
    priceNgn: 7900,
    amountKobo: 790000,
    pagesLabel: "34-page marketing guide",
    category: "Marketing",
    coverFrom: "#1c1917",
    coverTo: "#9a3412",
    accent: "#fb923c",
    icon: "📣",
    coverImage:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=85",
    badge: "Amazon trend",
    blurb:
      "Define who buys, the message, the channel, and the weekly actions on one page.",
    benefits: [
      "Fill-in one-page template",
      "Message that is not vague",
      "Channel choice for local SMEs",
      "Weekly scoreboard",
    ],
    chapters: [
      {
        title: "1. Strategy is choices, not slides",
        body: `If everything is a priority, nothing is. One page forces trade-offs.`,
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        imageCaption: "One page beats a forgotten deck.",
      },
      {
        title: "2. Who exactly pays you",
        body: `Write one primary customer: job, pain, where they hang out, what they tried before.`,
      },
      {
        title: "3. Promise in one sentence",
        body: `We help [who] achieve [result] without [pain], so they can [outcome].`,
      },
      {
        title: "4. Pick two channels max",
        body: `Examples: Google Business + WhatsApp, or Instagram + referrals.`,
        image:
          "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Master two channels before adding a third.",
      },
      {
        title: "5. Weekly actions & scoreboard",
        body: `Track: enquiries, booked calls, paid jobs, referral asks. Review every Monday.`,
      },
    ],
  },
  {
    id: "ebook-cash-first",
    slug: "cash-first-small-business",
    title: "Cash-First Small Business",
    subtitle: "Stop confusing revenue with money you can spend",
    author: "DoyinTech",
    priceNgn: 8200,
    amountKobo: 820000,
    pagesLabel: "32-page money guide",
    category: "Finance",
    coverFrom: "#052e16",
    coverTo: "#171717",
    accent: "#86efac",
    icon: "💵",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=85",
    badge: "Amazon trend",
    blurb:
      "Separate pots, owner pay, tax buffer, and simple weekly rituals for SMEs.",
    benefits: [
      "Why busy businesses still go broke",
      "Simple account / pot system",
      "Owner pay without guilt",
      "Weekly 20-minute money ritual",
    ],
    chapters: [
      {
        title: "1. Revenue is not safety",
        body: `High turnover with no buffer is a trap. Cash timing kills more SMEs than lack of customers.`,
        image:
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Cash in the bank beats vanity revenue.",
      },
      {
        title: "2. Split money on purpose",
        body: `Create pots: Operating · Owner · Tax/compliance · Growth buffer.`,
      },
      {
        title: "3. Pay yourself like a bill",
        body: `Owner pay is not leftover crumbs. Schedule it.`,
      },
      {
        title: "4. Price with cash in mind",
        body: `Include delivery cost, tools, tax buffer, and your time.`,
      },
      {
        title: "5. Weekly money ritual",
        body: `20 minutes: balances, invoices, bills due, pot transfers, one decision.`,
        image:
          "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Same day every week keeps cash clear.",
      },
    ],
  },
  {
    id: "ebook-founder-habits",
    slug: "founder-daily-systems",
    title: "Founder Daily Systems",
    subtitle: "Small weekly systems that compound — not motivational noise",
    author: "DoyinTech",
    priceNgn: 7200,
    amountKobo: 720000,
    pagesLabel: "28-page systems guide",
    category: "Productivity",
    coverFrom: "#422006",
    coverTo: "#0c0a09",
    accent: "#fbbf24",
    icon: "⚙️",
    coverImage:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78ebb4f?auto=format&fit=crop&w=900&q=85",
    badge: "Amazon trend",
    blurb:
      "Focused on founder realities: sales, delivery, and energy.",
    benefits: [
      "Morning/evening founder loops",
      "Sales block that actually happens",
      "Delivery without chaos",
      "Weekly review template",
    ],
    chapters: [
      {
        title: "1. Systems beat mood",
        body: `Motivation is weather. A calendar block is climate.`,
        image:
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Design defaults for tired days.",
      },
      {
        title: "2. The three founder blocks",
        body: `Make (delivery) · Sell (outreach/content) · Admin (money, messages).`,
      },
      {
        title: "3. Tiny habits that stick",
        body: `Attach new habits to existing anchors: after morning tea → 25 min outreach.`,
      },
      {
        title: "4. Protect deep work",
        body: `Silence notifications for one 90-minute block.`,
      },
      {
        title: "5. Weekly review (30 min)",
        body: `What shipped · what sold · what leaked time · one change next week.`,
      },
    ],
  },
  {
    id: "ebook-negotiate-close",
    slug: "negotiate-and-close",
    title: "Negotiate & Close",
    subtitle: "Win better deals without sounding aggressive",
    author: "DoyinTech",
    priceNgn: 8800,
    amountKobo: 880000,
    pagesLabel: "30-page negotiation guide",
    category: "Sales",
    coverFrom: "#1e3a5f",
    coverTo: "#0f172a",
    accent: "#38bdf8",
    icon: "🤝",
    coverImage:
      "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=900&q=85",
    badge: "Amazon trend",
    blurb:
      "Practical negotiation for freelancers and SMEs — written for real price talks.",
    benefits: [
      "Listen before you discount",
      "Scripts for when they say too expensive",
      "Anchoring without arrogance",
      "When to walk away",
    ],
    chapters: [
      {
        title: "1. Negotiation starts before the number",
        body: `Understand their problem and alternatives. Discounting first trains buyers to wait.`,
        image:
          "https://images.unsplash.com/photo-1556761175-4b46a572b936?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Listen first. Price second.",
      },
      {
        title: "2. Ask calibrated questions",
        body: `What does success look like by [date]? What have you tried? What is the cost of waiting?`,
      },
      {
        title: "3. When they say too expensive",
        body: `Do not collapse. Clarify scope, compare to cost of inaction, offer a smaller package — not a random 40% cut.`,
        image:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        imageCaption: "Trade scope before you slash price.",
      },
      {
        title: "4. Anchors and silence",
        body: `State your price clearly. Stop talking. Silence is a tool, not rudeness.`,
      },
      {
        title: "5. Walk-away line",
        body: `Know your minimum before the call. Walking away is how you keep a business.`,
      },
    ],
  },
];

export function getEbook(slug: string): Ebook | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}

export function formatEbookPrice(n: number): string {
  return `₦${n.toLocaleString("en-NG")}`;
}
