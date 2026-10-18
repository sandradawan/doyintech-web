"use client";

import type { GeneratedReport } from "@/lib/reports/generate";

export default function ReportDocument({
  report,
  orderId,
  productName,
}: {
  report: GeneratedReport;
  orderId: string;
  productName: string;
}) {
  const date = report.generatedAt
    ? new Date(report.generatedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <div className="no-print sticky top-0 z-20 border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#ff8c14]">
              DoyinTech Report Studio
            </p>
            <p className="text-[13px] text-[#a1a1a6]">
              {productName} · {orderId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:brightness-110"
            >
              Download PDF
            </button>
            <a
              href="/reports"
              className="rounded-full border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white transition hover:border-white/30"
            >
              Order another
            </a>
          </div>
        </div>
      </div>

      <article className="report-doc mx-auto max-w-[820px] bg-white text-[#1a1a1a]">
        <div className="report-cover bg-gradient-to-br from-[#0a0a0b] via-[#141416] to-[#1a1208] px-8 py-12 text-white sm:px-12 sm:py-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff8c14]">
                DoyinTech · Report Studio
              </p>
              <h1 className="mt-3 max-w-xl text-[26px] font-semibold leading-tight tracking-tight sm:text-[32px]">
                {report.title}
              </h1>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/70">
                {report.subtitle}
              </p>
            </div>
            <div className="hidden shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right sm:block">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Order</p>
              <p className="font-mono text-[12px] text-white/90">{orderId}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-6 text-[13px] text-white/60">
            <span>
              <span className="text-white/40">Prepared for </span>
              <span className="font-medium text-white">{report.customerName}</span>
            </span>
            {date && (
              <span>
                <span className="text-white/40">Date </span>
                {date}
              </span>
            )}
          </div>
          {report.platformsReviewed && report.platformsReviewed.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {report.platformsReviewed.map((pl) => (
                <span
                  key={pl.url}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80"
                >
                  {pl.platform}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-10 sm:px-12 sm:py-12">
          {report.platformsReviewed && report.platformsReviewed.length > 0 && (
            <div className="mb-10 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Channels reviewed
              </p>
              <ul className="mt-3 space-y-2">
                {report.platformsReviewed.map((pl) => (
                  <li
                    key={pl.url}
                    className="flex flex-col gap-0.5 text-[13px] sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <span className="min-w-[100px] font-semibold text-neutral-800">
                      {pl.platform}
                    </span>
                    <span className="break-all text-neutral-500">{pl.url}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-11">
            {report.sections.map((section, idx) => (
              <section key={section.title} className="report-section">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] font-medium text-[#ff8c14]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[18px] font-semibold tracking-tight text-neutral-900">
                    {section.title}
                  </h2>
                </div>
                {section.body && (
                  <p className="mt-3 text-[15px] leading-[1.7] text-neutral-700">
                    {section.body}
                  </p>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-[14px] leading-relaxed text-neutral-700"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff8c14]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {report.actionPlan && report.actionPlan.length > 0 && (
              <section>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] font-medium text-[#ff8c14]">
                    {String(report.sections.length + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[18px] font-semibold tracking-tight text-neutral-900">
                    30-day action plan
                  </h2>
                </div>
                <p className="mt-2 text-[14px] text-neutral-600">
                  Execute in order. Each week builds on the last.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {report.actionPlan.map((w) => (
                    <div
                      key={w.week}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                        {w.week}
                      </p>
                      {w.focus && (
                        <p className="mt-1 text-[15px] font-semibold text-neutral-900">
                          {w.focus}
                        </p>
                      )}
                      <ul className="mt-3 space-y-2">
                        {w.tasks.map((t) => (
                          <li
                            key={t}
                            className="flex gap-2 text-[13px] leading-relaxed text-neutral-700"
                          >
                            <span className="text-[#ff8c14]">→</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-14 rounded-2xl border border-[#ff8c14]/25 bg-[#fff8f0] p-6">
            <p className="text-[15px] font-semibold text-neutral-900">
              Next step with DoyinTech
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-700">
              Ready to implement these recommendations — website, WhatsApp systems, or
              full multi-channel presence? Book a free discovery call or message us on
              WhatsApp.
            </p>
            <p className="mt-3 text-[13px] text-neutral-600">
              doyintech.com · +234 808 534 3926
            </p>
          </div>

          <footer className="mt-12 border-t border-neutral-200 pt-6">
            <p className="text-[12px] leading-relaxed text-neutral-500">
              {report.disclaimer}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
              <span>
                © {new Date().getFullYear()} DoyinTech · Jos, Nigeria · Confidential for{" "}
                {report.customerName}
              </span>
              <span className="font-mono">{orderId}</span>
            </div>
          </footer>
        </div>
      </article>

      <style jsx global>{`
        @media print {
          @page {
            margin: 14mm 12mm;
            size: A4;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .report-doc {
            max-width: none !important;
            box-shadow: none !important;
          }
          .report-cover {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            break-inside: avoid;
          }
          .report-section {
            break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
