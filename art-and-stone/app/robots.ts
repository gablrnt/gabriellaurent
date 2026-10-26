import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

// Fichier généré une fois au build (site statique).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/commande/", "/panier/", "/__forms.html"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
