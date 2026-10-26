import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les photos produits sont hébergées sur le site pro artandstone.fr.
    remotePatterns: [
      { protocol: "https", hostname: "artandstone.fr", pathname: "/images/**" },
      { protocol: "https", hostname: "www.artandstone.fr", pathname: "/images/**" },
    ],
    qualities: [75],
    // Les images changent rarement : on les garde 31 jours en cache.
    minimumCacheTTL: 2678400,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
