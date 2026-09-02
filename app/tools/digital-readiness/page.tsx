import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import DigitalReadiness from "@/components/tools/DigitalReadiness";
import { TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Digital Readiness Assessment",
  description:
    "Free digital transformation readiness checker for businesses. Score presence, payments, marketing, operations, and security.",
  alternates: { canonical: "/tools/digital-readiness" },
  openGraph: {
    title: "Digital Readiness Checker | DoyinTech",
    description: "How digitally ready is your business? Free assessment with quick wins.",
    url: `${TOOLS_CONFIG.siteUrl}/tools/digital-readiness`,
  },
};

export default function DigitalReadinessPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/tools" className="text-sm text-primary hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            How Digitally Ready Is Your Business?
          </h1>
          <p className="mt-3 text-gray-400">
            A structured digital transformation assessment across six categories.
          </p>
          <div className="mt-8">
            <DigitalReadiness />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
