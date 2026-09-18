import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Client project portal | DoyinTech",
  description:
    "After deposit: checklist, shared folder, draft feedback, and balance before handoff.",
};

const steps = [
  {
    t: "1 · Deposit confirmed",
    d: "Paystack receipt + WhatsApp confirmation. Your slot is locked.",
  },
  {
    t: "2 · Shared Drive folder",
    d: "We send a private Google Drive link. Upload logo, colours, text, photos.",
  },
  {
    t: "3 · First draft",
    d: "You review on mobile + desktop. One structured revision round (or two on Growth).",
  },
  {
    t: "4 · Balance",
    d: "Pay remaining balance only when you approve — before domain / final files.",
  },
  {
    t: "5 · Launch + support",
    d: "Go-live help and short post-launch WhatsApp support window.",
  },
];

export default function ClientPortalPage() {
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, I paid a deposit / have a live project. Please share my Drive folder and current status."
    );

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            After deposit
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">Project portal</h1>
          <p className="mt-3 text-[16px] text-[#a1a1a6]">
            Simple path from payment to launch. Message us with your Paystack reference if you need
            your folder link again.
          </p>

          <div className="mt-10 space-y-4">
            {steps.map((s) => (
              <div
                key={s.t}
                className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
              >
                <h2 className="text-[16px] font-semibold text-white">{s.t}</h2>
                <p className="mt-2 text-[14px] text-[#a1a1a6]">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
            <h2 className="text-[18px] font-semibold text-white">Need your folder or status?</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              WhatsApp is the live channel for every project. Include your name and payment
              reference.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white"
            >
              Open project WhatsApp
            </a>
          </div>

          <p className="mt-8 text-center text-[13px] text-[#86868b]">
            Not a client yet?{" "}
            <a href="/hire" className="text-[#ff8c14] hover:underline">
              Fixed-price packages
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
