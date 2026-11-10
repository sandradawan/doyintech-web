import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PlanCard from "@/components/subscriptions/PlanCard";
import { plansInFamily } from "@/lib/subscriptions/plans";
import { PAID_TOOLS } from "@/lib/tools/paid";

export const metadata: Metadata = {
  title: "DoyinTech Pro — every premium tool, one membership",
  description:
    "Unlock all DoyinTech premium tools on every device, plus DoyinOps cloud sync. ₦5,000/month or ₦50,000/year. Cancel any time.",
  alternates: { canonical: "/pro" },
};

const FAQ = [
  {
    q: "How is this different from unlocking one tool?",
    a: "A one-off unlock works for a single tool in one browser. Pro unlocks every premium tool and follows your account, so it works on your phone and laptop.",
  },
  {
    q: "How do I use it after paying?",
    a: "Sign in on the Account page with the email you subscribed with. Premium tools then unlock automatically wherever you're signed in.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Open your Account page and choose Manage billing to cancel renewal or change card. You keep access until the end of the period you paid for.",
  },
  {
    q: "How do I pay?",
    a: "Securely through Paystack with any Nigerian or international card. Renewals are automatic until you cancel.",
  },
];

export default function ProPage() {
  const plans = plansInFamily("pro");
  const toolCount = PAID_TOOLS.length;

  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
            Membership
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[46px]">
            DoyinTech Pro
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            All {toolCount} premium business tools in one membership: documents, invoices,
            contracts, CVs, proposals and more. Plus cloud sync for your DoyinOps workspace.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} highlight={p.id === "pro-annual"} />
            ))}
          </div>

          <p className="mt-6 text-center text-[13px] text-brand-subtle">
            Already a member?{" "}
            <Link href="/account" className="text-brand-link hover:underline">
              Sign in to your account
            </Link>
          </p>

          <section className="mt-16">
            <h2 className="text-[22px] font-semibold text-brand-ink">Premium tools included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PAID_TOOLS.map((t) => (
                <li key={t.toolSlug}>
                  <Link
                    href={`/tools/${t.toolSlug}`}
                    className="block rounded-xl border border-brand-ink/10 bg-brand-ink/[0.03] px-4 py-3 text-[14px] text-brand-ink hover:border-brand-link/40"
                  >
                    {t.title}
                    <span className="mt-0.5 block text-[12px] text-brand-subtle">
                      {t.priceNgn} one-off · included in Pro
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-[22px] font-semibold text-brand-ink">Questions</h2>
            <dl className="mt-5 space-y-5">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-brand-ink">{f.q}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-brand-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
