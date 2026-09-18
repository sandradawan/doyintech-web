import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Agency vs Freelancer vs DIY Website — What Nigerian SMEs Should Choose",
  description:
    "Honest comparison: big agency, random freelancer, DIY builders, and fixed-price productized delivery from DoyinTech.",
};

const rows = [
  {
    who: "Big agency",
    cost: "Often ₦1m+",
    speed: "Slow",
    risk: "Scope creep",
    fit: "Large brands with budget",
  },
  {
    who: "Random freelancer",
    cost: "Cheap–opaque",
    speed: "Unpredictable",
    risk: "Ghosting / rebuilds",
    fit: "Only if you have a trusted referral",
  },
  {
    who: "DIY (Wix etc.)",
    cost: "Low monthly",
    speed: "Depends on you",
    risk: "Looks amateur; weak conversion",
    fit: "Tiny side projects",
  },
  {
    who: "DoyinTech fixed price",
    cost: "₦100k–₦450k packages",
    speed: "Days–weeks",
    risk: "Written scope · deposit",
    fit: "SMEs who want enquiries",
  },
];

export default function AgencyVsFreelancerPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[800px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Comparison
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white">
            Agency vs freelancer vs DIY
          </h1>
          <p className="mt-4 text-[17px] text-[#a1a1a6]">
            Most Nigerian SMEs do not need a six-month agency project. They need a clear offer page,
            WhatsApp, and someone who shows up after payment.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/15 text-[#86868b]">
                  <th className="py-3 pr-4 font-semibold">Option</th>
                  <th className="py-3 pr-4 font-semibold">Cost</th>
                  <th className="py-3 pr-4 font-semibold">Speed</th>
                  <th className="py-3 pr-4 font-semibold">Risk</th>
                  <th className="py-3 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.who} className="border-b border-white/10 text-[#c7cdd8]">
                    <td className="py-3 pr-4 font-semibold text-white">{r.who}</td>
                    <td className="py-3 pr-4">{r.cost}</td>
                    <td className="py-3 pr-4">{r.speed}</td>
                    <td className="py-3 pr-4">{r.risk}</td>
                    <td className="py-3">{r.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
            <h2 className="text-[20px] font-semibold text-white">Our model</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Productized packages, 50% deposit, revision rounds written in, balance only when you
              approve. See the guarantee and packages — then take the pricing quiz if unsure.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/hire" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black">Fixed packages</a>
              <a href="/pricing-quiz" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Pricing quiz</a>
              <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#25D366]">Free call</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
