import {
  CATEGORIES,
  FINITIONS,
  PRODUITS,
  TEINTES,
  USAGES,
  type Categorie,
  type Finition,
  type Produit,
  type Teinte,
  type Usage,
} from "@/data/produits";

export function getProduit(slug: string): Produit | undefined {
  return PRODUITS.find((p) => p.slug === slug);
}

export function produitsDeCategorie(categorie: Categorie): Produit[] {
  return PRODUITS.filter((p) => p.categorie === categorie);
}

/** Toutes les pierres (hors produits d'entretien) */
export function pierres(): Produit[] {
  return PRODUITS.filter((p) => p.categorie !== "entretien");
}

export function bestSellers(): Produit[] {
  return PRODUITS.filter((p) => p.bestSeller);
}

export function estCategorie(valeur: string): valeur is Categorie {
  return valeur in CATEGORIES;
}

/** true tant qu'au moins un produit a un prix provisoire (bandeau « prix indicatifs ») */
export const PRIX_INDICATIFS = PRODUITS.some((p) => p.prixProvisoire);

/* ---------- Filtres du catalogue ---------- */

export type Filtres = {
  usage: Usage[];
  teinte: Teinte[];
  finition: Finition[];
};

export const FILTRES_VIDES: Filtres = { usage: [], teinte: [], finition: [] };

const VALEURS = {
  usage: Object.keys(USAGES) as Usage[],
  teinte: Object.keys(TEINTES) as Teinte[],
  finition: Object.keys(FINITIONS) as Finition[],
};

/** Lit les filtres depuis l'URL (?usage=interieur,terrasse&teinte=greige) en ignorant les valeurs inconnues */
export function lireFiltres(params: { get(nom: string): string | null }): Filtres {
  const lire = <T extends string>(nom: keyof Filtres, valides: T[]): T[] =>
    (params.get(nom) ?? "")
      .split(",")
      .filter((v): v is T => (valides as string[]).includes(v));
  return {
    usage: lire("usage", VALEURS.usage),
    teinte: lire("teinte", VALEURS.teinte),
    finition: lire("finition", VALEURS.finition),
  };
}

/** Filtres combinables : « ou » à l'intérieur d'un groupe, « et » entre les groupes */
export function filtrerProduits(produits: Produit[], filtres: Filtres): Produit[] {
  return produits.filter(
    (p) =>
      (filtres.usage.length === 0 || filtres.usage.some((u) => p.usages.includes(u))) &&
      (filtres.teinte.length === 0 || (p.teinte !== null && filtres.teinte.includes(p.teinte))) &&
      (filtres.finition.length === 0 ||
        (p.finition !== null && filtres.finition.includes(p.finition))),
  );
}

/** Options de filtre réellement présentes dans une liste de produits (pour ne pas proposer de filtre vide) */
export function optionsDisponibles(produits: Produit[]): Filtres {
  return {
    usage: VALEURS.usage.filter((u) => produits.some((p) => p.usages.includes(u))),
    teinte: VALEURS.teinte.filter((t) => produits.some((p) => p.teinte === t)),
    finition: VALEURS.finition.filter((f) => produits.some((p) => p.finition === f)),
  };
}
