import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import ClientsMap from "@/components/ClientsMap";
import TestimonialsEditorial from "@/components/ui/editorial-testimonial";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";


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
