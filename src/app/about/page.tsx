import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "About | Elevique",
  description: "Learn the story behind Elevique — a premium AI visual production studio built for the era of artificial intelligence.",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "calc(24px + 60px + 16px)" }}>
      <Navbar />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
