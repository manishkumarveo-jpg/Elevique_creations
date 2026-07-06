import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/portal",
        "/team",
        "/api",
        "/login",
        "/reset-password",
        "/setup",
        "/unauthorized",
        "/auth",
      ],
    },
    sitemap: "https://elevique.in/sitemap.xml",
  };
}
