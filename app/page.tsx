import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
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
 * 10/10 homepage flow:
 * What do you do? → Can I trust you? → How much? → Let's talk.
 *
 * 1. Hero
 * 2. Trust bar + Client logos
 * 3. Featured Work
 * 4. Services
 * 5. Why DoyinTech
 * 6. Pricing
 * 7. Testimonials
 * 8. Founder
 * 9. Digital Products
 * 10. FAQ + Final CTA
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
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
