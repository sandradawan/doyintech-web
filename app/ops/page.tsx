import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PlanCard from "@/components/subscriptions/PlanCard";
import { OPS_PLANS } from "@/lib/subscriptions/plans";

export const metadata: Metadata = {
  title: "DoyinOps: Simple CRM and Invoicing Software for Small Businesses",
  description:
    "Track clients, deals, invoices and tasks in one place. Free in your browser; cloud sync and support from ₦7,500 (about $5) a month. Works for small businesses anywhere.",
  alternates: { canonical: "/ops" },
};

const pillars = [
  {
    title: "Contacts + WhatsApp",
    body: "Clients and leads with phone, search, and one-tap WhatsApp.",
  },
  {
    title: "Pipeline + follow-ups",
    body: "Lead → quoted → won → paid. Due follow-ups on the dashboard.",
  },
  {
    title: "Invoices + print",
    body: "Create invoices, remind on WhatsApp, mark paid, print or save PDF.",
  },
  {
    title: "Tasks + demo data",
    body: "Daily to-dos linked to contacts. Load demo to try the product in 10 seconds.",
  },
];

export default function OpsLandingPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
            DoyinTech product · DoyinOps
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[44px]">
            Run your pipeline and money in one place
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            DoyinOps keeps your clients, deals, invoices and follow-ups in one place, for small businesses
            anywhere that run on WhatsApp and email and still lose leads and unpaid invoices. Start free in your browser today.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ops/app"
              className="rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black"
            >
              Open free workspace
            </Link>
            <a
              href="#plans"
              className="rounded-full border border-brand-ink/20 px-6 py-3 text-[15px] font-semibold text-brand-ink"
            >
              See plans
            </a>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20want%20DoyinOps%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-black"
            >
              WhatsApp us
            </a>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-brand-ink/10 bg-gradient-to-b from-brand-raised to-brand-deep p-5"
              >
                <h2 className="text-[17px] font-semibold text-brand-ink">{p.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-muted">{p.body}</p>
              </article>
            ))}
          </div>

          <section id="plans" className="mt-16 scroll-mt-28">
            <h2 className="text-[28px] font-semibold tracking-tight text-brand-ink">Plans</h2>
            <p className="mt-2 max-w-2xl text-[15px] text-brand-muted">
              Start free in your browser. Upgrade when you want your workspace backed up and on every device. Billed monthly through
              Paystack in naira; cards from any country work. Cancel any time.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="flex h-full flex-col rounded-[22px] border border-brand-ink/10 bg-brand-surface p-6">
                <h3 className="text-[19px] font-semibold text-brand-ink">Free</h3>
                <p className="mt-1 text-[14px] text-brand-muted">Everything you need on one device.</p>
                <p className="mt-5 text-[34px] font-semibold tracking-tight text-brand-ink">₦0</p>
                <p className="text-[12px] text-brand-subtle">Free forever</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-[14px] leading-snug text-brand-soft">
                  <li>✓ Contacts, pipeline, invoices and tasks</li>
                  <li>✓ Print and PDF invoices</li>
                  <li>✓ Data stays on this device</li>
                </ul>
                <Link href="/ops/app" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-brand-ink/20 text-[14px] font-semibold text-brand-ink">
                  Start free
                </Link>
              </div>
              {OPS_PLANS.map((p) => (
                <PlanCard key={p.id} plan={p} highlight={p.id === "ops-professional"} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
