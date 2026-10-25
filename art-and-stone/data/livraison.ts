/**
 * ============================================================
 *  LIVRAISON — zones, modes et tarifs
 * ============================================================
 *
 * ⚠️ TOUS LES TARIFS CI-DESSOUS SONT PROVISOIRES (valeurs d'exemple).
 *    Remplacez-les par vos vrais tarifs transporteur avant la mise en ligne.
 *
 * Fonctionnement :
 * - Les frais sont calculés à partir du poids total de la commande.
 * - Tant qu'un produit du panier n'a pas de poids renseigné
 *   (`poidsKgParUnite: null` dans data/produits.ts), le site affiche
 *   « Frais de livraison confirmés sous 24 h » au lieu d'un montant.
 * - Au-delà de la dernière tranche de poids, même message.
 * - Autres pays européens : « Devis de livraison sous 24 h ».
 */

export type ZoneLivraison = "france" | "corse" | "suisse" | "europe";
export type ModeLivraison = "hayon" | "grue" | "retrait" | "colis";

export const ZONES: Record<ZoneLivraison, { label: string; surDevis: boolean }> = {
  france: { label: "France continentale", surDevis: false },
  corse: { label: "Corse", surDevis: false },
  suisse: { label: "Suisse", surDevis: false },
  europe: { label: "Autre pays européen", surDevis: true },
};

export const MODES: Record<ModeLivraison, { label: string; description: string }> = {
  hayon: {
    label: "Livraison camion avec hayon",
    description:
      "Les palettes sont descendues avec le hayon et déposées au pied du camion. Prévoyez de quoi les déplacer ensuite.",
  },
  grue: {
    label: "Livraison camion grue",
    description: "La grue du camion dépose les palettes chez vous, au plus près du chantier, selon l'accès.",
  },
  retrait: {
    label: "Retrait gratuit au stock de Tarascon",
    description:
      "Venez chercher votre commande à notre stock de Tarascon (13). Nous vous appelons pour convenir d'un créneau.",
  },
  colis: {
    label: "Envoi des échantillons par colis",
    description: "Vos échantillons sont envoyés par colis à l'adresse indiquée.",
  },
};

/** Modes proposés quand le panier contient des pierres ou des produits d'entretien */
export const MODES_COMMANDE: ModeLivraison[] = ["hayon", "grue", "retrait"];
/** Modes proposés quand le panier ne contient que des kits d'échantillons */
export const MODES_ECHANTILLONS: ModeLivraison[] = ["colis", "retrait"];

export type TranchePoids = {
  /** Poids maximum de la tranche, en kg (inclus) */
  jusquaKg: number;
  /** Frais de livraison TTC, en euros */
  prix: number;
};

type ZoneTarifee = Exclude<ZoneLivraison, "europe">;

/**
 * Grille de tarifs par mode, zone et tranche de poids.
 * ⚠️ VALEURS PROVISOIRES — À REMPLACER PAR LES TARIFS RÉELS.
 */
export const TARIFS: Record<"hayon" | "grue", Record<ZoneTarifee, TranchePoids[]>> = {
  hayon: {
    // PROVISOIRE
    france: [
      { jusquaKg: 500, prix: 120 },
      { jusquaKg: 1000, prix: 180 },
      { jusquaKg: 2000, prix: 260 },
      { jusquaKg: 5000, prix: 420 },
    ],
    // PROVISOIRE
    corse: [
      { jusquaKg: 500, prix: 220 },
      { jusquaKg: 1000, prix: 320 },
      { jusquaKg: 2000, prix: 480 },
      { jusquaKg: 5000, prix: 780 },
    ],
    // PROVISOIRE
    suisse: [
      { jusquaKg: 500, prix: 240 },
      { jusquaKg: 1000, prix: 340 },
      { jusquaKg: 2000, prix: 500 },
      { jusquaKg: 5000, prix: 800 },
    ],
  },
  grue: {
    // PROVISOIRE
    france: [
      { jusquaKg: 1000, prix: 280 },
      { jusquaKg: 2000, prix: 360 },
      { jusquaKg: 5000, prix: 520 },
      { jusquaKg: 10000, prix: 780 },
    ],
    // PROVISOIRE
    corse: [
      { jusquaKg: 1000, prix: 450 },
      { jusquaKg: 2000, prix: 600 },
      { jusquaKg: 5000, prix: 900 },
      { jusquaKg: 10000, prix: 1300 },
    ],
    // PROVISOIRE
    suisse: [
      { jusquaKg: 1000, prix: 480 },
      { jusquaKg: 2000, prix: 640 },
      { jusquaKg: 5000, prix: 950 },
      { jusquaKg: 10000, prix: 1350 },
    ],
  },
};

/**
 * Envoi des kits d'échantillons par colis, par zone (euros TTC).
 * ⚠️ VALEURS PROVISOIRES — 0 = envoi inclus dans le prix du kit.
 */
export const TARIFS_COLIS_ECHANTILLONS: Record<ZoneTarifee, number> = {
  france: 0,
  corse: 0,
  suisse: 0,
};

export const MESSAGE_FRAIS_A_CONFIRMER = "Frais de livraison confirmés sous 24 h";
export const MESSAGE_DEVIS = "Devis de livraison sous 24 h";
