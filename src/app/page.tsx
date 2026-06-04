import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ClientsMap from "@/components/ClientsMap";
import TestimonialsEditorial from "@/components/ui/editorial-testimonial";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
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
    </main>
  );
}
