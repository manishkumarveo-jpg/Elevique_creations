import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import { Demo as BrandsSection } from "@/components/ui/demo";
import TestimonialsEditorial from "@/components/ui/editorial-testimonial";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata = {
  title: "About | Elevique",
  description: "Learn the story behind Elevique — a premium AI visual production studio built for the era of artificial intelligence.",
};

export default function AboutPage() {
  return (
    <main className="subpage-layout">
      <Navbar />
      <AboutSection />
      <BrandsSection />
      <ScrollReveal direction="up" amount={0.15}>
        <TestimonialsEditorial />
      </ScrollReveal>
      <ContactSection />
      <Footer />
    </main>
  );
}
