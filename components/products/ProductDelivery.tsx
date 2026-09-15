"use client";

import { useMemo, useState } from "react";
import type { DigitalProduct } from "@/lib/products";
import { productDownloadUrls, productWhatsAppLink } from "@/lib/products";

export default function ProductDelivery({
  product,
  reference,
  email = "",
}: {
  product: DigitalProduct;
  reference: string;
  email?: string;
}) {
  const urls = useMemo(() => productDownloadUrls(product), [product]);
  const [copied, setCopied] = useState(false);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Send my purchase: ${product.name}`);
    const body = encodeURIComponent(
      `Hi DoyinTech,\n\nI paid for "${product.name}".\nReference: ${reference}\nEmail: ${email}\n\nPlease email me the files.\n`
    );
    return `mailto:doyintechnology@gmail.com?subject=${subject}&body=${body}`;
  }, [product.name, reference, email]);

  const wa = productWhatsAppLink(
    `${product.name} (paid — ref ${reference})`,
    "delivery"
  );

  function copyLinks() {
    const text = urls.map((u) => `https://doyintech.vercel.app${u}`).join("\n");
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => alert("Could not copy")
    );
  }

  if (urls.length === 0) {
    return (
      <div className="mt-8 space-y-3 text-left">
        <p className="text-[15px] text-emerald-400">Payment confirmed.</p>
        <p className="text-[14px] text-[#a1a1a6]">
          This product is delivered manually (repo or ZIP). Message us with your reference.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
        >
          WhatsApp for delivery
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4 text-left">
      <p className="text-[15px] font-medium text-emerald-400">Your files are ready</p>
      <p className="text-[13px] text-[#a1a1a6]">
        Download now, or ask us to email a copy. Save the files — this page is tied to your payment
        session.
      </p>
      <div className="space-y-2">
        {urls.map((url) => {
          const name = url.split("/").pop() || "download.md";
          return (
            <a
              key={url}
              href={url}
              download={name}
              className="flex w-full items-center justify-between rounded-xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-4 py-3 text-[14px] font-semibold text-[#ff8c14] hover:bg-[#ff8c14]/20"
            >
              <span>Download {name}</span>
              <span aria-hidden>↓</span>
            </a>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLinks}
          className="rounded-full border border-white/20 px-4 py-2 text-[12px] text-white"
        >
          {copied ? "Links copied" : "Copy download links"}
        </button>
        <a
          href={mailto}
          className="rounded-full border border-white/20 px-4 py-2 text-[12px] text-white"
        >
          Email me the files
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#25D366]/40 px-4 py-2 text-[12px] text-[#25D366]"
        >
          WhatsApp help
        </a>
      </div>
    </div>
  );
}
