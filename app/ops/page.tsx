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
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            DoyinTech product · DoyinOps
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Run your pipeline and money in one place
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            DoyinOps is the SME operations layer from DoyinTech — built for businesses that live on
            WhatsApp and still lose leads and unpaid invoices. Start free in the browser today.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ops/app"
              className="rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
            >
              Open workspace
            </Link>
            <Link
              href="/hire"
              className="rounded-full border border-white/20 px-6 py-3 text-[15px] font-semibold text-white"
            >
              Need a custom system?
            </Link>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20want%20DoyinOps%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              WhatsApp us
            </a>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-5"
              >
                <h2 className="text-[17px] font-semibold text-white">{p.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{p.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
            <h2 className="text-[18px] font-semibold text-white">Company roadmap</h2>
            <ul className="mt-3 space-y-2 text-[14px] text-[#c7cdd8]">
              <li>✓ Contacts, pipeline, invoices, tasks, print PDF, demo data</li>
              <li>→ Cloud accounts + team seats (Supabase)</li>
              <li>→ Paystack payment links on invoices</li>
              <li>→ WhatsApp notification hooks</li>
              <li>→ Vertical packs (salon, property)</li>
            </ul>
            <Link
              href="/ops/app"
              className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black"
            >
              Start free workspace →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
