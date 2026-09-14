export type PageTemplate = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceNgn: number;
  amountKobo: number;
  badge?: string;
  stack: string[];
  pages: string[];
  includes: string[];
  previewOutline: string;
  fullGuide: string;
  category: "agency" | "saas" | "local-business" | "portfolio" | "ecommerce";
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "tpl-agency-dark",
    slug: "dark-agency-landing",
    name: "Dark Agency Landing",
    tagline: "Apple-style agency homepage — hero, services, proof, CTA",
    description:
      "Complete landing structure for software agencies: dark theme, hero with dual CTA, services grid, stats, testimonials placeholders, pricing teaser, WhatsApp contact. Next.js App Router + Tailwind.",
    priceNgn: 45000,
    amountKobo: 4500000,
    badge: "Best seller",
    stack: ["Next.js", "Tailwind", "App Router"],
    pages: ["Home (single page sections)"],
    includes: [
      "page.tsx section map",
      "Hero + Services + Stats + Pricing teaser + Contact",
      "WhatsApp + Email dual CTA",
      "Deploy notes for Vercel",
    ],
    category: "agency",
    previewOutline: `Sections:
1. Glass navbar
2. Hero (headline + Book call + See work)
3. Logo/trust strip
4. Services (3 cards)
5. Stats row
6. Case study teaser
7. Pricing teaser
8. Dual CTA contact
9. Footer`,
    fullGuide: `# Dark Agency Landing — DoyinTech Template

## Stack
Next.js App Router, Tailwind CSS, optional Framer Motion.

## File plan
- app/page.tsx — compose sections
- components/Hero.tsx
- components/ServicesGrid.tsx
- components/StatsRow.tsx
- components/PricingTeaser.tsx
- components/ContactCta.tsx
- components/GlassNavbar.tsx

## Hero copy pattern
Headline: We build websites and systems that get clients.
Sub: For SMEs and founders who need results, not jargon.
CTA1: Book a free call (WhatsApp)
CTA2: View work

## Colors
Background #0a0e17, text white, accent #ff8c14, WhatsApp #25D366.

## Deploy
1. npx create-next-app@latest
2. Paste sections
3. Set WhatsApp number
4. vercel deploy

Support: doyintechnology@outlook.com
`,
  },
  {
    id: "tpl-local-sme",
    slug: "local-business-site",
    name: "Local Business Site (5 pages)",
    tagline: "Salon, clinic, school, shop — Home, Services, About, Gallery, Contact",
    description:
      "Multi-page kit for local Nigerian businesses. Clear offers, WhatsApp booking, Google-friendly structure. Swap copy and photos per niche.",
    priceNgn: 55000,
    amountKobo: 5500000,
    badge: "SME",
    stack: ["Next.js", "Tailwind"],
    pages: ["Home", "Services", "About", "Gallery", "Contact"],
    includes: [
      "5 App Router pages",
      "Shared layout + navbar",
      "WhatsApp book buttons",
      "SEO title/description per page",
    ],
    category: "local-business",
    previewOutline: `app/
  page.tsx          Home
  services/page.tsx
  about/page.tsx
  gallery/page.tsx
  contact/page.tsx
components/Navbar, Footer, ServiceCard, WaButton`,
    fullGuide: `# Local Business Site — 5 Pages

## Pages
1. Home — hero, top services, testimonials, CTA
2. Services — list with prices optional
3. About — story + team
4. Gallery — image grid (use next/image)
5. Contact — map link + WhatsApp + email

## Must-have on every page
- Phone / WhatsApp in header
- Clear primary action: Book / Order / Call

## Content checklist for client
- 6 photos, 3 services, 1 address, hours, prices

## Deploy
Vercel + custom domain + Google Business Profile link.
`,
  },
  {
    id: "tpl-saas-waitlist",
    slug: "saas-waitlist-landing",
    name: "SaaS Waitlist Landing",
    tagline: "Product hero, features, FAQ, email/WhatsApp waitlist",
    description:
      "Single-page SaaS launch template: problem/solution hero, 3 features, social proof, FAQ, waitlist CTA (email or WhatsApp). Perfect for new products.",
    priceNgn: 38000,
    amountKobo: 3800000,
    stack: ["Next.js", "Tailwind"],
    pages: ["Landing"],
    includes: ["Hero", "Feature grid", "FAQ accordion structure", "Waitlist CTA"],
    category: "saas",
    previewOutline: `Hero → Logos → Features → How it works → FAQ → Waitlist CTA`,
    fullGuide: `# SaaS Waitlist Landing

## Message formula
For [who] who struggle with [pain], [product] helps them [outcome] without [objection].

## Sections
1. Hero + screenshot placeholder
2. 3 feature cards
3. How it works (3 steps)
4. FAQ (5 questions)
5. Final CTA — Join waitlist (WhatsApp or form)

## Metrics to track
Waitlist signups / week. Change only headline first.
`,
  },
  {
    id: "tpl-freelancer-portfolio",
    slug: "freelancer-portfolio",
    name: "Freelancer Portfolio",
    tagline: "Work grid, about, skills, hire CTA",
    description:
      "Clean portfolio for developers and designers: projects grid, case blurbs, skills, and strong hire-me WhatsApp/email CTA.",
    priceNgn: 32000,
    amountKobo: 3200000,
    stack: ["Next.js", "Tailwind"],
    pages: ["Home", "Work", "About", "Contact"],
    includes: ["Project card", "Skills chips", "Hire CTA"],
    category: "portfolio",
    previewOutline: `Home hero → Selected work → Skills → About → Contact`,
    fullGuide: `# Freelancer Portfolio

## Project card fields
title, role, stack tags, 2-line result, link

## Hire CTA
Always visible: Available for projects → WhatsApp

## Tip
Show 3–6 projects max. Depth beats volume.
`,
  },
  {
    id: "tpl-product-sales",
    slug: "digital-product-sales-page",
    name: "Digital Product Sales Page",
    tagline: "Sell ebooks, courses, kits — hero, benefits, FAQ, buy",
    description:
      "Long-form sales page layout for digital products: promise, benefits, what's inside, testimonials slot, price, FAQ, buy button (Paystack-ready).",
    priceNgn: 40000,
    amountKobo: 4000000,
    badge: "Commerce",
    stack: ["Next.js", "Tailwind", "Paystack-ready"],
    pages: ["Sales page"],
    includes: ["Benefit list", "Price block", "FAQ", "Buy CTA"],
    category: "ecommerce",
    previewOutline: `Hero promise → Benefits → What's inside → Price → FAQ → Buy`,
    fullGuide: `# Digital Product Sales Page

## Structure
1. Headline outcome
2. Sub: who it's for
3. 5 benefits
4. What's inside (bullets)
5. Price + guarantee line
6. FAQ
7. Buy button → Paystack initialize

## Copy tip
Lead with result, not file format.
`,
  },
  {
    id: "tpl-bundle-all",
    slug: "all-templates-bundle",
    name: "All Templates Bundle",
    tagline: "Every page template — agency, SME, SaaS, portfolio, sales",
    description:
      "Unlock all DoyinTech page templates in one payment. Best for freelancers who ship client sites weekly.",
    priceNgn: 150000,
    amountKobo: 15000000,
    badge: "Best value",
    stack: ["Next.js", "Tailwind"],
    pages: ["All templates"],
    includes: [
      "Dark Agency Landing",
      "Local Business 5-page",
      "SaaS Waitlist",
      "Freelancer Portfolio",
      "Digital Product Sales Page",
    ],
    category: "agency",
    previewOutline: `5 full templates · one license · commercial use for client projects`,
    fullGuide: `# All Templates Bundle — DoyinTech

License: use on unlimited client projects.
Redistribution of source as a competing template pack is not allowed.

After payment, open each template page with unlock, or request ZIP on WhatsApp.

Support: doyintechnology@outlook.com | +234 808 534 3926
`,
  },
];

export function getPageTemplate(slug: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
}

export function formatTplPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
