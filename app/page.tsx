import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ResultsProof from "@/components/sections/ResultsProof";
import CaseStudiesTeaser from "@/components/sections/CaseStudiesTeaser";
import Packages from "@/components/sections/Packages";
import StudentsTeaser from "@/components/sections/StudentsTeaser";
import PassiveProducts from "@/components/sections/PassiveProducts";
import Projects from "@/components/sections/Projects";
import Guarantee from "@/components/sections/Guarantee";
import LeadMagnet from "@/components/sections/LeadMagnet";
import Testimonials from "@/components/sections/Testimonials";
import BookCall from "@/components/sections/BookCall";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

/**
 * Premium conversion homepage — trust → proof → packages → students → products → hire paths.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
        <ResultsProof />
        <CaseStudiesTeaser />
        <Packages />
        <StudentsTeaser />
        <PassiveProducts />
        <Projects />
        <Guarantee />
        <LeadMagnet />
        <Testimonials />
        <BookCall />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
