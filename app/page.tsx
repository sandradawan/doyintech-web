import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ReportStudioStrip from "@/components/sections/ReportStudioStrip";
import ClientLogos from "@/components/sections/ClientLogos";
import CaseStudiesTeaser from "@/components/sections/CaseStudiesTeaser";
import Services from "@/components/sections/Services";
import WhyChoose from "@/components/sections/WhyChoose";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import Founder from "@/components/sections/Founder";
import PassiveProducts from "@/components/sections/PassiveProducts";
import FAQ from "@/components/sections/FAQ";
import BookCall from "@/components/sections/BookCall";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

/**
 * Homepage flow: What do you do? → Can I trust you? → How much? → Let's talk.
 * Report Studio strip sits high so multi-platform audits are visible fast.
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
        <WhyChoose />
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
