import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";

// Below-fold sections loaded only when needed — keeps the initial JS bundle small
const ProcessSection = dynamic(() => import("@/components/ProcessSection"));
const TestimonialsEditorial = dynamic(() => import("@/components/ui/editorial-testimonial"));
const ClientsMap = dynamic(() => import("@/components/ClientsMap"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/ui/footer-section").then(m => ({ default: m.Footer })));

export default function Home() {
  return (
    <main>
      <HeroSection />
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
      <ClientsMap />
      <ContactSection />
      <Footer />
    </main>
  );
}
