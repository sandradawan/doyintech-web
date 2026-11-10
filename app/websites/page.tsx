import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { INDUSTRIES } from "@/lib/industries";
import { PRIMARY_CTA } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Website Design by Industry in Nigeria",
  description:
    "Websites built for Nigerian schools, clinics, churches, restaurants, hotels and real estate agents — the features each business needs, fixed prices and a 50% deposit.",
  alternates: { canonical: "/websites" },
};

export default function WebsitesHubPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
            Websites by industry
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] font-semibold tracking-tight text-brand-ink sm:text-[44px]">
            A website built for how your business gets customers.
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            Every industry gets enquiries differently. Pick yours to see the features that matter,
            what it costs and how long it takes.
          </p>

          <ul className="section-light band grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/websites/${i.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-brand-ink/10 bg-brand-ink/[0.03] p-5 transition hover:border-brand-link/50"
                >
                  <span className="text-[17px] font-semibold text-brand-ink">{i.name}</span>
                  <span className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-brand-muted">{i.intro}</span>
                  <span className="mt-4 text-[13px] font-semibold text-brand-link">See features and price →</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="theme-dark panel-glow mt-12 rounded-[28px] p-8 text-center">
            <p className="text-[16px] text-brand-ink">Don&apos;t see your industry? We build for any business.</p>
            <Link
              href={PRIMARY_CTA.href}
              className="mt-4 inline-flex rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black"
            >
              {PRIMARY_CTA.label}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
