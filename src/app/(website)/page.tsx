import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import ServicesSection from "@/components/ServicesSection";

// Below-fold sections loaded only when needed — keeps the initial JS bundle small
const ProcessSection = dynamic(() => import("@/components/ProcessSection"));
const TestimonialsEditorial = dynamic(() => import("@/components/ui/editorial-testimonial"));

const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/ui/footer-section").then(m => ({ default: m.Footer })));

const Demo = dynamic(() => import("@/components/ui/demo").then(m => ({ default: m.Demo })));

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Demo />
      <ServicesSection />
      <ProcessSection />
      <section
        id="testimonials"
        className="relative w-full border-t border-b"
        style={{
          background: "var(--black)",
          borderColor: "var(--glass-border)",
        }}
      >
        <TestimonialsEditorial />
      </section>



      <ContactSection />
      <Footer />
    </main>
  );
}
