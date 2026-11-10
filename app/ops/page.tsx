import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "DoyinOps — SME operations platform",
  description:
    "DoyinOps by DoyinTech: contacts, pipeline, invoices, tasks, and printable invoices for small businesses. Free in your browser.",
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
            DoyinOps is the SME operations layer from DoyinTech — built for businesses that live on
            WhatsApp and still lose leads and unpaid invoices. Start free in the browser today.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ops/app"
              className="rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black"
            >
              Open free workspace
            </Link>
            <Link
              href="/hire"
              className="rounded-full border border-brand-ink/20 px-6 py-3 text-[15px] font-semibold text-brand-ink"
            >
              Need a custom system?
            </Link>
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

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
                Free forever (browser)
              </p>
              <h2 className="mt-2 text-[20px] font-semibold text-brand-ink">Local workspace</h2>
              <ul className="mt-3 space-y-1 text-[14px] text-brand-muted">
                <li>✓ Contacts, pipeline, invoices, tasks</li>
                <li>✓ Data stays on this device (localStorage)</li>
                <li>✓ Print / PDF invoices</li>
                <li>✓ Demo data to explore in seconds</li>
              </ul>
              <Link
                href="/ops/app"
                className="mt-5 inline-flex rounded-full bg-brand-ink px-5 py-2.5 text-[13px] font-semibold text-brand-deep"
              >
                Start free →
              </Link>
            </div>
            <div className="rounded-2xl border border-brand-link/30 bg-brand-link/10 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-link">
                Coming · paid cloud
              </p>
              <h2 className="mt-2 text-[20px] font-semibold text-brand-ink">Team + sync tier</h2>
              <ul className="mt-3 space-y-1 text-[14px] text-brand-soft">
                <li>→ Cloud accounts + multi-device sync</li>
                <li>→ Team seats for staff</li>
                <li>→ Paystack payment links on invoices</li>
                <li>→ WhatsApp notification hooks</li>
                <li>→ Vertical packs (salon, property)</li>
              </ul>
              <a
                href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20put%20me%20on%20the%20DoyinOps%20cloud%20waitlist."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-[13px] font-semibold text-black"
              >
                Join cloud waitlist
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
