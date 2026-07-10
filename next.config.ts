import type { NextConfig } from "next";

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
