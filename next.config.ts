import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// R2 CDN (video/poster assets), Supabase (REST + Realtime), and Spline (the
// About section's 3D scene) are the only external origins the client
// actually talks to — confirmed by grepping for supabase.co / r2.dev /
// spline.design usage and the preconnects already in src/app/layout.tsx.
// No nonce-based strict script-src: that requires every page to opt into
// dynamic rendering (disables static generation/ISR for the whole site,
// per Next's own CSP guide), which is a bigger architectural change than
// "add missing headers" — 'unsafe-inline' is the documented non-nonce
// fallback and matches Next's own "Without Nonces" example.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev;
  media-src 'self' https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev;
  font-src 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://gqgzhfsqukqoweceyyhd.supabase.co wss://gqgzhfsqukqoweceyyhd.supabase.co https://prod.spline.design https://unpkg.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Baseline security headers for every route, including the public
        // marketing pages — src/proxy.ts already sets these for
        // /admin, /team, /portal, /api specifically.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy site paths still indexed by Google — map each to its closest
      // equivalent on the current site so stale search results 301 forward
      // instead of 404ing.
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/ai-video", destination: "/portfolio", permanent: true },
      { source: "/ai-video/:path*", destination: "/portfolio", permanent: true },
      { source: "/graphic-design", destination: "/services", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
