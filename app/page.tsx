import Hero from "@/components/hero/Hero";
import Stats from "@/components/sections/Stats";
import ClientLogos from "@/components/sections/ClientLogos";
import Services from "@/components/sections/Services";
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
      <main className="pt-16">
        <Hero />
        <Stats />
        <ClientLogos />
        <Services />
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
