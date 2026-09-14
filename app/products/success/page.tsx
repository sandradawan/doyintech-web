"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { getDigitalProduct } from "@/lib/products";
import { getPaidToolByProductId, setUnlocked } from "@/lib/tools/paid";
import { EBOOKS, getEbook } from "@/lib/ebooks";

function SuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const productId = params.get("product") || "";
  const product = productId ? getDigitalProduct(productId) : undefined;
  const paidTool = productId ? getPaidToolByProductId(productId) : undefined;
  const ebook =
    productId
      ? EBOOKS.find((e) => e.id === productId || e.slug === productId) || getEbook(productId)
      : undefined;

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
          const pid = data.metadata?.product_id || productId;
          const tool = getPaidToolByProductId(pid);
          if (tool) setUnlocked(tool.unlockKey);

          // Unlock ebook on this browser
          const book =
            EBOOKS.find((e) => e.id === pid || e.slug === pid) || getEbook(pid);
          if (book) {
            try {
              sessionStorage.setItem(`ebook_unlocked_${book.slug}`, "1");
              localStorage.setItem(`ebook_unlocked_${book.slug}`, "1");
            } catch {
              /* ignore */
            }
          }
        } else {
          setState("fail");
          setDetail(data);
        }
      })
      .catch(() => setState("fail"));
  }, [reference, productId]);

  const toolHref = paidTool ? `/tools/${paidTool.toolSlug}` : null;
  const ebookHref = ebook ? `/ebooks/${ebook.slug}?paid=1&reference=${encodeURIComponent(reference)}` : null;
  const title = paidTool?.title || ebook?.title || product?.name || productId || "Purchase";

  const wa = encodeURIComponent(
    `Hi DoyinTech, I paid for "${title}" via Paystack.\nReference: ${reference}\nEmail: ${detail?.email || ""}\nPlease confirm delivery.`
  );

  return (
    <main className="bg-black px-6 pb-24 pt-28">
      <div className="mx-auto max-w-lg text-center">
        {state === "loading" && (
          <p className="text-[15px] text-[#a1a1a6]">Verifying payment…</p>
        )}

        {state === "ok" && (
          <>
            <p className="text-[48px]">✓</p>
            <h1 className="mt-2 text-[32px] font-semibold text-[#f5f5f7]">Payment successful</h1>
            <p className="mt-3 text-[16px] text-[#a1a1a6]">{title} confirmed.</p>
            {detail?.email && (
              <p className="mt-2 text-[14px] text-[#a1a1a6]">Email: {detail.email}</p>
            )}
            <p className="mt-1 text-[13px] text-[#a1a1a6]">Ref: {reference}</p>

            {ebookHref ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">
                  Your ebook is unlocked on this device.
                </p>
                <a
                  href={ebookHref}
                  className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
                >
                  Read full ebook now
                </a>
                <p className="text-[13px] text-[#a1a1a6]">
                  All chapters open on the book page. Keep this browser/device, or message us for a
                  PDF copy.
                </p>
                <a
                  href={`https://wa.me/2348085343926?text=${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white"
                >
                  Request PDF on WhatsApp
                </a>
              </div>
            ) : toolHref ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">Tool unlocked on this browser.</p>
                <a
                  href={toolHref}
                  className="inline-flex rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-black"
                >
                  Open {paidTool?.title}
                </a>
              </div>
            ) : (
              <a
                href={`https://wa.me/2348085343926?text=${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
              >
                Message us for delivery
              </a>
            )}

            <a href="/ebooks" className="mt-6 block text-[14px] text-[#2997ff] hover:underline">
              All ebooks
            </a>
          </>
        )}

        {state === "fail" && (
          <>
            <h1 className="text-[28px] font-semibold text-[#f5f5f7]">Payment not confirmed</h1>
            <a
              href={`https://wa.me/2348085343926?text=${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Contact support
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
      <Suspense fallback={<main className="bg-black pt-28 text-center text-[#a1a1a6]">Loading…</main>}>
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
