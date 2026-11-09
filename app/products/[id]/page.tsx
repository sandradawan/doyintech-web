import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";
import { DIGITAL_PRODUCTS, getDigitalProduct, productCategory, productWhatsAppLink } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DIGITAL_PRODUCTS.filter((p) => p.type === "one-time").map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getDigitalProduct((await params).id);
  if (!p) return { title: "Product" };
  const title = `${p.name}: ${p.priceNgn} Download`;
  return {
    title,
    description: p.description,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { images: ["/opengraph-image"], title, description: p.description, url: `/products/${p.id}` },
  };
}

const catSlug = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

function Tick() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-[#ff8c14]" fill="currentColor">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
    </svg>
  );
}

export default async function ProductPage({ params }: Props) {
  const p = getDigitalProduct((await params).id);
  if (!p || p.type !== "one-time") notFound();
  const category = productCategory(p);
  const related = DIGITAL_PRODUCTS.filter((x) => x.id !== p.id && x.type === "one-time" && productCategory(x) === category).slice(0, 3);
  const url = absoluteUrl(`/products/${p.id}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      category,
      brand: { "@type": "Brand", name: "DoyinTech" },
      url,
      offers: {
        "@type": "Offer",
        price: (p.amountKobo / 100).toFixed(2),
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Products", item: absoluteUrl("/products") },
        { "@type": "ListItem", position: 2, name: p.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1040px] px-6">
          <nav aria-label="Breadcrumb" className="text-[14px] text-[#a1a1a6]">
            <Link href="/products" className="text-[#ffb366] hover:underline">Products</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/products?c=${catSlug(category)}`} className="hover:underline">{category}</Link>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
            <div>
              {p.badge && <span className="rounded-full bg-[#ff8c14]/15 px-3 py-1 text-[12px] font-semibold text-[#ffb366]">{p.badge}</span>}
              <h1 className="mt-4 text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[42px]">{p.name}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-[#c7cdd8]">{p.description}</p>
              {p.audience && (
                <p className="mt-4 text-[15px] text-[#a1a1a6]">
                  <strong className="font-semibold text-white">For:</strong> {p.audience}
                </p>
              )}

              <section className="mt-10">
                <h2 className="text-[20px] font-semibold text-white">What you get</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-[14px] text-[#e8eaed]">
                      <Tick />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              {p.contents && (
                <section className="mt-10">
                  <h2 className="text-[20px] font-semibold text-white">Files in your download</h2>
                  <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10">
                    {p.contents.map((c) => (
                      <li key={c} className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#e8eaed]">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-[#a1a1a6]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                          <path d="M14 3v5h5" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {p.demandNote && (
                <section className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-5">
                  <h2 className="text-[16px] font-semibold text-white">Why we made it</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{p.demandNote}</p>
                </section>
              )}

              <section className="mt-10">
                <h2 className="text-[20px] font-semibold text-white">How delivery works</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] text-[#c7cdd8]">
                  <li>Enter your email and pay by card, transfer or USSD through Paystack.</li>
                  <li>Download links appear straight away and are emailed to you with the PDF attached.</li>
                  <li>
                    {p.downloadPaths?.some((f) => f.endsWith(".csv"))
                      ? "Open the spreadsheets in Excel or Google Sheets and adapt the templates to your organisation."
                      : "Print the pages you need, or edit the Markdown copy to make it your own."}
                  </li>
                </ol>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[#ff8c14]/40 bg-gradient-to-b from-[#1f2128] to-[#141a28] p-6">
                <p className="text-[34px] font-semibold text-white">{p.priceNgn}</p>
                <p className="text-[13px] text-[#a1a1a6]">One-time payment · about {p.priceUsd}</p>
                <div className="mt-5">
                  <PaystackBuyButton product={p} />
                </div>
                <p className="mt-4 text-[13px] text-[#a1a1a6]">{p.delivery}</p>
                <a
                  href={productWhatsAppLink(p.name, "digital product")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-10 items-center text-[13px] font-semibold text-[#25D366] hover:underline"
                >
                  Questions? Ask on WhatsApp
                </a>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-[20px] font-semibold text-white">More in {category}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/products/${r.id}`} className="rounded-2xl border border-white/10 bg-[#16181d] p-5 transition hover:border-[#ff8c14]/50">
                    <p className="text-[15px] font-semibold text-white">{r.name}</p>
                    <p className="mt-2 line-clamp-2 text-[13px] text-[#a1a1a6]">{r.description}</p>
                    <p className="mt-3 text-[16px] font-semibold text-white">{r.priceNgn}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
