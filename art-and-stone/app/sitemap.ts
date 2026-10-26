import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUITS } from "@/data/produits";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { chemin: string; priorite: number }[] = [
    { chemin: "", priorite: 1 },
    { chemin: "/pierres", priorite: 0.9 },
    ...Object.keys(CATEGORIES).map((c) => ({ chemin: `/${c}`, priorite: 0.9 })),
    { chemin: "/echantillons", priorite: 0.8 },
    { chemin: "/realisations", priorite: 0.6 },
    { chemin: "/conseils", priorite: 0.6 },
    { chemin: "/a-propos", priorite: 0.5 },
    { chemin: "/contact", priorite: 0.5 },
    { chemin: "/livraison-retours", priorite: 0.4 },
    { chemin: "/cgv", priorite: 0.2 },
    { chemin: "/mentions-legales", priorite: 0.1 },
    { chemin: "/confidentialite", priorite: 0.1 },
  ];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p.chemin}`, priority: p.priorite })),
    ...PRODUITS.map((p) => ({
      url: `${SITE.url}/produit/${p.slug}`,
      priority: 0.8,
      images: p.images.map((i) => i.url),
    })),
  ];
}
