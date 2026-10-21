import type { SubscriptionPlan } from "@/lib/subscriptions/plans";
import { intervalLabel } from "@/lib/subscriptions/plans";
import { formatUsdFromNgn } from "@/lib/currency";
import SubscribeButton from "@/components/subscriptions/SubscribeButton";

export default function PlanCard({ plan, highlight = false }: { plan: SubscriptionPlan; highlight?: boolean }) {
  const per = intervalLabel(plan.interval);
  return (
    <div
      className={`flex h-full flex-col rounded-[22px] border p-6 ${
        highlight
          ? "border-[#ff8c14]/50 bg-gradient-to-b from-[#ff8c14]/10 to-[#141a28]"
          : "border-white/10 bg-[#141a28]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[19px] font-semibold text-white">{plan.name}</h3>
        {plan.badge && (
          <span className="shrink-0 rounded-full bg-[#ff8c14]/15 px-2.5 py-1 text-[11px] font-semibold text-[#ff8c14]">
            {plan.badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-[14px] text-[#a1a1a6]">{plan.tagline}</p>
      <p className="mt-5">
        <span className="text-[34px] font-semibold tracking-tight text-white">
          ₦{plan.amountNgn.toLocaleString("en-NG")}
        </span>
        <span className="text-[14px] text-[#86868b]"> / {per}</span>
      </p>
      <p className="text-[12px] text-[#86868b]">≈ {formatUsdFromNgn(plan.amountNgn)} / {per}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2 text-[14px] leading-snug text-[#c7cdd8]">
            <span className="text-[#ff8c14]" aria-hidden>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <SubscribeButton planId={plan.id} label={`Start ${plan.name}`} highlight={highlight} />
      </div>
    </div>
  );
}
