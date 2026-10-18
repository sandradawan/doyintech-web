import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ReportStudioStrip from "@/components/sections/ReportStudioStrip";
import ClientLogos from "@/components/sections/ClientLogos";
import CaseStudiesTeaser from "@/components/sections/CaseStudiesTeaser";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import Founder from "@/components/sections/Founder";
import PassiveProducts from "@/components/sections/PassiveProducts";
import FAQ from "@/components/sections/FAQ";
import BookCall from "@/components/sections/BookCall";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

/**
 * Homepage: Hero → Trust → Report Studio (fast discovery) → work → services → pricing → CTA.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
        <ReportStudioStrip />
        <ClientLogos />
        <CaseStudiesTeaser />
        <Services />
        <Packages />
        <Testimonials />
        <Founder />
        <PassiveProducts />
        <FAQ />
        <BookCall />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
