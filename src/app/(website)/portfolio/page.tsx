import Navbar from "@/components/Navbar";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "Portfolio | Elevique",
  description: "Explore our AI visual projects and case studies.",
};

export default function PortfolioPage() {
  return (
    <main>
      <Navbar />
      <FeaturedShowcase />
      <ContactSection />
      <Footer />
    </main>
  );
}
