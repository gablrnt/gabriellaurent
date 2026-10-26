/**
 * Logique de commande : lignes de panier, calcul des totaux et des frais de
 * livraison, récapitulatif envoyé à la boutique.
 * Les prix sont toujours recalculés à partir de data/produits.ts.
 */
import { KIT_ECHANTILLONS, PROFILS_NEZ, UNITES, type ProfilNez, type Unite } from "@/data/produits";
import {
  MESSAGE_DEVIS,
  MESSAGE_FRAIS_A_CONFIRMER,
  MODES,
  MODES_COMMANDE,
  MODES_ECHANTILLONS,
  TARIFS,
  TARIFS_COLIS_ECHANTILLONS,
  ZONES,
  type ModeLivraison,
  type ZoneLivraison,
} from "@/data/livraison";
import { getProduit } from "@/lib/catalogue";
import { arrondiCentime, formatNombre, formatPrix } from "@/lib/format";

/* ---------- Lignes de panier (ce qui est stocké dans le navigateur) ---------- */

export type LignePanierProduit = {
  type: "produit";
  id: string;
  slug: string;
  quantite: number;
  profilNez?: ProfilNez;
};

export type LignePanierEchantillons = {
  type: "echantillons";
  id: string;
  pierres: string[];
  quantite: number;
};

export type LignePanier = LignePanierProduit | LignePanierEchantillons;

export const QUANTITE_MAX = 9999;

export function idLigneProduit(slug: string, profilNez?: ProfilNez): string {
  return profilNez ? `${slug}__${profilNez}` : slug;
}

export function idLigneEchantillons(pierres: string[]): string {
  return `echantillons__${[...pierres].sort().join("+")}`;
}

/** Vérifie et nettoie une ligne venue du navigateur (localStorage ou requête API) */
export function nettoyerLigne(brute: unknown): LignePanier | null {
  if (!brute || typeof brute !== "object") return null;
  const l = brute as Record<string, unknown>;
  const quantite = Math.floor(Number(l.quantite));
  if (!Number.isFinite(quantite) || quantite < 1 || quantite > QUANTITE_MAX) return null;

  if (l.type === "produit" && typeof l.slug === "string") {
    const produit = getProduit(l.slug);
    if (!produit) return null;
    const profil =
      typeof l.profilNez === "string" && l.profilNez in PROFILS_NEZ ? (l.profilNez as ProfilNez) : undefined;
    if (produit.profilNezObligatoire && !profil) return null;
    return {
      type: "produit",
      id: idLigneProduit(produit.slug, produit.profilNezObligatoire ? profil : undefined),
      slug: produit.slug,
      quantite,
      ...(produit.profilNezObligatoire && profil ? { profilNez: profil } : {}),
    };
  }

  if (l.type === "echantillons" && Array.isArray(l.pierres)) {
    const pierres = l.pierres.filter((s): s is string => {
      if (typeof s !== "string") return false;
      const produit = getProduit(s);
      return produit !== undefined && produit.categorie !== "entretien";
    });
    const distinctes = new Set(pierres).size;
    if (pierres.length !== KIT_ECHANTILLONS.nombre || distinctes !== KIT_ECHANTILLONS.nombre) return null;
    return { type: "echantillons", id: idLigneEchantillons(pierres), pierres, quantite };
  }

  return null;
}

export function nettoyerLignes(brutes: unknown): LignePanier[] {
  if (!Array.isArray(brutes)) return [];
  const resultat: LignePanier[] = [];
  for (const brute of brutes) {
    const ligne = nettoyerLigne(brute);
    if (!ligne) continue;
    const existante = resultat.find((l) => l.id === ligne.id);
    if (existante) existante.quantite = Math.min(QUANTITE_MAX, existante.quantite + ligne.quantite);
    else resultat.push(ligne);
  }
  return resultat;
}

/* ---------- Lignes résolues (avec prix, nom, image) ---------- */

