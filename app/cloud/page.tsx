import type { Metadata } from "next";
import Link from "next/link";
import { Money } from "@/components/ui/Price";
import DivisionHub from "@/components/sections/DivisionHub";
import { getDivision } from "@/lib/divisions";

const TITLE = "DoyinOps and DoyinTech Pro: Business Software for Small Businesses";
const DESCRIPTION =
  "Manage clients, deals, invoices and follow-ups with DoyinOps from ₦7,500 (about $5) a month, and unlock every premium DoyinTech tool with Pro.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cloud" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/cloud" },
};

const COMPARE: [string, string, string][] = [
  ["Free business tools (invoices, VAT, PAYE, payslips)", "✓", "✓"],
  ["Premium tools: contracts, CVs, proposals and more", "Pay per tool", "All included"],
  ["Works on your phone and laptop when signed in", "—", "✓"],
  ["DoyinOps workspace cloud sync", "—", "✓"],
];

export default function CloudPage() {
  return (
    <DivisionHub division={getDivision("cloud")}>
      <section className="mt-20">
        <p className="section-eyebrow">Free or Pro</p>
        <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">What you get with Pro</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-ink/10">
          <table className="w-full min-w-[480px] text-left text-[15px]">
            <thead className="bg-brand-surface text-brand-ink">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Free</th>
                <th className="px-4 py-3 font-semibold">Pro · <Money ngn={5000} />/month</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([f, free, pro]) => (
                <tr key={f} className="border-t border-brand-ink/10">
                  <td className="px-4 py-3 text-brand-ink/90">{f}</td>
                  <td className="px-4 py-3 text-brand-muted">{free}</td>
                  <td className="px-4 py-3 font-semibold text-brand-link">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-brand-subtle">Pro is also <Money ngn={50000} /> a year. DoyinOps plans start at <Money ngn={7500} /> a month. Cancel any time; cards from any country work.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pro" className="apple-btn apple-btn-primary">Get Pro</Link>
          <Link href="/ops" className="apple-btn apple-btn-secondary">See DoyinOps</Link>
        </div>
      </section>
    </DivisionHub>
  );
}
