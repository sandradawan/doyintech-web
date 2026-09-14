"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import EbookDelivery from "@/components/ebooks/EbookDelivery";
import { getDigitalProduct } from "@/lib/products";
import { getPaidToolByProductId, setUnlocked } from "@/lib/tools/paid";
import { getEbook } from "@/lib/ebooks";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { UI_COMPONENTS, getUiComponent, formatCompPrice } from "@/lib/ui-components";
import { PAGE_TEMPLATES, getPageTemplate } from "@/lib/page-templates";

function SuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const productId = params.get("product") || "";
  const product = productId ? getDigitalProduct(productId) : undefined;
  const paidTool = productId ? getPaidToolByProductId(productId) : undefined;

  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const [detail, setDetail] = useState<any>(null);
  const [resolvedProductId, setResolvedProductId] = useState(productId);

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
          setResolvedProductId(pid);
          const tool = getPaidToolByProductId(pid);
          if (tool) setUnlocked(tool.unlockKey);

          const book = findAnyEbook(pid) || getEbook(pid);
          if (book) {
            try {
              sessionStorage.setItem(`ebook_unlocked_${book.slug}`, "1");
              localStorage.setItem(`ebook_unlocked_${book.slug}`, "1");
            } catch {
              /* ignore */
            }
          }

          const comp =
            UI_COMPONENTS.find((c) => c.id === pid || c.slug === pid) || getUiComponent(pid);
          if (comp) {
            try {
              sessionStorage.setItem(`comp_unlocked_${comp.slug}`, "1");
              localStorage.setItem(`comp_unlocked_${comp.slug}`, "1");
              if (comp.slug === "agency-ui-kit") {
                UI_COMPONENTS.forEach((c) => {
                  localStorage.setItem(`comp_unlocked_${c.slug}`, "1");
                  sessionStorage.setItem(`comp_unlocked_${c.slug}`, "1");
                });
              }
            } catch {
              /* ignore */
            }
          }

          const tpl =
            PAGE_TEMPLATES.find((t) => t.id === pid || t.slug === pid) || getPageTemplate(pid);
          if (tpl) {
            try {
              sessionStorage.setItem(`tpl_unlocked_${tpl.slug}`, "1");
              localStorage.setItem(`tpl_unlocked_${tpl.slug}`, "1");
              if (tpl.slug === "all-templates-bundle") {
                PAGE_TEMPLATES.forEach((t) => {
                  localStorage.setItem(`tpl_unlocked_${t.slug}`, "1");
                  sessionStorage.setItem(`tpl_unlocked_${t.slug}`, "1");
                });
              }
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

  const pid = resolvedProductId;
  const resolvedEbook = findAnyEbook(pid || "") || getEbook(pid || "");
  const resolvedComp =
    UI_COMPONENTS.find((c) => c.id === pid || c.slug === pid) || getUiComponent(pid || "");
  const resolvedTpl =
    PAGE_TEMPLATES.find((t) => t.id === pid || t.slug === pid) || getPageTemplate(pid || "");
  const kit = getUiComponent("agency-ui-kit");
  const showKitUpsell =
    resolvedComp && resolvedComp.slug !== "agency-ui-kit" && kit;

  const toolHref = paidTool ? `/tools/${paidTool.toolSlug}` : null;
  const title =
    paidTool?.title ||
    resolvedEbook?.title ||
    resolvedComp?.name ||
    resolvedTpl?.name ||
    product?.name ||
    productId ||
    "Purchase";

  const wa = encodeURIComponent(
    `Hi DoyinTech, I paid for "${title}" via Paystack.\nReference: ${reference}\nEmail: ${detail?.email || ""}`
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

            {resolvedEbook ? (
              <EbookDelivery
                productId={resolvedEbook.id}
                reference={reference}
                defaultEmail={detail?.email || ""}
                bookTitle={resolvedEbook.title}
                bookSlug={resolvedEbook.slug}
              />
            ) : resolvedComp ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">Component source unlocked.</p>
                <a
                  href={`/components/${resolvedComp.slug}?paid=1&reference=${encodeURIComponent(reference)}`}
                  className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
                >
                  Open source code
                </a>
              </div>
            ) : resolvedTpl ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">Template unlocked.</p>
                <a
                  href={`/templates/${resolvedTpl.slug}?paid=1&reference=${encodeURIComponent(reference)}`}
                  className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
                >
                  Open template
                </a>
              </div>
            ) : toolHref ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">Tool unlocked.</p>
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

            {showKitUpsell && kit && (
              <div className="mt-10 rounded-2xl border border-[#ff8c14]/30 bg-[#141a28] p-5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                  Upsell
                </p>
                <h2 className="mt-1 text-[18px] font-semibold text-white">Get the Full UI Kit</h2>
                <p className="mt-2 text-[13px] text-[#a1a1a6]">
                  Unlock all 14 components for {formatCompPrice(kit.priceNgn)} — better value than
                  buying one-by-one.
                </p>
                <a
                  href={`/components/${kit.slug}`}
                  className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
                >
                  View Full UI Kit
                </a>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-[14px]">
              <a href="/components" className="text-[#2997ff] hover:underline">
                Components
              </a>
              <a href="/products" className="text-[#2997ff] hover:underline">
                Products
              </a>
              <a href="/ebooks" className="text-[#2997ff] hover:underline">
                Ebooks
              </a>
            </div>
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
