import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "Services | Elevique",
  description: "Explore our AI visual production services — from cinematic brand films to social content and motion graphics.",
};

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: "calc(24px + 60px + 16px)" }}>
      <Navbar />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
