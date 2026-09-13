"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { getDigitalProduct } from "@/lib/products";

function SuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const productId = params.get("product") || "";
  const product = productId ? getDigitalProduct(productId) : undefined;

  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const [detail, setDetail] = useState<any>(null);

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
          setDetail(data);
        } else {
          setState("fail");
          setDetail(data);
        }
      })
      .catch(() => setState("fail"));
  }, [reference]);

  const wa = encodeURIComponent(
    `Hi DoyinTech, I paid for "${product?.name || productId}" via Paystack.\nReference: ${reference}\nEmail: ${detail?.email || ""}\nPlease send my product files.`
  );

  return (
    <main className="bg-black px-6 pb-24 pt-28">
      <div className="mx-auto max-w-lg text-center">
        {state === "loading" && (
          <p className="text-[15px] text-[#a1a1a6]">Verifying payment…</p>
        )}

        {state === "ok" && (
          <>
            <p className="text-[48px]" aria-hidden>
              ✓
            </p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-[#f5f5f7]">
              Payment successful
            </h1>
            <p className="mt-3 text-[16px] text-[#a1a1a6]">
              {product?.name || "Your product"} is confirmed.
            </p>
            {detail?.email && (
              <p className="mt-2 text-[14px] text-[#a1a1a6]">Email: {detail.email}</p>
            )}
            <p className="mt-1 text-[13px] text-[#a1a1a6]">Ref: {reference}</p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#1d1d1f] p-5 text-left text-[14px] text-[#f5f5f7]">
              <p className="font-semibold">What happens next</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-[#a1a1a6]">
                <li>We receive your payment (Paystack)</li>
                <li>Product files are prepared for you</li>
                <li>Delivery by email / WhatsApp (usually within a few hours)</li>
              </ol>
              {product?.delivery && (
                <p className="mt-3 text-[13px] text-[#2997ff]">{product.delivery}</p>
              )}
            </div>

            <a
              href={`https://wa.me/2348085343926?text=${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Message us to receive files
            </a>
            <a href="/products" className="mt-4 block text-[14px] text-[#2997ff] hover:underline">
              Back to products
            </a>
          </>
        )}

        {state === "fail" && (
          <>
            <h1 className="text-[28px] font-semibold text-[#f5f5f7]">Payment not confirmed</h1>
            <p className="mt-3 text-[15px] text-[#a1a1a6]">
              If you were charged, message us with your reference and we will sort it out.
            </p>
            <p className="mt-2 text-[13px] text-[#a1a1a6]">Ref: {reference || "none"}</p>
            <a
              href={`https://wa.me/2348085343926?text=${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Contact support on WhatsApp
            </a>
            <a href="/products" className="mt-4 block text-[14px] text-[#2997ff] hover:underline">
              Try again
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function ProductSuccessPage() {
  return (
    <>
      <Suspense
        fallback={
          <main className="bg-black px-6 pb-24 pt-28 text-center text-[#a1a1a6]">
            Loading…
          </main>
        }
      >
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
