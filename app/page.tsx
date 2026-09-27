import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ResultsProof from "@/components/sections/ResultsProof";
import Packages from "@/components/sections/Packages";
import PassiveProducts from "@/components/sections/PassiveProducts";
import Projects from "@/components/sections/Projects";
import Guarantee from "@/components/sections/Guarantee";
import LeadMagnet from "@/components/sections/LeadMagnet";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

/**
 * Premium conversion homepage — trust → proof → packages → products → hire paths.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
        <ResultsProof />
        <Packages />
        <PassiveProducts />
        <Projects />
        <Guarantee />
        <LeadMagnet />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
