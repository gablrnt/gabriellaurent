/**
 * RÉALISATIONS — photos de chantiers réels.
 * Ajoutez une entrée pour chaque nouveau chantier.
 * `produits` : slugs des produits utilisés (voir data/produits.ts), pour créer les liens.
 */

export type Realisation = {
  slug: string;
  titre: string;
  lieu?: string;
  description: string;
  image: { url: string; alt: string };
  produits: string[];
};

export const REALISATIONS: Realisation[] = [
  {
    slug: "villa-saint-tropez",
    titre: "Villa à Saint-Tropez",
    lieu: "Saint-Tropez (83)",
    description: "Dallage et margelles Aurelia Greige Sablée Brossée autour de la piscine.",
    image: {
      url: "https://artandstone.fr/images/villa_saint_tropez_piscine_aurelia_beige_1.webp",
      alt: "Piscine d'une villa à Saint-Tropez bordée de margelles et d'un dallage Aurelia Greige Sablée Brossée",
    },
    produits: ["dallage-aurelia-greige-sablee-brossee", "margelle-aurelia-greige-sablee-brossee"],
  },
  {
    slug: "entree-villa-provencale",
    titre: "Entrée de villa provençale",
    description: "Dallage Aurelia Greige associé à des barrettes posées en chevrons.",
    image: {
      url: "https://artandstone.fr/images/realisation_entree_aurelia_beige_barrette.webp",
      alt: "Entrée de villa provençale en dallage Aurelia Greige avec barrettes posées en chevrons",
    },
    produits: ["dallage-barrette-aurelia-greige"],
  },
  {
    slug: "opus-incertum-interieur-terrasse",
    titre: "Opus incertum, de l'intérieur à la terrasse",
    description:
      "Aurelia Greige Opus Incertum brossé posé en continu entre l'intérieur et la terrasse.",
    image: {
      url: "https://artandstone.fr/images/realisation_aurelia_greige_opus_incertum_brosse_interieur.webp",
      alt: "Sol intérieur en dallage Aurelia Greige Opus Incertum brossé",
    },
    produits: ["dallage-opus-incertum-aurelia-greige-brosse"],
  },
  {
    slug: "allee-ramatuelle",
    titre: "Allée à Ramatuelle",
    lieu: "Ramatuelle (83)",
    description: "Allée en pavé granit beigéo, finition sablée.",
    image: {
      url: "https://artandstone.fr/images/pave_granit_beigeo_finition_sablee_1.webp",
      alt: "Allée à Ramatuelle en pavés de granit beigéo, finition sablée",
    },
    produits: [],
  },
];
