import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100 % statique : `npm run build` produit le dossier `out/`,
  // qui se publie tel quel sur Netlify (ou tout autre hébergeur).
  output: "export",
  // Pages en dossiers (/pierres/index.html) : adresses propres sur tous les hébergeurs.
  trailingSlash: true,
  images: {
    // Les photos viennent directement de artandstone.fr, sans redimensionnement serveur.
    unoptimized: true,
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
