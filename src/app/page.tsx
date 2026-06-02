import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Placeholder for next sections */}
      <section
        id="experience"
        style={{
          minHeight: "100vh",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        — Next Section Coming Soon —
      </section>
    </main>
  );
}
