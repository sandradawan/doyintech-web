export type UiComponentPack = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceNgn: number;
  amountKobo: number;
  badge?: string;
  stack: string[];
  includes: string[];
  previewCode: string;
  fullCode: string;
  category: "navigation" | "forms" | "commerce" | "marketing" | "dashboard";
};

/** Impulse pricing so developers buy without friction. Bundle = best value. */
export const UI_COMPONENTS: UiComponentPack[] = [
  {
    id: "comp-navbar-glass",
    slug: "glass-navbar",
    name: "Glass Navbar",
    tagline: "Sticky glass header + mobile menu",
    description:
      "App Router navbar with glass blur, links, and mobile drawer. Drop into any Tailwind Next.js site.",
    priceNgn: 3500,
    amountKobo: 350000,
    badge: "Popular",
    stack: ["Next.js", "React", "Tailwind"],
    includes: ["Navbar.tsx", "Mobile menu", "App Router notes"],
    category: "navigation",
    previewCode: `// GlassNavbar — sticky glass header
export function GlassNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <a href="/" className="font-semibold text-white">Brand</a>
      </nav>
    </header>
  );
}`,
    fullCode: `"use client";
import { useState } from "react";
const links = [
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];
export default function GlassNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <a href="/" className="text-[15px] font-semibold text-white">YourBrand</a>
        <div className="hidden gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-xs text-white/80 hover:text-white">{l.name}</a>
          ))}
        </div>
        <button type="button" className="text-sm text-white md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-black/90 px-4 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block py-2 text-white" onClick={() => setOpen(false)}>{l.name}</a>
          ))}
        </div>
      )}
    </header>
  );
}`,
  },
  {
    id: "comp-pricing-cards",
    slug: "pricing-cards",
    name: "Pricing Cards Grid",
    tagline: "3-tier pricing with highlight plan",
    description: "Responsive pricing section with featured plan and CTAs for agencies and SaaS.",
    priceNgn: 4500,
    amountKobo: 450000,
    badge: "SaaS",
    stack: ["Next.js", "Tailwind"],
    includes: ["PricingCards.tsx", "Featured plan style"],
    category: "commerce",
    previewCode: `// 3 plans · middle featured`,
    fullCode: `const plans = [
  { name: "Starter", price: "₦45,000", features: ["5-page site", "WhatsApp CTA"], featured: false },
  { name: "Growth", price: "₦120,000", features: ["Custom design", "SEO basics"], featured: true },
  { name: "Pro", price: "₦250,000", features: ["Full product", "Priority support"], featured: false },
];
export default function PricingCards() {
  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 md:grid-cols-3">
      {plans.map((p) => (
        <div key={p.name} className={"rounded-2xl border p-6 " + (p.featured ? "border-orange-400 bg-orange-400/10" : "border-white/10 bg-white/5")}>
          {p.featured && <span className="text-[10px] font-bold uppercase text-orange-400">Most popular</span>}
          <h3 className="mt-2 text-lg font-semibold text-white">{p.name}</h3>
          <p className="mt-2 text-2xl font-bold text-white">{p.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
          <a href="#contact" className="mt-6 inline-flex w-full justify-center rounded-full bg-white py-2.5 text-sm font-semibold text-black">Get started</a>
        </div>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-whatsapp-cta",
    slug: "whatsapp-float-cta",
    name: "WhatsApp Float + Sticky CTA",
    tagline: "Float button + mobile sticky bar",
    description: "Floating WhatsApp + sticky mobile CTA — built for African SME conversion.",
    priceNgn: 2500,
    amountKobo: 250000,
    badge: "Naija ready",
    stack: ["Next.js", "Tailwind"],
    includes: ["WhatsAppFloat.tsx", "StickyMobileCta.tsx"],
    category: "marketing",
    previewCode: `// wa.me float + sticky bar`,
    fullCode: `"use client";
const PHONE = "2348085343926";
export function WhatsAppFloat({ message = "Hi, I saw your website" }: { message?: string }) {
  const href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-lg" aria-label="Chat on WhatsApp">💬</a>
  );
}
export function StickyMobileCta({ label = "Book on WhatsApp" }: { label?: string }) {
  const href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent("I want to book");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 p-3 backdrop-blur md:hidden">
      <a href={href} className="flex w-full justify-center rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white">{label}</a>
    </div>
  );
}`,
  },
  {
    id: "comp-contact-dual-cta",
    slug: "dual-cta-contact",
    name: "Dual CTA Contact",
    tagline: "Email or Book a call — no forms",
    description: "Two big buttons instead of long forms. High conversion for agencies.",
    priceNgn: 2500,
    amountKobo: 250000,
    stack: ["Next.js", "Tailwind"],
    includes: ["DualCtaContact.tsx"],
    category: "forms",
    previewCode: `// Email | Book a call`,
    fullCode: `export default function DualCtaContact({ email = "hello@example.com", whatsapp = "2348085343926" }: { email?: string; whatsapp?: string }) {
  const wa = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("Hi, I want to book a call");
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-white">Ready to start?</h2>
      <p className="mt-2 text-sm text-white/60">No long forms. Pick one.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={"mailto:" + email} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">Email us</a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white">Book a call</a>
      </div>
    </section>
  );
}`,
  },
  {
    id: "comp-stats-row",
    slug: "animated-stats-row",
    name: "Stats / Social Proof Row",
    tagline: "Clients · Projects · Years",
    description: "Trust strip for dark marketing homepages.",
    priceNgn: 2000,
    amountKobo: 200000,
    stack: ["Next.js", "Tailwind"],
    includes: ["StatsRow.tsx"],
    category: "marketing",
    previewCode: `// 50+ · 100+ · 5`,
    fullCode: `const stats = [
  { label: "Clients served", value: "50+" },
  { label: "Projects shipped", value: "100+" },
  { label: "Years building", value: "5" },
];
export default function StatsRow() {
  return (
    <section className="border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 py-10 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-semibold text-white sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-white/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  },
  {
    id: "comp-hero-split",
    slug: "hero-split-cta",
    name: "Hero Split + CTA",
    tagline: "Headline, subcopy, two buttons",
    description: "Classic conversion hero for agency and SaaS landings.",
    priceNgn: 3500,
    amountKobo: 350000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["HeroSplit.tsx"],
    category: "marketing",
    previewCode: `// H1 + dual CTA hero`,
    fullCode: `export default function HeroSplit() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-orange-400">For growing SMEs</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Websites that get clients</h1>
      <p className="mx-auto mt-4 max-w-xl text-white/60">Clear offer, WhatsApp path, and speed — built to convert.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#pricing" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">View packages</a>
        <a href="#contact" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">Book a call</a>
      </div>
    </section>
  );
}`,
  },
  {
    id: "comp-faq",
    slug: "faq-accordion",
    name: "FAQ Accordion",
    tagline: "Accessible expand/collapse FAQs",
    description: "Client-side accordion for pricing and service pages.",
    priceNgn: 3000,
    amountKobo: 300000,
    badge: "New",
    stack: ["Next.js", "React", "Tailwind"],
    includes: ["FaqAccordion.tsx"],
    category: "marketing",
    previewCode: `// click to expand FAQ`,
    fullCode: `"use client";
import { useState } from "react";
const items = [
  { q: "How long does a website take?", a: "Starter sites ship in 7–14 days after content is ready." },
  { q: "Do you support WhatsApp?", a: "Yes — float button, sticky CTA, and prefilled messages." },
  { q: "How do we pay?", a: "Deposit to start, balance before handoff. Paystack available." },
];
export default function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-2xl space-y-2 px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold text-white">FAQ</h2>
      {items.map((item, i) => (
        <div key={item.q} className="rounded-xl border border-white/10 bg-white/5">
          <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white" onClick={() => setOpen(open === i ? -1 : i)}>
            {item.q}<span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="border-t border-white/10 px-4 py-3 text-sm text-white/60">{item.a}</p>}
        </div>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-testimonials",
    slug: "testimonial-cards",
    name: "Testimonial Cards",
    tagline: "3-column social proof",
    description: "Quote cards with name and role for trust sections.",
    priceNgn: 3000,
    amountKobo: 300000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["TestimonialCards.tsx"],
    category: "marketing",
    previewCode: `// 3 testimonial cards`,
    fullCode: `const quotes = [
  { name: "Ada O.", role: "Salon owner", text: "We get more WhatsApp bookings since the new site." },
  { name: "James K.", role: "Founder", text: "Clear packages. Fast delivery. No drama." },
  { name: "Mary T.", role: "Consultant", text: "The dual CTA contact block doubled our replies." },
];
export default function TestimonialCards() {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-4 py-16 md:grid-cols-3">
      {quotes.map((q) => (
        <figure key={q.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <blockquote className="text-sm leading-relaxed text-white/80">“{q.text}”</blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-white">{q.name}</figcaption>
          <p className="text-xs text-white/45">{q.role}</p>
        </figure>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-features",
    slug: "feature-grid-3",
    name: "Feature Grid (3-up)",
    tagline: "Icon-style feature cards",
    description: "Three feature cards for product and service pages.",
    priceNgn: 2500,
    amountKobo: 250000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["FeatureGrid.tsx"],
    category: "marketing",
    previewCode: `// 3 feature cards`,
    fullCode: `const features = [
  { title: "Fast", body: "Ship in days, not months." },
  { title: "WhatsApp-first", body: "CTAs that open chats, not dead forms." },
  { title: "Mobile ready", body: "Looks sharp on every phone." },
];
export default function FeatureGrid() {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-4 py-16 md:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">{f.title}</h3>
          <p className="mt-2 text-sm text-white/60">{f.body}</p>
        </div>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-logo-cloud",
    slug: "logo-cloud",
    name: "Logo Cloud",
    tagline: "Trusted by row",
    description: "Simple client logo / name strip for social proof.",
    priceNgn: 2000,
    amountKobo: 200000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["LogoCloud.tsx"],
    category: "marketing",
    previewCode: `// logo name strip`,
    fullCode: `const logos = ["Acme", "Northwind", "Globex", "Initech", "Umbrella"];
export default function LogoCloud() {
  return (
    <section className="py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-wide text-white/40">Trusted by teams</p>
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 px-4">
        {logos.map((name) => (
          <span key={name} className="text-sm font-semibold tracking-wide text-white/35">{name}</span>
        ))}
      </div>
    </section>
  );
}`,
  },
  {
    id: "comp-newsletter",
    slug: "newsletter-cta",
    name: "Newsletter / Lead CTA",
    tagline: "Email capture strip",
    description: "Minimal email capture bar for lead magnets and launches.",
    priceNgn: 2500,
    amountKobo: 250000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["NewsletterCta.tsx"],
    category: "forms",
    previewCode: `// email + subscribe`,
    fullCode: `"use client";
import { useState } from "react";
export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-xl px-4 py-12 text-center">
      <h2 className="text-xl font-semibold text-white">Get the checklist</h2>
      <p className="mt-2 text-sm text-white/55">One email. No spam.</p>
      <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); alert("Wire to your API: " + email); }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none" />
        <button type="submit" className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black">Subscribe</button>
      </form>
    </section>
  );
}`,
  },
  {
    id: "comp-process",
    slug: "process-steps",
    name: "Process Steps",
    tagline: "1-2-3 how it works",
    description: "Three-step process section for service businesses.",
    priceNgn: 2500,
    amountKobo: 250000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["ProcessSteps.tsx"],
    category: "marketing",
    previewCode: `// step 1 2 3`,
    fullCode: `const steps = [
  { n: "1", title: "Call", body: "15-minute discovery on WhatsApp." },
  { n: "2", title: "Build", body: "Design and ship on a fixed timeline." },
  { n: "3", title: "Launch", body: "Handover, training, and support." },
];
export default function ProcessSteps() {
  return (
    <section className="mx-auto grid max-w-4xl gap-6 px-4 py-16 md:grid-cols-3">
      {steps.map((s) => (
        <div key={s.n} className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-black">{s.n}</div>
          <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
          <p className="mt-1 text-sm text-white/55">{s.body}</p>
        </div>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-footer-simple",
    slug: "footer-simple",
    name: "Simple Site Footer",
    tagline: "Links + legal + contact",
    description: "Clean dark footer with columns and copyright.",
    priceNgn: 2000,
    amountKobo: 200000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["SiteFooter.tsx"],
    category: "navigation",
    previewCode: `// footer columns`,
    fullCode: `export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 text-sm text-white/50">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-white">YourBrand</p>
          <p className="mt-2">Sites and systems that get clients.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <a href="/services" className="mt-2 block hover:text-white">Services</a>
          <a href="/pricing" className="block hover:text-white">Pricing</a>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <a href="mailto:hello@example.com" className="mt-2 block hover:text-white">hello@example.com</a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-6 text-xs">© {new Date().getFullYear()} YourBrand</p>
    </footer>
  );
}`,
  },
  {
    id: "comp-blog-cards",
    slug: "blog-card-grid",
    name: "Blog Card Grid",
    tagline: "3 post cards",
    description: "Blog or resources grid with image placeholder, title, and link.",
    priceNgn: 3000,
    amountKobo: 300000,
    badge: "New",
    stack: ["Next.js", "Tailwind"],
    includes: ["BlogCardGrid.tsx"],
    category: "marketing",
    previewCode: `// blog cards grid`,
    fullCode: `const posts = [
  { title: "WhatsApp menus that sell", href: "#", tag: "Marketing" },
  { title: "Price your web services", href: "#", tag: "Freelance" },
  { title: "Free audit checklist", href: "#", tag: "Growth" },
];
export default function BlogCardGrid() {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-4 py-16 md:grid-cols-3">
      {posts.map((p) => (
        <a key={p.title} href={p.href} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-400/40">
          <div className="mb-3 h-28 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
          <p className="text-[10px] uppercase tracking-wide text-orange-400">{p.tag}</p>
          <h3 className="mt-1 font-semibold text-white group-hover:text-orange-400">{p.title}</h3>
        </a>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-pack-agency",
    slug: "agency-ui-kit",
    name: "Full UI Kit (All 14)",
    tagline: "Every component in one purchase",
    description:
      "All individual DoyinTech Next.js components in one license. Best value for launching a full marketing site.",
    priceNgn: 15000,
    amountKobo: 1500000,
    badge: "Best value",
    stack: ["Next.js", "React", "Tailwind"],
    includes: [
      "All 14 single components",
      "Navbar, hero, pricing, FAQ, footer…",
      "WhatsApp conversion kit",
      "Commercial project license",
    ],
    category: "dashboard",
    previewCode: `// Full kit — 14 components · ₦15,000`,
    fullCode: `/**
 * DoyinTech Full UI Kit v2
 * Includes every single component in the catalog.
 * Stack: Next.js App Router + Tailwind
 * Support: doyintechnology@outlook.com
 */
export const DOYINTECH_UI_KIT_VERSION = "2.0.0";
// After payment, download each component from /components or request ZIP on WhatsApp.
`,
  },
];

export function getUiComponent(slug: string): UiComponentPack | undefined {
  return UI_COMPONENTS.find((c) => c.slug === slug || c.id === slug);
}

export function formatCompPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
