import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
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
 * Premium conversion homepage — only sections that build trust or make money.
 * Hire / deposit · Digital products · Free audit · Proof · FAQ · Contact
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
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
