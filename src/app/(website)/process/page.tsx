import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "Process | Elevique",
  description: "The Elevique Method — a five-stage AI production process refined across 500+ projects, from discovery to delivery.",
};

export default function ProcessPage() {
  return (
    <main className="subpage-layout">
      <Navbar />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
