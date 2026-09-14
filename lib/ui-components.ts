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

export const UI_COMPONENTS: UiComponentPack[] = [
  {
    id: "comp-navbar-glass",
    slug: "glass-navbar",
    name: "Glass Navbar (Next.js)",
    tagline: "Sticky glass header with mobile menu",
    description:
      "Production-ready App Router navbar: glass blur, active states, mobile drawer, logo slot. Drop into any Tailwind + Next.js project.",
    priceNgn: 12000,
    amountKobo: 1200000,
    badge: "Popular",
    stack: ["Next.js", "React", "Tailwind"],
    includes: [
      "Navbar.tsx (client)",
      "Mobile menu animation notes",
      "Install steps for App Router",
    ],
    category: "navigation",
    previewCode: `// GlassNavbar — preview
export function GlassNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50
      border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center
        justify-between px-4">
        <a href="/" className="font-semibold text-white">Brand</a>
        {/* links + mobile menu in full pack */}
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
        <button type="button" className="md:hidden text-white text-sm" onClick={() => setOpen((v) => !v)}>
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
    description:
      "Responsive pricing section with featured middle plan, feature lists, and CTA buttons — ideal for SaaS and agencies.",
    priceNgn: 15000,
    amountKobo: 1500000,
    badge: "SaaS",
    stack: ["Next.js", "Tailwind"],
    includes: ["PricingSection.tsx", "Plan type", "WhatsApp CTA helper"],
    category: "commerce",
    previewCode: `// PricingCards — preview
const plans = [
  { name: "Starter", price: "₦45k", featured: false },
  { name: "Growth", price: "₦120k", featured: true },
  { name: "Pro", price: "₦250k", featured: false },
];
// Full pack maps plans to cards + CTA`,
    fullCode: `const plans = [
  {
    name: "Starter",
    price: "₦45,000",
    features: ["5-page site", "WhatsApp CTA", "1 revision"],
    featured: false,
  },
  {
    name: "Growth",
    price: "₦120,000",
    features: ["Custom design", "CMS-ready", "SEO basics", "2 revisions"],
    featured: true,
  },
  {
    name: "Pro",
    price: "₦250,000",
    features: ["Full product", "Auth + dashboard", "Priority support"],
    featured: false,
  },
];

export default function PricingCards() {
  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 md:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={
            "rounded-2xl border p-6 " +
            (p.featured
              ? "border-orange-400 bg-orange-400/10 shadow-lg shadow-orange-500/10"
              : "border-white/10 bg-white/5")
          }
        >
          {p.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Most popular</span>
          )}
          <h3 className="mt-2 text-lg font-semibold text-white">{p.name}</h3>
          <p className="mt-2 text-2xl font-bold text-white">{p.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {p.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-white py-2.5 text-sm font-semibold text-black"
          >
            Get started
          </a>
        </div>
      ))}
    </section>
  );
}`,
  },
  {
    id: "comp-whatsapp-cta",
    slug: "whatsapp-float-cta",
    name: "WhatsApp Float + CTA Bar",
    tagline: "Floating chat button + sticky bottom CTA",
    description:
      "Conversion kit for Nigerian/African businesses: floating WhatsApp button and optional sticky mobile CTA bar with prefilled message.",
    priceNgn: 8000,
    amountKobo: 800000,
    badge: "Naija ready",
    stack: ["Next.js", "Tailwind"],
    includes: ["WhatsAppFloat.tsx", "StickyCta.tsx", "Config helper"],
    category: "marketing",
    previewCode: `// WhatsAppFloat — preview
const phone = "2348085343926";
const msg = encodeURIComponent("Hi, I need a website");
// <a href={\`https://wa.me/\${phone}?text=\${msg}\`}>Chat</a>`,
    fullCode: `"use client";

const PHONE = "2348085343926"; // change me

export function WhatsAppFloat({ message = "Hi, I saw your website" }: { message?: string }) {
  const href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-lg shadow-green-900/40"
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  );
}

export function StickyMobileCta({ label = "Book on WhatsApp" }: { label?: string }) {
  const href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent("I want to book");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 p-3 backdrop-blur md:hidden">
      <a href={href} className="flex w-full justify-center rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white">
        {label}
      </a>
    </div>
  );
}`,
  },
  {
    id: "comp-contact-dual-cta",
    slug: "dual-cta-contact",
    name: "Dual CTA Contact Block",
    tagline: "Email or Book a call — no long forms",
    description:
      "High-converting contact section: two big buttons (Email + Book a call / WhatsApp) instead of heavy forms — matches modern agency sites.",
    priceNgn: 7000,
    amountKobo: 700000,
    stack: ["Next.js", "Tailwind"],
    includes: ["ContactCta.tsx", "Props for email & WhatsApp"],
    category: "forms",
    previewCode: `// Dual CTA — Email | Book a call
// Two buttons, zero form fields`,
    fullCode: `export default function DualCtaContact({
  email = "hello@example.com",
  whatsapp = "2348085343926",
}: { email?: string; whatsapp?: string }) {
  const wa = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("Hi, I want to book a call");
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-white">Ready to start?</h2>
      <p className="mt-2 text-sm text-white/60">No long forms. Pick one.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={"mailto:" + email} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
          Email us
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white">
          Book a call
        </a>
      </div>
    </section>
  );
}`,
  },
  {
    id: "comp-stats-row",
    slug: "animated-stats-row",
    name: "Stats / Social Proof Row",
    tagline: "Clients · Projects · Years — trust strip",
    description:
      "Simple trust strip for homepages. Clean numbers row that works on dark Apple-style marketing pages.",
    priceNgn: 5000,
    amountKobo: 500000,
    stack: ["Next.js", "Tailwind"],
    includes: ["StatsRow.tsx"],
    category: "marketing",
    previewCode: `// 50+ clients · 100+ projects · 5 years`,
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
    id: "comp-pack-agency",
    slug: "agency-ui-kit",
    name: "Agency UI Kit (Bundle)",
    tagline: "Navbar + Pricing + WhatsApp + Contact + Stats",
    description:
      "All five DoyinTech Next.js components in one purchase. Best value for launching a client or agency site this week.",
    priceNgn: 35000,
    amountKobo: 3500000,
    badge: "Best value",
    stack: ["Next.js", "React", "Tailwind"],
    includes: [
      "Glass Navbar",
      "Pricing Cards",
      "WhatsApp Float + Sticky CTA",
      "Dual CTA Contact",
      "Stats Row",
      "Setup README",
    ],
    category: "dashboard",
    previewCode: `// Bundle includes 5 production components
// Pay once → unlock all source on success page`,
    fullCode: `/**
 * Agency UI Kit — DoyinTech
 * After purchase you receive full source for:
 * 1. GlassNavbar
 * 2. PricingCards
 * 3. WhatsAppFloat + StickyMobileCta
 * 4. DualCtaContact
 * 5. StatsRow
 *
 * Stack: Next.js App Router + Tailwind CSS
 * Support: doyintechnology@outlook.com
 */

// Individual component files are delivered on the success page
// and via WhatsApp ZIP on request.
export const AGENCY_UI_KIT_VERSION = "1.0.0";
`,
  },
];

export function getUiComponent(slug: string): UiComponentPack | undefined {
  return UI_COMPONENTS.find((c) => c.slug === slug || c.id === slug);
}

export function formatCompPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
