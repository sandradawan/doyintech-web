import { giftDesign, naira } from "@/lib/giftcards/shared";

/** The card itself: used for the design picker, the success page and the balance page. */
export default function GiftCardVisual({
  amountKobo,
  design,
  message,
  code,
  recipient,
  className = "",
}: {
  amountKobo: number;
  design: string;
  message?: string | null;
  code?: string | null;
  recipient?: string | null;
  className?: string;
}) {
  const d = giftDesign(design);
  return (
    <div
      className={`relative aspect-[1.6/1] w-full overflow-hidden rounded-[22px] p-5 shadow-2xl sm:p-6 ${className}`}
      style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})`, color: d.ink }}
    >
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15" />
      <div aria-hidden className="absolute -bottom-16 -left-6 h-44 w-44 rounded-full bg-black/10" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">DoyinTech gift card</p>
          <span aria-hidden className="text-[20px]">🎁</span>
        </div>
        <p className="mt-2 text-[34px] font-bold leading-none tracking-tight sm:text-[40px]">{naira(amountKobo)}</p>
        {recipient && <p className="mt-2 text-[13px] font-medium opacity-90">For {recipient}</p>}
        {message && <p className="mt-1 line-clamp-2 text-[13px] opacity-90">&ldquo;{message}&rdquo;</p>}
        <div className="mt-auto">
          {code ? (
            <p className="inline-block rounded-lg bg-white/90 px-3 py-1.5 font-mono text-[14px] font-semibold tracking-[0.08em] text-[#111] sm:text-[16px]">
              {code}
            </p>
          ) : (
            <p className="text-[12px] opacity-75">doyintech.com/gift-cards</p>
          )}
        </div>
      </div>
    </div>
  );
}
