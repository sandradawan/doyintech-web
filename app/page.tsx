import Hero from "@/components/hero/Hero";
import RevenueStrip from "@/components/sections/RevenueStrip";
import Stats from "@/components/sections/Stats";
import ClientLogos from "@/components/sections/ClientLogos";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import BookCall from "@/components/sections/BookCall";
import PassiveProducts from "@/components/sections/PassiveProducts";
import LeadMagnet from "@/components/sections/LeadMagnet";
import ToolsSection from "@/components/sections/ToolsSection";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import TechStack from "@/components/sections/TechStack";
import Testimonials from "@/components/sections/Testimonials";
import Founder from "@/components/sections/Founder";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <RevenueStrip />
        <Stats />
        <ClientLogos />
        <Services />
        <Packages />
        <BookCall />
        <PassiveProducts />
        <LeadMagnet />
        <ToolsSection />
        <Process />
        <Projects />
        <TechStack />
        <Testimonials />
        <Founder />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
