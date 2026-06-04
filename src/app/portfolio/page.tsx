import Navbar from "@/components/Navbar";
import FeaturedShowcase from "@/components/FeaturedShowcase";

export const metadata = {
  title: "Portfolio | Elevique",
  description: "Explore our AI visual projects and case studies.",
};

export default function PortfolioPage() {
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <Navbar />
      <FeaturedShowcase />
    </main>
  );
}