export type LigneResolue = {
  id: string;
  type: LignePanier["type"];
  slug?: string;
  nom: string;
  details: string[];
  image: { url: string; alt: string } | null;
  href: string;
  unite: Unite | "kit";
  libelleUnite: string;
  prixUnitaire: number;
  prixProvisoire: boolean;
  quantite: number;
  total: number;
  /** Poids de la ligne en kg, null si inconnu */
  poidsKg: number | null;
};

export type PanierResolu = {
  lignes: LigneResolue[];
  sousTotal: number;
  /** Poids total des produits livrés en camion, null si au moins un poids est inconnu */
  poidsTotalKg: number | null;
  /** true si le panier ne contient que des kits d'échantillons */
  uniquementEchantillons: boolean;
  nombreArticles: number;
};

export function resoudrePanier(lignes: LignePanier[]): PanierResolu {
  const resolues: LigneResolue[] = [];
  let poidsConnu = true;
  let poidsTotal = 0;

  for (const ligne of lignes) {
    if (ligne.type === "produit") {
      const produit = getProduit(ligne.slug);
      if (!produit) continue;
      const poidsKg = produit.poidsKgParUnite === null ? null : produit.poidsKgParUnite * ligne.quantite;
      if (poidsKg === null) poidsConnu = false;
      else poidsTotal += poidsKg;
      resolues.push({
        id: ligne.id,
        type: "produit",
        slug: produit.slug,
        nom: produit.nom,
        details: ligne.profilNez ? [`Profil de nez ${ligne.profilNez} — ${PROFILS_NEZ[ligne.profilNez].nom}`] : [],
        image: produit.images[0] ? { url: produit.images[0].url, alt: produit.images[0].alt } : null,
        href: `/produit/${produit.slug}`,
        unite: produit.unite,
        libelleUnite: UNITES[produit.unite].quantite,
        prixUnitaire: produit.prix,
        prixProvisoire: produit.prixProvisoire,
        quantite: ligne.quantite,
        total: arrondiCentime(produit.prix * ligne.quantite),
        poidsKg,
      });
    } else {
      const noms = ligne.pierres.map((slug) => getProduit(slug)?.nom).filter(Boolean) as string[];
      resolues.push({
        id: ligne.id,
        type: "echantillons",
        nom: KIT_ECHANTILLONS.nom,
        details: noms,
        image: { url: KIT_ECHANTILLONS.image, alt: "Échantillons de pierre naturelle" },
        href: "/echantillons",
        unite: "kit",
        libelleUnite: "kit(s)",
        prixUnitaire: KIT_ECHANTILLONS.prix,
        prixProvisoire: false,
        quantite: ligne.quantite,
        total: arrondiCentime(KIT_ECHANTILLONS.prix * ligne.quantite),
        // Les échantillons voyagent par colis : ils n'entrent pas dans le poids camion.
        poidsKg: 0,
      });
    }
  }

  const contientProduits = resolues.some((l) => l.type === "produit");
  return {
    lignes: resolues,
    sousTotal: arrondiCentime(resolues.reduce((somme, l) => somme + l.total, 0)),
    poidsTotalKg: contientProduits ? (poidsConnu ? poidsTotal : null) : 0,
    uniquementEchantillons: resolues.length > 0 && !contientProduits,
    nombreArticles: resolues.length,
  };
}

/* ---------- Frais de livraison ---------- */

export type FraisLivraison =
  | { statut: "calcule"; montant: number; libelle: string }
  | { statut: "a-confirmer"; montant: null; libelle: string }
  | { statut: "devis"; montant: null; libelle: string };

export function modesDisponibles(panier: PanierResolu): ModeLivraison[] {
  return panier.uniquementEchantillons ? MODES_ECHANTILLONS : MODES_COMMANDE;
}

