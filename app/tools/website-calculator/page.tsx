import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import WebsiteCalculator from "@/components/tools/WebsiteCalculator";
import { TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Website Cost Calculator Nigeria",
  description:
    "Free website price calculator for Nigeria. Estimate development cost in Naira for business sites, e-commerce, portals and custom web apps.",
  alternates: { canonical: "/tools/website-calculator" },
  openGraph: {
    title: "Website Cost Calculator Nigeria | DoyinTech",
    description:
      "Estimate website development cost in Naira. Not a formal quote — a planning range for your project.",
    url: `${TOOLS_CONFIG.siteUrl}/tools/website-calculator`,
  },
};

export default function WebsiteCalculatorPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/tools" className="text-sm text-primary hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            Website Price Calculator
          </h1>
          <p className="mt-3 text-gray-400">
            Answer a few questions to get an estimated project range in Nigerian Naira.
            Useful for budgeting before you talk to a developer.
          </p>

          <div className="mt-8">
            <WebsiteCalculator />
          </div>

          <article className="prose-invert mt-14 space-y-4 text-sm leading-relaxed text-gray-400">
            <h2 className="font-display text-xl font-bold text-white">
              How website costs work in Nigeria
            </h2>
            <p>
              Website development cost depends on pages, features, integrations (payments,
              booking, CMS), design quality, and whether you need ongoing maintenance.
              A simple landing page costs far less than a school portal or e-commerce
              platform with admin dashboards.
            </p>
            <p>
              This calculator produces a planning range only. Final pricing from DoyinTech
              is confirmed after discovery of your exact requirements.
            </p>
            <h2 className="font-display text-xl font-bold text-white">
              Tips before you hire
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>List must-have features vs nice-to-haves</li>
              <li>Prepare content (text, photos, logo) early</li>
              <li>Decide who will update the site after launch</li>
              <li>Budget for domain, hosting, and security</li>
            </ul>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
