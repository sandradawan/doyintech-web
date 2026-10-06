export type EbookChapter = {
  title: string;
  body: string;
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

export const EBOOKS_PART1: Ebook[] = [
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
];
