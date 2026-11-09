import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import ToolsHubClient from "@/components/tools/ToolsHubClient";
import AllToolsDirectory from "@/components/tools/AllToolsDirectory";
import { TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Free Online Business Tools: Invoice, Receipt, Tax and VAT",
  description:
    "Free tools with no sign-up: invoice and receipt generators in naira, PAYE and VAT calculators, CGPA calculator, profit margin, WhatsApp links and more.",
  alternates: { canonical: "/tools" },
  openGraph: { images: ["/opengraph-image"],
    title: "DoyinTech Free Online Tools",
    description:
      "Invoice, VAT, WhatsApp links, profit margin, word counter, SEO meta tags, and AI tools — free and paid.",
    url: `${TOOLS_CONFIG.siteUrl}/tools`,
  },
};

export default function ToolsHubPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            DoyinTech Tools
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Free online business tools for invoices, receipts, tax and more
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Invoice generator, Nigeria VAT calculator, profit margin, WhatsApp link generator,
            word counter, SEO meta tags, loan EMI, and more — plus AI-powered paid tools.
            No account required for free tools.
          </p>

          <ToolsHubClient />

          <AllToolsDirectory />

          <section className="mt-16 rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Need a website or system built?
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              Tools help you move faster. When you need implementation — sites, apps, or security —{" "}
              <Link href="/contact" className="text-primary hover:underline">
                talk to DoyinTech
              </Link>{" "}
              or{" "}
              <Link href="/hire" className="text-primary hover:underline">
                hire us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
