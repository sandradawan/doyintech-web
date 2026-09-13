import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";
import { SECURITY_PIPELINE } from "@/lib/store/catalog";

export const metadata: Metadata = {
  title: "DoyinStore Security",
  description: "How apps are scanned and reviewed before publishing on DoyinStore.",
};

export default function StoreSecurityPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                Trust & safety
              </p>
              <h1 className="mt-2 text-[32px] font-semibold text-white">Security before publish</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
                Fake and malicious apps are the biggest risk of any independent store. DoyinStore
                does not list apps until they pass automated checks and human review.
              </p>
            </div>
            <StoreNav />
          </div>

          <ol className="space-y-4">
            {SECURITY_PIPELINE.map((step, i) => (
              <li
                key={step.id}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
              >
                <p className="text-[12px] font-semibold text-[#ff8c14]">Step {i + 1}</p>
                <h2 className="mt-1 text-[18px] font-semibold text-white">{step.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{step.detail}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-5 text-[14px] leading-relaxed text-[#a1a1a6]">
            <p className="font-semibold text-white">About “auto install”</p>
            <p className="mt-2">
              After a successful free claim or payment, DoyinStore starts an{" "}
              <strong className="text-white">automatic download</strong> of the approved package.
              Installing on the device still requires the user to confirm — Android, Windows, and
              macOS block silent installs from websites. That is intentional OS security, not a
              missing feature we can bypass.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
