"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import EbookDelivery from "@/components/ebooks/EbookDelivery";
import EbookBundleDelivery from "@/components/ebooks/EbookBundleDelivery";
import ProductUpsells, {
  ServiceSuccessChecklist,
} from "@/components/products/ProductUpsells";
import { setUnlocked } from "@/lib/tools/paid";
import { rememberPurchaseRef } from "@/lib/shop/usePurchaseUnlock";

// Mirrors ProductSummary in lib/payments/purchase.ts (server-only module).
type ProductSummary = {
  id: string;
  kind: "ebook" | "ebook-bundle" | "component" | "template" | "tool" | "digital" | "service" | "other";
  title: string;
  slug?: string;
  toolSlug?: string;
  unlockKey?: string;
  isBundle?: boolean;
  books?: { id: string; title: string; slug: string }[];
};

type VerifyResult = {
  ok: boolean;
  email?: string;
  product?: ProductSummary | null;
  delivery?: {
    emailed: boolean;
    downloadLinks: { label: string; url: string }[];
  } | null;
};

const COMPONENT_KIT_SLUG = "agency-ui-kit";

function SuccessInner() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const productParam = params.get("product") || "";

  const [state, setState] = useState<"loading" | "ok" | "fail">(reference ? "loading" : "fail");
  const [detail, setDetail] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data: VerifyResult) => {
        setDetail(data);
        if (!data.ok) {
          setState("fail");
          return;
        }
        setState("ok");
        rememberPurchaseRef(reference);
        if (data.product?.kind === "tool" && data.product.unlockKey) {
          setUnlocked(data.product.unlockKey);
        }
      })
      .catch(() => setState("fail"));
  }, [reference]);

  const product = detail?.product;
  const title = product?.title || productParam || "Purchase";
  const email = detail?.email || "";
  const links = detail?.delivery?.downloadLinks || [];
  const refQuery = `reference=${encodeURIComponent(reference)}`;

  const wa = encodeURIComponent(
    `Hi DoyinTech, I paid for "${title}" via Paystack.\nReference: ${reference}\nEmail: ${email}`
  );

  return (
    <main className="bg-brand-deep px-6 pb-24 pt-28">
      <div className="mx-auto max-w-lg text-center">
        {state === "loading" && (
          <p className="text-[15px] text-brand-muted">Verifying payment…</p>
        )}

        {state === "ok" && (
          <>
            <p className="text-[48px]" aria-hidden>
              ✓
            </p>
            <h1 className="mt-2 text-[32px] font-semibold text-brand-ink">Payment successful</h1>
            <p className="mt-3 text-[16px] text-brand-muted">{title} confirmed.</p>
            {email && <p className="mt-2 text-[14px] text-brand-muted">Email: {email}</p>}
            <p className="mt-1 text-[13px] text-brand-muted">Ref: {reference}</p>

            {links.length > 0 && (
              <div className="mt-8 rounded-2xl border border-brand-ink/10 bg-brand-ink/[0.04] p-5 text-left">
                <p className="text-[15px] font-semibold text-brand-ink">Your files</p>
                <p className="mt-1 text-[13px] text-[#94a3b8]">
                  {detail?.delivery?.emailed
                    ? "Also sent to your email as PDF + Markdown."
                    : "Download below and keep a copy. Links expire in 7 days."}
                </p>
                <ul className="mt-4 space-y-2">
                  {links.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        className="text-[14px] font-medium text-brand-link hover:underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product?.kind === "service" ? (
              <ServiceSuccessChecklist
                serviceName={product.title}
                reference={reference}
                email={email}
              />
            ) : product?.kind === "ebook-bundle" && product.books ? (
              <EbookBundleDelivery reference={reference} title={product.title} books={product.books} />
            ) : product?.kind === "ebook" && product.slug ? (
              <EbookDelivery
                productId={product.id}
                reference={reference}
                defaultEmail={email}
                bookTitle={product.title}
                bookSlug={product.slug}
              />
            ) : product?.kind === "component" && product.slug ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">
                  {product.isBundle ? "All component source unlocked." : "Component source unlocked."}
                </p>
                <a
                  href={`/components/${product.isBundle ? "" : product.slug}?${refQuery}`}
                  className="inline-flex rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black"
                >
                  {product.isBundle ? "Browse components" : "Open source code"}
                </a>
              </div>
            ) : product?.kind === "template" && product.slug ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">
                  {product.isBundle ? "All templates unlocked." : "Template unlocked."}
                </p>
                <a
                  href={`/templates/${product.isBundle ? "" : product.slug}?${refQuery}`}
                  className="inline-flex rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black"
                >
                  {product.isBundle ? "Browse templates" : "Open template"}
                </a>
              </div>
            ) : product?.kind === "tool" && product.toolSlug ? (
              <div className="mt-8 space-y-3">
                <p className="text-[15px] text-emerald-400">Tool unlocked on this device.</p>
                <a
                  href={`/tools/${product.toolSlug}`}
                  className="inline-flex rounded-full bg-brand-ink px-6 py-3 text-[15px] font-semibold text-brand-deep"
                >
                  Open {product.title}
                </a>
              </div>
            ) : product?.kind === "digital" ? (
              <>
                {links.length === 0 && (
                  <p className="mt-8 text-[14px] text-brand-muted">
                    Your files are on their way to {email || "your email"}. If nothing arrives in
                    10 minutes, message us with your reference.
                  </p>
                )}
                <ProductUpsells productId={product.id} />
              </>
            ) : (
              <a
                href={`https://wa.me/2348085343926?text=${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-black"
              >
                Message us for delivery
              </a>
            )}

            {product?.kind === "component" && !product.isBundle && (
              <div className="mt-10 rounded-2xl border border-brand-link/30 bg-brand-surface p-5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-link">
                  Save on the rest
                </p>
                <h2 className="mt-1 text-[18px] font-semibold text-brand-ink">Get the Full UI Kit</h2>
                <p className="mt-2 text-[13px] text-brand-muted">
                  Every component in one purchase.
                </p>
                <a
                  href={`/components/${COMPONENT_KIT_SLUG}`}
                  className="mt-4 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-[13px] font-semibold text-black"
                >
                  View Full UI Kit
                </a>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-[14px]">
              <a href="/hire" className="text-brand-link hover:underline">
                Hire us
              </a>
              <Link href="/products" className="text-brand-link hover:underline">
                Products
              </Link>
              <Link href="/ebooks" className="text-brand-link hover:underline">
                Ebooks
              </Link>
            </div>
          </>
        )}

        {state === "fail" && (
          <>
            <h1 className="text-[28px] font-semibold text-brand-ink">Payment not confirmed</h1>
            <p className="mt-3 text-[15px] text-brand-muted">
              If money left your account, send us the Paystack reference and we will check it
              manually.
            </p>
            <a
              href={`https://wa.me/2348085343926?text=${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-black"
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
      <Suspense fallback={<main className="bg-brand-deep pt-28 text-center text-brand-muted">Loading…</main>}>
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
