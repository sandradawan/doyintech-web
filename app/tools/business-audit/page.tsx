import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import BusinessAudit from "@/components/tools/BusinessAudit";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import RelatedTools from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
  title: "Business Digital Audit Tool",
  description:
    "Free business audit tool: score your website, SEO, payments, WhatsApp, and online presence. Get clear recommendations.",
  alternates: { canonical: "/tools/business-audit" },
  openGraph: { images: ["/opengraph-image"],
    title: "Business Digital Audit | DoyinTech Tools",
    description: "How strong is your business online? Free self-assessment with actionable tips.",
    url: `${TOOLS_CONFIG.siteUrl}/tools/business-audit`,
  },
};

export default function BusinessAuditPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/tools" className="text-sm text-primary hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            How Strong Is Your Business Online?
          </h1>
          <p className="mt-3 text-brand-muted">
            A practical digital audit for SMEs. Answer honestly for the most useful score.
          </p>
          <div className="mt-8">
            <BusinessAudit />
          </div>
          <article className="mt-14 space-y-3 text-sm text-brand-muted">
            <h2 className="font-display text-xl font-bold text-white">Why audit your digital presence?</h2>
            <p>
              Many businesses have a logo and social pages but leak customers through missing
              payments, weak mobile experience, or no SEO. A structured audit highlights the
              highest-ROI fixes first.
            </p>
          </article>
        </div>
        <div className="px-6"><RelatedTools /></div>
      </main>
      <Footer />
    </>
  );
}
