import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import TodayStrip from "@/components/daily/TodayStrip";
import ClientLogos from "@/components/sections/ClientLogos";
import CaseStudiesTeaser from "@/components/sections/CaseStudiesTeaser";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import PassiveProducts from "@/components/sections/PassiveProducts";
import FAQ from "@/components/sections/FAQ";
import BookCall from "@/components/sections/BookCall";
import Footer from "@/components/ui/Footer";
import FeaturedShops from "@/components/storefront/FeaturedShops";
import PopularCalculators from "@/components/sections/PopularCalculators";

import type { Metadata } from "next";

// Featured (sponsored) shops change as sellers buy placement.
export const revalidate = 600;

const TITLE = "Website Design in Nigeria, Free Business Tools and Ebooks | DoyinTech";
const DESCRIPTION = "Fixed-price website design for Nigerian businesses, free invoice and tax tools, PDF ebooks and digital products. Pay securely with Paystack. Live in days.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/" },
};

/**
 * Homepage funnel: promise (hero) → proof (logos, case studies) → offer (packages + care plans)
 * → reassurance (testimonials) → lower-commitment option (kits, Pro) → objections (FAQ) → CTA.
 * Every primary button leads to /hire (lib/cta.ts).
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
        <TodayStrip />
        <ClientLogos />
        <CaseStudiesTeaser />
        <Packages />
        <Testimonials />
        <PassiveProducts />
        <FeaturedShops />
        <PopularCalculators className="py-16" />
        <FAQ />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}
