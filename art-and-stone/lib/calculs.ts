import { MARGE_COUPE, type Produit } from "@/data/produits";

/** La marge de coupe ne s'applique qu'aux produits vendus au m² ou au mètre linéaire */
export function margeApplicable(produit: Produit): boolean {
  return produit.unite === "m2" || produit.unite === "ml";
}

/**
 * Quantité à commander à partir de la saisie du client,
 * marge de coupe comprise, arrondie à l'unité supérieure.
 */
export function quantiteACommander(saisie: number, avecMarge: boolean): number {
  if (!Number.isFinite(saisie) || saisie <= 0) return 0;
  const brute = avecMarge ? saisie * (1 + MARGE_COUPE) : saisie;
  // Arrondi à 6 décimales avant le plafond : évite 10 × 1,1 = 11,000000000000002 → 12
  return Math.ceil(Math.round(brute * 1e6) / 1e6);
}

/** Nombre de bidons nécessaires pour une surface, arrondi au supérieur */
export function nombreBidons(surfaceM2: number, produit: Produit): number {
  if (!produit.entretien || !Number.isFinite(surfaceM2) || surfaceM2 <= 0) return 0;
  const couvertureParBidon = produit.entretien.contenanceL * produit.entretien.rendementM2ParL;
  return Math.ceil(Math.round((surfaceM2 / couvertureParBidon) * 1e6) / 1e6);
}

/** Surface couverte par un bidon (contenance × rendement) */
export function surfaceParBidon(produit: Produit): number | null {
  if (!produit.entretien) return null;
  return produit.entretien.contenanceL * produit.entretien.rendementM2ParL;
}

/** Lecture tolérante d'une saisie (« 12,5 » ou « 12.5 ») */
export function lireNombre(saisie: string): number {
  const valeur = Number.parseFloat(saisie.replace(",", ".").replace(/\s/g, ""));
  return Number.isFinite(valeur) ? valeur : 0;
}
