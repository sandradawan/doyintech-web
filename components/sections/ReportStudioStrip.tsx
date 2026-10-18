import Link from "next/link";

const CHANNELS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "WhatsApp",
  "Website",
  "X",
];

export default function ReportStudioStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0c0c0e]">
      <div className="mx-auto flex max-w-[1020px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-12">
        <div className="max-w-xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">
            New · AI Report Studio
          </p>
          <h2 className="mt-2 font-display text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">
            Multi-platform digital audits
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6] sm:text-[15px]">
            Instagram, Facebook, TikTok, YouTube, LinkedIn, WhatsApp, your website, and more —
            one branded report with practical next steps. From ₦5,000.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CHANNELS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#a1a1a6]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <Link
            href="/reports"
            className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black transition hover:brightness-110"
          >
            Open Report Studio →
          </Link>
          <Link
            href="/reports/track"
            className="text-center text-[13px] text-[#2997ff] hover:underline"
          >
            Track an existing order
          </Link>
        </div>
      </div>
    </section>
  );
}
