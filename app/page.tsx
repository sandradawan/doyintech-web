import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Divisions from "@/components/sections/Divisions";
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

const TITLE = "DoyinTech: Websites, Business Software and AI Automation in Nigeria";
const DESCRIPTION = "Fixed-price websites, AI assistants and business software for Nigerian and international businesses, plus DoyinOps, templates, ebooks and free business tools. Pay securely with Paystack.";

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
        <Divisions />
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
