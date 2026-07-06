import "@/website/components/nav.css";
import DotBackground from "@/website/components/DotBackground";
import SmoothScrollProvider from "@/website/components/SmoothScrollProvider";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DotBackground />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </>
  );
}
