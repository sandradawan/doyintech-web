export type EbookChapter = { title: string; body: string };

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
  /** Cover gradient stops */
  coverFrom: string;
  coverTo: string;
  accent: string;
  icon: string;
  blurb: string;
  benefits: string[];
  chapters: EbookChapter[];
  badge?: string;
};

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
    badge: "Bestseller format",
    blurb:
      "A no-fluff playbook for salons, shops, agencies, and service businesses that live on WhatsApp. Greeting menus, away messages, price lists, and follow-up sequences you can copy today.",
    benefits: [
      "Ready-to-copy greeting & menu scripts",
      "Away-message and after-hours rules",
      "How to qualify leads before you call",
      "Simple follow-up sequence (Day 0 / 2 / 5)",
    ],
    chapters: [
      {
        title: "1. Why WhatsApp is your real storefront",
        body: `Most small businesses in Africa and emerging markets do more selling in WhatsApp than on their website. That is not a problem — it is an advantage if you treat chats like a system.\n\nYour goals:\n• Reply fast without living on your phone 24/7\n• Sound professional even when you are busy\n• Move from \"how much?\" to a paid booking or invoice\n\nThis guide gives you scripts and rules. Adapt the words to your brand voice; keep the structure.`,
      },
      {
        title: "2. The 4-message foundation",
        body: `Every serious WhatsApp Business setup needs four building blocks:\n\n1. Greeting — who you are + what you do + how to choose an option\n2. Menu — numbered choices (prices, book, location, human)\n3. Away message — when you cannot reply live\n4. Quick replies — saved answers for prices, address, payment\n\nWithout these, every chat starts from zero and you lose hours.`,
      },
      {
        title: "3. Greeting & menu scripts",
        body: `Template:\n\n👋 Welcome to [Business]. We help [who] with [result].\n\nReply with a number:\n1 — Prices / packages\n2 — Book an appointment\n3 — Location & hours\n4 — Talk to a person\n\nTip: Put your best offer on option 1. Most people tap the first choice.`,
      },
      {
        title: "4. Away message that still sells",
        body: `Bad: \"I will reply later.\"\n\nBetter:\nThanks for messaging [Business]. We are currently offline ([hours]). Leave your name, what you need, and preferred time — we reply in order when we open. For urgent jobs, call [number].\n\nYou collect lead data even while you sleep.`,
      },
      {
        title: "5. Follow-up without being annoying",
        body: `Day 0: Confirm you received their request + next step.\nDay 2: Soft check-in + one benefit or social proof.\nDay 5: Final polite close or \"should I close this request?\"\n\nNever send five messages in one day. One clear question beats a wall of text.`,
      },
      {
        title: "6. Payment & professionalism",
        body: `Always confirm:\n• What they ordered\n• Price and currency\n• Payment method\n• Delivery / appointment time\n\nSend a simple invoice (your DoyinTech invoice tools work well here). Screenshot of transfer is not a system — a numbered invoice is.`,
      },
      {
        title: "7. 7-day action plan",
        body: `Day 1: Write greeting + menu.\nDay 2: Set away message + hours.\nDay 3: Save 5 quick replies.\nDay 4: Create price list image or PDF.\nDay 5: Practice follow-up templates.\nDay 6: Ask 3 happy clients for a short review text.\nDay 7: Review response time and tighten scripts.\n\nConsistency beats clever wording.`,
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
    badge: "Career",
    blurb:
      "Stop waiting for job boards. Learn how to find local and remote clients, package simple offers, price without panic, and close without sounding desperate.",
    benefits: [
      "Where to find clients this week",
      "Offer packages clients understand",
      "Pricing ranges and negotiation lines",
      "Proposal structure that gets replies",
    ],
    chapters: [
      {
        title: "1. Clients buy outcomes, not frameworks",
        body: `Nobody wakes up wanting \"a Next.js site.\" They want more enquiries, a professional look, online booking, or fewer WhatsApp arguments about prices.\n\nLead with the outcome. Technology is how you deliver it.`,
      },
      {
        title: "2. Where clients actually are",
        body: `• Local businesses with ugly or broken sites\n• Friends of businesses you already helped\n• LinkedIn posts from founders hiring \"someone technical\"\n• Communities (school, church, alumni) — warm intros beat cold DMs\n\nAim for conversations, not spray-and-pray applications.`,
      },
      {
        title: "3. Three offers that are easy to buy",
        body: `1. Fix & polish — mobile + speed + contact form (fixed price)\n2. New brochure site — 4–6 pages (fixed price)\n3. Monthly care — updates + backups + small changes\n\nFixed prices reduce fear. Hourly rates confuse non-technical buyers.`,
      },
      {
        title: "4. Simple pricing logic",
        body: `Price from value and alternatives:\n• What would an agency charge?\n• What does one extra customer a month pay them?\n• What is your minimum for the week of work?\n\nNever price only from desperation. State a number, then stop talking.`,
      },
      {
        title: "5. Proposal in one page",
        body: `• Problem you observed\n• What you will deliver\n• Timeline\n• Investment\n• Payment terms (e.g. 50% start, 50% launch)\n• What is out of scope\n\nShort proposals get read. Long ones get ignored.`,
      },
      {
        title: "6. Closing and delivery",
        body: `After yes: invoice, kickoff questions, shared folder, weekly update.\nUnder-promise dates. Over-communicate blockers.\nAsk for a testimonial the day they are happiest — usually launch day.`,
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
    blurb:
      "Passwords, 2FA, fake invoices, staff access, and website hygiene — practical steps for owners who are not security experts.",
    benefits: [
      "Password & 2FA checklist",
      "How fake payment scams work",
      "Staff access rules that prevent disasters",
      "Website basics (HTTPS, updates, backups)",
    ],
    chapters: [
      {
        title: "1. You are a target (even if you are small)",
        body: `Attackers automate. They do not care that you have five staff. Email, WhatsApp, and bank apps are enough.\n\nYour job is not perfect security. It is removing easy wins for criminals.`,
      },
      {
        title: "2. Passwords and 2FA",
        body: `• Unique passwords for email and banking\n• A password manager if possible\n• Turn on 2FA (authenticator app preferred over SMS when you can)\n• Never share OTPs on WhatsApp — banks never need that`,
      },
      {
        title: "3. Invoice and payment fraud",
        body: `Verify bank detail changes by a phone call to a known number — not the number in the suspicious email.\n\nTrain staff: urgency + secrecy + new account number = stop and verify.`,
      },
      {
        title: "4. Website hygiene",
        body: `HTTPS on, plugins/themes updated, admin passwords strong, backups offline, contact forms protected from spam.\n\nIf you cannot maintain WordPress, simplify the stack or hire care plans.`,
      },
      {
        title: "5. 14-day hardening plan",
        body: `Week 1: email 2FA, bank 2FA, unique passwords.\nWeek 2: staff access review, backup test, website update pass.\n\nWrite who owns each account. Shared \"company Gmail\" with no owner is a crisis waiting to happen.`,
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
    badge: "Founders",
    blurb:
      "For non-technical founders: what pages you need, what to skip, how to brief a developer, and how to avoid rebuilding three times.",
    benefits: [
      "Page checklist for a v1 site",
      "How to brief a developer clearly",
      "Budget and timeline reality checks",
      "Launch and post-launch habits",
    ],
    chapters: [
      {
        title: "1. A website is a sales tool",
        body: `If it does not help someone trust you or contact you, it is decoration.\n\nV1 goals: clear offer, proof, contact path, mobile-friendly, fast enough.`,
      },
      {
        title: "2. Pages you actually need",
        body: `Home · Services · About · Proof (work or testimonials) · Contact.\nOptional later: blog, portal, complex animations.\n\nShip the core first.`,
      },
      {
        title: "3. Briefing without jargon",
        body: `Write:\n• Who the customer is\n• What you sell\n• 3 competitors you like/dislike\n• Must-have pages\n• Budget and deadline\n\nScreenshots beat abstract taste debates.`,
      },
      {
        title: "4. Budget honesty",
        body: `Cheap and vague costs more later.\nPay for clarity: fixed scope, milestones, who provides content and photos.\nDomain and hosting are separate from design.`,
      },
      {
        title: "5. Launch week",
        body: `Test forms on mobile. Check links. Connect WhatsApp or email alerts.\nAdd the site to Google Business if local.\nPlan one improvement per month — not a full redesign every panic.`,
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
