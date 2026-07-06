import Navbar from "@/website/components/Navbar";
import FeaturedShowcase from "@/website/components/FeaturedShowcase";
import ContactSection from "@/website/components/ContactSection";
import { Footer } from "@/website/components/ui/footer-section";

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
