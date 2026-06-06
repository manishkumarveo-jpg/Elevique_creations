import DotBackground from "@/components/DotBackground";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DotBackground />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </>
  );
}
