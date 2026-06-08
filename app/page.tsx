import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Founder from "@/components/sections/Founder";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <main className="pt-16">
        <Hero />
        <Services />
        <Projects />
        <Founder />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
