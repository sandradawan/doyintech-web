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
  fullCode: string;
  category: "agency" | "saas" | "local-business" | "portfolio" | "ecommerce";
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "tpl-agency-dark",
    slug: "dark-agency-landing",
    name: "Dark Agency Landing",
    tagline: "Apple-style agency homepage — hero, services, proof, CTA",
    description:
      "Complete app/page.tsx for agencies: dark theme, dual CTA, services, stats, pricing, WhatsApp contact.",
    priceNgn: 45000,
    amountKobo: 4500000,
    badge: "Best seller",
    stack: ["Next.js", "Tailwind", "App Router"],
    pages: ["app/page.tsx"],
    includes: ["Full page.tsx", "WhatsApp CTAs", "Pricing section", "Vercel-ready"],
    category: "agency",
    previewOutline:
      "// Dark Agency template\n// Navbar · Hero · Stats · Services · Pricing · Contact · Footer",
    fullGuide:
      "Paste fullCode into app/page.tsx. Change WA number and brand name. Deploy on Vercel.",
    fullCode: `// app/page.tsx — Dark Agency Landing (DoyinTech Template)
const WA = "2348085343926";
const wa = (t: string) =>
  "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);

const services = [
  { t: "Websites", d: "Fast marketing sites that convert enquiries." },
  { t: "Web apps", d: "Dashboards, portals, and internal tools." },
  { t: "Automation", d: "WhatsApp flows, forms, and ops systems." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
          <span className="font-semibold">YourAgency</span>
          <div className="hidden gap-6 text-xs text-white/80 md:flex">
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <a
            href={wa("Hi, I want a free call")}
            className="rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold"
          >
            Book call
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-20 pt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          Software agency
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          We build sites and systems that get clients
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          For SMEs and founders who need results — not jargon.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={wa("Book a discovery call")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Book a free call
          </a>
          <a href="#services" className="rounded-full border border-white/20 px-6 py-3 text-sm">
            See services
          </a>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 text-center">
          {["50+ clients", "100+ projects", "5 years"].map((x) => (
            <p key={x} className="text-lg font-semibold sm:text-2xl">
              {x}
            </p>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center text-2xl font-semibold">What we ship</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-center text-2xl font-semibold">Simple packages</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "Starter", p: "NGN 45,000" },
            { n: "Growth", p: "NGN 120,000" },
            { n: "Custom", p: "Talk to us" },
          ].map((plan) => (
            <div key={plan.n} className="rounded-2xl border border-white/10 p-6 text-center">
              <p className="font-semibold">{plan.n}</p>
              <p className="mt-2 text-2xl font-bold">{plan.p}</p>
              <a
                href={wa("I want " + plan.n)}
                className="mt-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-black"
              >
                Choose
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-xl px-4 pb-24 text-center">
        <h2 className="text-2xl font-semibold">Ready to start?</h2>
        <p className="mt-2 text-sm text-white/60">No long forms. Pick one.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:hello@example.com"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
          >
            Email us
          </a>
          <a
            href={wa("Hi, book a call")}
            className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold"
          >
            Book on WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        Built with DoyinTech template
      </footer>
    </main>
  );
}
`,
  },
  {
    id: "tpl-local-sme",
    slug: "local-business-site",
    name: "Local Business Site",
    tagline: "Salon, clinic, school, shop — home + booking CTA",
    description: "Local business homepage template with WhatsApp book buttons and service cards.",
    priceNgn: 55000,
    amountKobo: 5500000,
    badge: "SME",
    stack: ["Next.js", "Tailwind"],
    pages: ["app/page.tsx", "services", "contact"],
    includes: ["Home page.tsx", "Service cards", "WhatsApp book"],
    category: "local-business",
    previewOutline: "Header · Hero · Services · Book CTA",
    fullGuide: "Paste into app/page.tsx. Add /services and /contact routes as needed.",
    fullCode: `// app/page.tsx — Local Business (DoyinTech Template)
const WA = "2348085343926";
const book =
  "https://wa.me/" + WA + "?text=" + encodeURIComponent("I want to book");

export default function LocalHome() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-semibold">YourBusiness</span>
          <a
            href={book}
            className="rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold"
          >
            Book
          </a>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-semibold">Quality service near you</h1>
        <p className="mt-4 text-white/60">
          Book in minutes on WhatsApp. Same-day slots when available.
        </p>
        <a
          href={book}
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          Book on WhatsApp
        </a>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 pb-20 md:grid-cols-3">
        {["Service A", "Service B", "Service C"].map((s) => (
          <div key={s} className="rounded-xl border border-white/10 p-5">
            <h3 className="font-semibold">{s}</h3>
            <p className="mt-2 text-sm text-white/50">Describe offer and price.</p>
            <a href={book} className="mt-4 inline-block text-sm text-orange-400">
              Book
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}
`,
  },
  {
    id: "tpl-saas-waitlist",
    slug: "saas-waitlist-landing",
    name: "SaaS Waitlist Landing",
    tagline: "Product hero, features, FAQ, waitlist CTA",
    description: "Single-page SaaS launch template with WhatsApp waitlist CTA.",
    priceNgn: 38000,
    amountKobo: 3800000,
    stack: ["Next.js", "Tailwind"],
    pages: ["app/page.tsx"],
    includes: ["Hero", "Features", "FAQ", "Waitlist CTA"],
    category: "saas",
    previewOutline: "Hero → Features → FAQ → Waitlist",
    fullGuide: "Paste fullCode as app/page.tsx",
    fullCode: `// app/page.tsx — SaaS Waitlist (DoyinTech Template)
const WA = "2348085343926";
const join =
  "https://wa.me/" +
  WA +
  "?text=" +
  encodeURIComponent("Add me to the waitlist");

const faqs = [
  { q: "When do you launch?", a: "Waitlist users onboard first." },
  { q: "Is there founder pricing?", a: "Yes for early members." },
];

export default function SaaSWaitlist() {
  return (
    <main className="min-h-screen bg-[#05080f] text-white">
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
          Coming soon
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Ship replies faster than your competitors
        </h1>
        <p className="mt-4 text-white/60">Join the waitlist for founding member pricing.</p>
        <a
          href={join}
          className="mt-8 inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold"
        >
          Join waitlist
        </a>
      </section>
      <section className="mx-auto grid max-w-4xl gap-6 px-4 pb-16 md:grid-cols-3">
        {["Auto replies", "Lead capture", "Simple analytics"].map((f) => (
          <div key={f} className="rounded-2xl border border-white/10 p-5 text-center">
            <p className="font-semibold">{f}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-2xl space-y-4 px-4 pb-24">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-white/10 p-4">
            <p className="font-medium">{f.q}</p>
            <p className="mt-1 text-sm text-white/60">{f.a}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
`,
  },
  {
    id: "tpl-freelancer-portfolio",
    slug: "freelancer-portfolio",
    name: "Freelancer Portfolio",
    tagline: "Work grid, skills, hire CTA",
    description: "Portfolio page.tsx for developers and designers.",
    priceNgn: 32000,
    amountKobo: 3200000,
    stack: ["Next.js", "Tailwind"],
    pages: ["app/page.tsx"],
    includes: ["Projects", "Skills", "Hire CTA"],
    category: "portfolio",
    previewOutline: "Hero → Work → Skills → Hire",
    fullGuide: "Paste as app/page.tsx",
    fullCode: `// app/page.tsx — Freelancer Portfolio (DoyinTech Template)
const WA = "2348085343926";
const hire =
  "https://wa.me/" + WA + "?text=" + encodeURIComponent("I want to hire you");

const projects = [
  { title: "SME Website", result: "More WhatsApp enquiries", stack: "Next.js" },
  { title: "Booking Portal", result: "Less admin time", stack: "Laravel" },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-24">
        <p className="text-sm text-orange-400">Available for projects</p>
        <h1 className="mt-2 text-4xl font-semibold">
          I build products that pay for themselves
        </h1>
        <a
          href={hire}
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
        >
          Hire me
        </a>
      </section>
      <section className="mx-auto max-w-3xl space-y-4 px-4 pb-24">
        {projects.map((p) => (
          <div key={p.title} className="rounded-xl border border-white/10 p-5">
            <div className="flex justify-between gap-2">
              <h3 className="font-semibold">{p.title}</h3>
              <span className="text-xs text-white/40">{p.stack}</span>
            </div>
            <p className="mt-1 text-sm text-white/60">{p.result}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
`,
  },
  {
    id: "tpl-product-sales",
    slug: "digital-product-sales-page",
    name: "Digital Product Sales Page",
    tagline: "Sell ebooks and kits — long-form sales page",
    description: "Sales page with benefits, price, FAQ, buy CTA.",
    priceNgn: 40000,
    amountKobo: 4000000,
    badge: "Commerce",
    stack: ["Next.js", "Tailwind"],
    pages: ["app/page.tsx"],
    includes: ["Benefits", "Price", "FAQ", "Buy CTA"],
    category: "ecommerce",
    previewOutline: "Promise → Benefits → Price → FAQ → Buy",
    fullGuide: "Paste as sales page.tsx",
    fullCode: `// app/page.tsx — Digital Product Sales (DoyinTech Template)
const benefits = [
  "Ready-to-use scripts",
  "Step-by-step actions",
  "Built for SMEs",
];

export default function SalesPage() {
  return (
    <main className="min-h-screen bg-[#0c1018] text-white">
      <section className="mx-auto max-w-2xl px-4 pb-12 pt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          Digital product
        </p>
        <h1 className="mt-3 text-4xl font-semibold">
          Get more clients from WhatsApp this month
        </h1>
      </section>
      <section className="mx-auto max-w-xl px-4 pb-10">
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2 text-sm">
              <span className="text-orange-400">*</span> {b}
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-auto max-w-md rounded-2xl border border-orange-400/30 bg-orange-400/10 px-6 py-8 text-center">
        <p className="text-4xl font-bold">NGN 7,500</p>
        <a
          href="/products"
          className="mt-6 inline-flex w-full justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-black"
        >
          Buy now
        </a>
      </section>
    </main>
  );
}
`,
  },
  {
    id: "tpl-bundle-all",
    slug: "all-templates-bundle",
    name: "All Templates Bundle",
    tagline: "Every page template in one license",
    description: "Unlock all templates. Client projects allowed.",
    priceNgn: 150000,
    amountKobo: 15000000,
    badge: "Best value",
    stack: ["Next.js", "Tailwind"],
    pages: ["All"],
    includes: [
      "Dark Agency",
      "Local Business",
      "SaaS Waitlist",
      "Portfolio",
      "Sales Page",
    ],
    category: "agency",
    previewOutline: "5 full page.tsx templates · one payment",
    fullGuide: "Bundle unlocks every template after payment.",
    fullCode: `/**
 * All Templates Bundle — DoyinTech
 * Open each template page after unlock, or request ZIP on WhatsApp.
 * License: client projects OK. Do not resell as a competing kit.
 */
export const DOYINTECH_TEMPLATES_BUNDLE = "1.0.0";
`,
  },
];

export function getPageTemplate(slug: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
}

export function formatTplPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
