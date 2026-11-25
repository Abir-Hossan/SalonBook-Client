import type { NextConfig } from "next";

const configuredApi = process.env.SALONBOOK_API_URL || process.env.NEXT_PUBLIC_API_URL;
const catalogueApi = (configuredApi || "http://127.0.0.1:5000/api").replace(/\/$/, "");

if (process.env.NODE_ENV === "production") {
  const target = new URL(catalogueApi);
  if (!configuredApi || target.protocol !== "https:" || target.pathname !== "/api" || target.search || target.hash ||
      target.username || target.password || /^(localhost|127\.|0\.|\[)/i.test(target.hostname)) {
    throw new Error("Set SALONBOOK_API_URL to the public HTTPS Express /api URL before building for production.");
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/better-auth/:path*", destination: `${catalogueApi}/better-auth/:path*` },
      { source: "/salon-api/:path*", destination: `${catalogueApi}/:path*` },
      { source: "/catalogue-api/services", destination: `${catalogueApi}/services` },
      { source: "/catalogue-api/services/categories", destination: `${catalogueApi}/services/categories` },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "i.ibb.co" }],
  },
};

export default nextConfig;
