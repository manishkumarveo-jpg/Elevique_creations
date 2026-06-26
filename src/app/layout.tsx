import type { Metadata, Viewport } from "next";
import { Inter, Syne, Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../components/nav.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elevique | Creative AI Visuals Studio",
  description: "High-end AI visuals for premium brands.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        syne.variable,
        spaceGrotesk.variable,
        geist.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <head>
        <link rel="preconnect" href="https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://gqgzhfsqukqoweceyyhd.supabase.co" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
