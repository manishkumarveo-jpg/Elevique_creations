import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "Contact | Elevique",
  description: "Start a project with Elevique. Get in touch with our team to discuss your AI visual production needs.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "calc(24px + 60px + 16px)" }}>
      <Navbar />
      <ContactSection />
      <Footer />
    </main>
  );
}
