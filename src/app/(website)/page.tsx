import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/website/components/Navbar";
import HeroSection from "@/website/components/HeroSection";
import FeaturedShowcase from "@/website/components/FeaturedShowcase";
import ServicesSection from "@/website/components/ServicesSection";
import { ScrollReveal } from "@/website/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Elevique | Creative AI Visuals Studio",
  description:
    "Elevique is a premium AI visual production studio in India crafting cinematic brand films, AI video ads, and social content for ambitious brands.",
};

// Below-fold sections loaded only when needed — keeps the initial JS bundle small
const ProcessSection = dynamic(() => import("@/website/components/ProcessSection"));
const TestimonialsEditorial = dynamic(() => import("@/website/components/ui/editorial-testimonial"));

const ContactSection = dynamic(() => import("@/website/components/ContactSection"));
const Footer = dynamic(() => import("@/website/components/ui/footer-section").then(m => ({ default: m.Footer })));

const Demo = dynamic(() => import("@/website/components/ui/demo").then(m => ({ default: m.Demo })));

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
        <ScrollReveal direction="up" amount={0.15}>
          <TestimonialsEditorial />
        </ScrollReveal>
      </section>



      <ContactSection />
      <Footer />
    </main>
  );
}
