import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import { SHOWS } from "@/lib/listen/shows";
import { DIGITAL_PRODUCTS } from "@/lib/products";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { TOOLS_META } from "@/lib/tools/config";

const TITLE = "All Pages";
const DESCRIPTION = "Every page on DoyinTech in one place: website design services, free business tools, ebooks, digital products, calculators by country and guides.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/all-pages" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/all-pages" },
};

const SECTIONS: { heading: string; match: (path: string) => boolean }[] = [
  { heading: "Free tools", match: (p) => p.startsWith("/tools/") },
  { heading: "Ebooks", match: (p) => p.startsWith("/ebooks/") },
  { heading: "Digital products", match: (p) => p.startsWith("/products/") },
  { heading: "Web design by city", match: (p) => p.startsWith("/web-design-") },
  { heading: "Websites by industry", match: (p) => p.startsWith("/websites") },
  { heading: "VAT calculators by country", match: (p) => p.startsWith("/vat-calculator/") },
  { heading: "Salary calculators by country", match: (p) => p.startsWith("/salary-calculator/") },
  { heading: "Blog", match: (p) => p.startsWith("/blog/") },
  { heading: "Case studies", match: (p) => p.startsWith("/case-studies/") },
  { heading: "Podcasts", match: (p) => p.startsWith("/listen/") },
  { heading: "Kids", match: (p) => p.startsWith("/kids/") },
  { heading: "Website templates", match: (p) => p.startsWith("/templates/") },
  { heading: "Next.js components", match: (p) => p.startsWith("/components/") },
];

const CAPS: Record<string, string> = { vat: "VAT", gst: "GST", paye: "PAYE", cv: "CV", cgpa: "CGPA", seo: "SEO", ai: "AI", qr: "QR", sme: "SME", smes: "SMEs", ssl: "SSL", csp: "CSP", url: "URL", uk: "UK", us: "US", uae: "UAE", usa: "USA", cbt: "CBT", ngo: "NGO", hr: "HR", faq: "FAQ", cta: "CTA", ui: "UI", nigeria: "Nigeria" };

function humanise(path: string): string {
  const text = path.split("/").filter(Boolean).pop() ?? "Home";
  return text.split("-").map((w, i) => CAPS[w] ?? (i === 0 ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
}

export default function AllPagesPage() {
  const names = new Map<string, string>([
    ...TOOLS_META.map((t): [string, string] => [t.href, t.title]),
    ...ALL_EBOOKS.map((b): [string, string] => [`/ebooks/${b.slug}`, b.title]),
    ...DIGITAL_PRODUCTS.map((p): [string, string] => [`/products/${p.id}`, p.name]),
    ...SHOWS.map((s): [string, string] => [`/listen/${s.slug}`, s.name]),
  ]);
  const paths = Array.from(new Set(sitemapEntries().map((e) => e.path).filter(Boolean)));
  const label = (p: string) => names.get(p) ?? humanise(p);
  const grouped = new Set<string>();
  const sections = SECTIONS.map((s) => {
    const links = paths.filter((p) => !grouped.has(p) && s.match(p));
    links.forEach((p) => grouped.add(p));
    return { heading: s.heading, links };
  });
  const main = paths.filter((p) => !grouped.has(p));

  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h1 className="text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">All pages</h1>
          <p className="mt-2 text-[17px] text-brand-soft">Everything on DoyinTech, grouped by what it does.</p>
          {[{ heading: "Main pages", links: main }, ...sections].map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-[22px] font-semibold text-white">{s.heading}</h2>
              <ul className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                {s.links.map((p) => (
                  <li key={p}>
                    <Link href={p} className="inline-flex min-h-10 items-center text-[14px] text-brand-soft hover:text-white hover:underline">{label(p)}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
