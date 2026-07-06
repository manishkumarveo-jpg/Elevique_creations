import Navbar from "@/website/components/Navbar";
import ContactSection from "@/website/components/ContactSection";
import { Footer } from "@/website/components/ui/footer-section";

export const metadata = {
  title: "Contact | Elevique",
  description: "Start a project with Elevique. Get in touch with our team to discuss your AI visual production needs.",
};

export default function ContactPage() {
  return (
    <main className="subpage-layout">
      <Navbar />
      <ContactSection />
      <Footer />
    </main>
  );
}
