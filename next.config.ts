import type { NextConfig } from "next";

const catalogueApi = (process.env.SALONBOOK_API_URL || process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000/api").replace(/\/$/, "");

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
