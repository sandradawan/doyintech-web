import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import { DIGITAL_PRODUCTS } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Digital Products for Nigerian Businesses and Schools";
const DESCRIPTION =
  "Instant-download templates and kits: HR policy pack, payroll and PAYE sheet, office templates, business plan kit, school fees tracker and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/products" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DoyinTech digital products",
  itemListElement: DIGITAL_PRODUCTS.filter((p) => p.type === "one-time").map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: absoluteUrl(`/products/${p.id}`),
    name: p.name,
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-16 pt-24">
        <div className="mx-auto max-w-[760px] px-6 pb-10 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">Instant download · Paystack · NGN</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[44px]">Templates and kits that do the paperwork for you</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">
            Ready-to-use packs for business owners, offices and HR, schools, churches, NGOs and students. Each one is a guide plus spreadsheets you can open in Excel or Google Sheets the minute you pay.
          </p>
        </div>
        <ProductsCatalog />
      </main>
      <Footer />
    </>
  );
}
