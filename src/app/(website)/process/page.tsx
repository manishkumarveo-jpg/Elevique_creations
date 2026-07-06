import Navbar from "@/website/components/Navbar";
import ProcessSection from "@/website/components/ProcessSection";
import ContactSection from "@/website/components/ContactSection";
import { Footer } from "@/website/components/ui/footer-section";

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
