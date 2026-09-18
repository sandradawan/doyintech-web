"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { ServiceSuccessChecklist } from "@/components/products/ProductUpsells";
import { getServiceOffer } from "@/lib/service-offers";

function HireSuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const productId = params.get("product") || "";

  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const [email, setEmail] = useState("");
  const [resolvedId, setResolvedId] = useState(productId);

  useEffect(() => {
    if (!reference) {
      setState("fail");
      return;
    }
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setState("ok");
          setEmail(data.email || data.customer?.email || "");
          const pid = data.metadata?.product_id || productId;
          setResolvedId(pid);

          // Log deposit as high-intent lead (fire-and-forget)
          const service = getServiceOffer(pid);
          fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.metadata?.customer_name || data.email || "Deposit customer",
              email: data.email || data.customer?.email || "",
              product: service?.name || pid,
              type: "purchase",
              source: "hire-deposit",
              message: `Paystack deposit paid. Ref: ${reference}. Amount confirmed.`,
            }),
          }).catch(() => {});
        } else {
          setState("fail");
        }
      })
      .catch(() => setState("fail"));
  }, [reference, productId]);

  const service = getServiceOffer(resolvedId);

  return (
    <main className="min-h-screen bg-[#0a0e17] px-6 pb-24 pt-28">
      <div className="mx-auto max-w-lg text-center">
        {state === "loading" && (
          <p className="text-[15px] text-[#a1a1a6]">Verifying your deposit…</p>
        )}

        {state === "ok" && service && (
          <>
            <p className="text-[48px]" aria-hidden>
              ✓
            </p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white">
              Deposit received
            </h1>
            <p className="mt-3 text-[17px] text-[#a1a1a6]">
              {service.name} · {service.depositNgn} locked your slot.
            </p>
            {email && (
              <p className="mt-2 text-[14px] text-[#a1a1a6]">Receipt email: {email}</p>
            )}
            <p className="mt-1 text-[13px] text-[#86868b]">Ref: {reference}</p>

            <ServiceSuccessChecklist
              serviceName={service.name}
              reference={reference}
              email={email}
            />

            <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-5 text-left">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                What happens next
              </p>
              <ul className="mt-3 space-y-2 text-[14px] text-[#c7cdd8]">
                <li>· We reply on WhatsApp within 1 business day</li>
                <li>· Timeline starts after content + logo arrive</li>
                <li>· Balance due before final handoff / domain connect</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-[14px]">
              <a href="/hire" className="text-[#ff8c14] hover:underline">
                All packages
              </a>
              <a href="/case-studies" className="text-[#2997ff] hover:underline">
                Case studies
              </a>
              <a href="/" className="text-[#a1a1a6] hover:text-white">
                Home
              </a>
            </div>
          </>
        )}

        {state === "ok" && !service && (
          <>
            <p className="text-[48px]">✓</p>
            <h1 className="mt-2 text-[28px] font-semibold text-white">Payment successful</h1>
            <p className="mt-3 text-[15px] text-[#a1a1a6]">
              Ref: {reference}. We will follow up shortly.
            </p>
            <a
              href={`https://wa.me/2348085343926?text=${encodeURIComponent(
                `Hi DoyinTech, I paid a deposit.\nReference: ${reference}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Message on WhatsApp
            </a>
          </>
        )}

        {state === "fail" && (
          <>
            <h1 className="text-[28px] font-semibold text-white">Payment not confirmed</h1>
            <p className="mt-3 text-[15px] text-[#a1a1a6]">
              If money left your account, send the Paystack reference on WhatsApp and we will
              verify manually.
            </p>
            <a
              href={`https://wa.me/2348085343926?text=${encodeURIComponent(
                `Hi DoyinTech, deposit verification failed.\nReference: ${reference || "none"}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Contact support
            </a>
            <p className="mt-4">
              <a href="/hire" className="text-[14px] text-[#ff8c14] hover:underline">
                ← Back to hire
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function HireSuccessPage() {
  return (
    <>
      <Suspense
        fallback={
          <main className="min-h-screen bg-[#0a0e17] pt-28 text-center text-[#a1a1a6]">
            Loading…
          </main>
        }
      >
        <HireSuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
