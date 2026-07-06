import Navbar from "@/website/components/Navbar";
import AboutSection from "@/website/components/AboutSection";
import { Demo as BrandsSection } from "@/website/components/ui/demo";
import TestimonialsEditorial from "@/website/components/ui/editorial-testimonial";
import ContactSection from "@/website/components/ContactSection";
import { Footer } from "@/website/components/ui/footer-section";
import { ScrollReveal } from "@/website/components/ScrollReveal";

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