export function calculerFraisLivraison(panier: PanierResolu, zone: ZoneLivraison, mode: ModeLivraison): FraisLivraison {
  if (mode === "retrait") return { statut: "calcule", montant: 0, libelle: "Gratuit" };
  if (ZONES[zone].surDevis) return { statut: "devis", montant: null, libelle: MESSAGE_DEVIS };

  const zoneTarifee = zone as Exclude<ZoneLivraison, "europe">;

  if (mode === "colis") {
    const montant = TARIFS_COLIS_ECHANTILLONS[zoneTarifee];
    return { statut: "calcule", montant, libelle: montant === 0 ? "Inclus" : "" };
  }

  if (panier.poidsTotalKg === null) {
    return { statut: "a-confirmer", montant: null, libelle: MESSAGE_FRAIS_A_CONFIRMER };
  }

  const tranche = TARIFS[mode][zoneTarifee].find((t) => panier.poidsTotalKg! <= t.jusquaKg);
  if (!tranche) return { statut: "a-confirmer", montant: null, libelle: MESSAGE_FRAIS_A_CONFIRMER };
  return { statut: "calcule", montant: tranche.prix, libelle: "" };
}

export function libelleMode(mode: ModeLivraison): string {
  return MODES[mode].label;
}

/* ---------- Récapitulatif texte (formulaire de commande) ---------- */

export type InfosCommande = {
  reference: string;
  coordonnees: { prenom: string; nom: string; email: string; telephone: string };
  adresse: { adresse: string; complement: string; codePostal: string; ville: string; zone: ZoneLivraison; pays: string };
  mode: ModeLivraison;
  message: string;
};

export function libelleFraisTexte(frais: FraisLivraison): string {
  return frais.montant === null ? frais.libelle : formatPrix(frais.montant);
}

/** Liste des articles, une ligne par article, pour l'e-mail reçu par la boutique */
export function resumeArticles(panier: PanierResolu): string {
  return panier.lignes
    .map((l) => {
      const details = l.details.length > 0 ? `\n    ${l.details.join("\n    ")}` : "";
      const provisoire = l.prixProvisoire ? " (prix indicatif)" : "";
      return `- ${l.nom} : ${formatNombre(l.quantite)} ${l.libelleUnite} × ${formatPrix(l.prixUnitaire)} = ${formatPrix(l.total)}${provisoire}${details}`;
    })
    .join("\n");
}

/** Récapitulatif complet de la commande */
export function resumeCommande(infos: InfosCommande, panier: PanierResolu, frais: FraisLivraison): string {
  const { coordonnees: c, adresse: a } = infos;
  const total = panier.sousTotal + (frais.montant ?? 0);
  const poids =
    panier.poidsTotalKg === null
      ? "inconnu (au moins un poids non renseigné)"
      : `${formatNombre(panier.poidsTotalKg)} kg`;
  return [
    `Référence : ${infos.reference}`,
    "",
    "CLIENT",
    `${c.prenom} ${c.nom} — ${c.email} — ${c.telephone}`,
    "",
    "ADRESSE DE LIVRAISON",
    a.adresse,
    ...(a.complement ? [a.complement] : []),
    `${a.codePostal} ${a.ville}`,
    `${ZONES[a.zone].label}${a.zone === "europe" ? ` — ${a.pays}` : ""}`,
    "",
    "ARTICLES",
    resumeArticles(panier),
    "",
    `Sous-total TTC : ${formatPrix(panier.sousTotal)}`,
    `Mode de livraison : ${MODES[infos.mode].label}`,
    `Frais de livraison : ${libelleFraisTexte(frais)}`,
    `Total TTC${frais.montant === null ? " (hors livraison)" : ""} : ${formatPrix(total)}`,
    `Poids estimé : ${poids}`,
    ...(infos.message ? ["", "PRÉCISIONS DU CLIENT", infos.message] : []),
  ].join("\n");
}

/** Référence courte de commande, ex. AS-261026-K4P2 */
export function nouvelleReference(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const aleatoire = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AS-${date}-${aleatoire}`;
}
