import type { NextConfig } from "next";
import { serverApiTarget } from "./src/lib/api-target";

const catalogueApi = serverApiTarget();

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
