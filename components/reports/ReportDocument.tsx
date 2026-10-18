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
      <div className="no-print sticky top-0 z-20 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[800px] flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#a1a1a6]">
            {productName} · {orderId}
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-[#ff8c14] px-5 py-2 text-[13px] font-semibold text-black"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <article className="report-doc mx-auto max-w-[800px] bg-white px-6 py-10 text-[#111] sm:px-10 sm:py-14">
        <header className="border-b border-neutral-200 pb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
            DoyinTech Report Studio
          </p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-black sm:text-[34px]">
            {report.title}
          </h1>
          <p className="mt-2 text-[16px] text-neutral-600">{report.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-neutral-500">
            <span>Prepared for {report.customerName}</span>
            {date && <span>{date}</span>}
            {report.profileUrl && <span className="break-all">{report.profileUrl}</span>}
            <span>Order {orderId}</span>
          </div>
        </header>

        <div className="mt-10 space-y-10">
          {report.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-[18px] font-semibold text-black">{section.title}</h2>
              {section.body && (
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">{section.body}</p>
              )}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-neutral-700">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {report.actionPlan && report.actionPlan.length > 0 && (
            <section>
              <h2 className="text-[18px] font-semibold text-black">30-day action plan</h2>
              <div className="mt-4 space-y-4">
                {report.actionPlan.map((w) => (
                  <div key={w.week} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-[14px] font-semibold text-black">
                      {w.week}{w.focus ? ` — ${w.focus}` : ""}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-neutral-700">
                      {w.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-14 border-t border-neutral-200 pt-6">
          <p className="text-[12px] leading-relaxed text-neutral-500">{report.disclaimer}</p>
          <p className="mt-4 text-[12px] text-neutral-400">
            © {new Date().getFullYear()} DoyinTech · Jos, Nigeria · doyintech.com/reports
          </p>
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .report-doc { max-width: none !important; padding: 0 !important; }
        }
      `}</style>
    </>
  );
}
