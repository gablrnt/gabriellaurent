/**
 * Informations générales de la boutique.
 * Modifiez ici le téléphone, les réseaux sociaux ou les textes des bandeaux.
 */

export const SITE = {
  nom: "ART & STONE",
  sousTitre: "Pierre naturelle — vente aux particuliers",
  description:
    "Dallages, margelles et pierres de jardin en pierre naturelle, sélectionnés en carrière. Stock en Provence à Tarascon, livraison partout en France, en Corse et en Suisse.",
  telephone: "06 24 27 03 28",
  telephoneLien: "+33624270328",
  horaires: "Du lundi au samedi",
  ville: "Tarascon (13)",
  instagram: {
    compte: "@art_and_stone_",
    url: "https://www.instagram.com/art_and_stone_",
  },
  avisGoogleUrl: "https://share.google/cCIgUkBiaQZzu4HG3",
  sitePro: "https://artandstone.fr",
  /**
   * Adresse publique du site, utilisée pour le SEO (sitemap, Open Graph).
   * À défaut de NEXT_PUBLIC_SITE_URL, l'adresse fournie par Vercel ou Netlify est utilisée.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    process.env.URL ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  imagePartage: "https://artandstone.fr/images/hero_accueil.webp",
} as const;

export const BANDEAU_INFOS = ["Livraison France, Corse & Suisse", "Échantillons remboursés à la commande"] as const;

export type LienNavigation = { href: string; label: string };

export const NAVIGATION: LienNavigation[] = [
  { href: "/", label: "Accueil" },
  { href: "/sols", label: "Sols" },
  { href: "/piscine", label: "Piscine" },
  { href: "/jardin", label: "Jardin" },
  { href: "/murs", label: "Murs" },
  { href: "/entretien", label: "Entretien" },
  { href: "/echantillons", label: "Échantillons" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/conseils", label: "Conseils" },
  { href: "/contact", label: "Contact" },
];

export const LIENS_LEGAUX: LienNavigation[] = [
  { href: "/cgv", label: "Conditions générales de vente" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/livraison-retours", label: "Livraison & retours" },
];
