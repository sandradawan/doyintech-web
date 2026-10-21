import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PlanCard from "@/components/subscriptions/PlanCard";
import { plansInFamily } from "@/lib/subscriptions/plans";

export const metadata: Metadata = {
  title: "Website care plans — maintenance, security & monthly improvements",
  description:
    "Monthly website care from DoyinTech: security updates, backups, uptime monitoring, content changes and SEO upkeep. From ₦50,000/month, billed automatically. Cancel any time.",
  alternates: { canonical: "/care-plans" },
};

const WHY = [
  {
    title: "Sites decay without care",
    body: "Plugins and libraries go out of date, SSL certificates expire, and forms quietly break. Most businesses only notice when enquiries stop.",
  },
  {
    title: "One fixed monthly fee",
    body: "No quotes for every small change. Your plan includes a set number of hours each month, and we tell you before anything costs extra.",
  },
  {
    title: "Works for any site",
    body: "Built by us or someone else. If we didn't build it, we start with a free audit so you know exactly what you're getting.",
  },
];

export default function CarePlansPage() {
  const plans = plansInFamily("care");

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Website care plans
          </p>
          <h1 className="mt-2 max-w-3xl text-[34px] font-semibold tracking-tight text-white sm:text-[46px]">
            Your website, looked after every month.
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            Security, backups, uptime monitoring and real improvements, on a simple monthly plan
            billed through Paystack. Cancel any time from your account.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} highlight={p.id === "care-growth"} />
            ))}
          </div>

          <p className="mt-6 text-center text-[13px] text-[#86868b]">
            Unused hours don&apos;t roll over. Bigger projects are quoted separately at a fixed
            price.{" "}
            <Link href="/free-audit" className="text-[#ff8c14] hover:underline">
              Not sure which plan? Get a free audit first.
            </Link>
          </p>

          <section className="mt-16 grid gap-5 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-[16px] font-semibold text-white">{w.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{w.body}</p>
              </div>
            ))}
          </section>

          <section className="mt-16 rounded-2xl border border-white/10 bg-[#141a28] p-6 sm:p-8">
            <h2 className="text-[20px] font-semibold text-white">What happens after you subscribe</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-[#c7cdd8]">
              <li>You get an email receipt from Paystack and a welcome message from us.</li>
              <li>
                Within one business day we confirm your site details and access over WhatsApp or
                email.
              </li>
              <li>Monitoring and backups start, and your first monthly report arrives within 30 days.</li>
              <li>Send change requests any time on WhatsApp; we confirm the time each one uses.</li>
            </ol>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
