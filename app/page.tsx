import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ClientLogos from "@/components/sections/ClientLogos";
import CaseStudiesTeaser from "@/components/sections/CaseStudiesTeaser";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import PassiveProducts from "@/components/sections/PassiveProducts";
import FAQ from "@/components/sections/FAQ";
import BookCall from "@/components/sections/BookCall";
import Footer from "@/components/ui/Footer";
import FeaturedShops from "@/components/storefront/FeaturedShops";

import type { Metadata } from "next";

// Featured (sponsored) shops change as sellers buy placement.
export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
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
        <ClientLogos />
        <CaseStudiesTeaser />
        <Packages />
        <Testimonials />
        <PassiveProducts />
        <FeaturedShops />
        <FAQ />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}
