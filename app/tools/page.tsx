import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import ToolsHubClient from "@/components/tools/ToolsHubClient";
import { TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Business, Security, Career & Paid Tools",
  description:
    "DoyinTech tools hub: categorized free tools plus paid PDF Studio. Security, calculators, career, and automation.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "DoyinTech Tools",
    description: "Categorized tools with pagination — including paid PDF Studio.",
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
            Tools, categorized & paginated
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Filter by category. Most tools are free. PDF Studio is a paid unlock.
          </p>

          <ToolsHubClient />

          <section className="mt-16 rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Need implementation?
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              When you need websites, apps, or security hardening,{" "}
              <Link href="/contact" className="text-primary hover:underline">
                talk to DoyinTech
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
