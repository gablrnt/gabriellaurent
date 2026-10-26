/**
 * Validation des formulaires, utilisée à la fois dans le navigateur
 * (messages immédiats) et dans les routes API (sécurité).
 */
import type { ModeLivraison, ZoneLivraison } from "@/data/livraison";
import { MODES, ZONES } from "@/data/livraison";

export type Erreurs<T extends string = string> = Partial<Record<T, string>>;

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function texte(valeur: unknown, max = 500): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

export function emailValide(email: string): boolean {
  return RE_EMAIL.test(email) && email.length <= 254;
}

export function telephoneValide(telephone: string): boolean {
  if (!/^[+\d\s().-]+$/.test(telephone)) return false;
  const chiffres = telephone.replace(/\D/g, "");
  return chiffres.length >= 9 && chiffres.length <= 15;
}

/* ---------- Contact ---------- */

export const SUJETS_CONTACT = {
  produit: "Question sur un produit",
  echantillons: "Échantillons",
  livraison: "Livraison",
  autre: "Autre",
} as const;

export type SujetContact = keyof typeof SUJETS_CONTACT;

export type DonneesContact = {
  nom: string;
  email: string;
  telephone: string;
  sujet: SujetContact | "";
  message: string;
};

export function validerContact(d: DonneesContact): Erreurs<keyof DonneesContact> {
  const erreurs: Erreurs<keyof DonneesContact> = {};
  if (d.nom.length < 2) erreurs.nom = "Indiquez votre nom.";
  if (!emailValide(d.email)) erreurs.email = "Indiquez une adresse e-mail valide (ex. : nom@exemple.fr).";
  if (d.telephone && !telephoneValide(d.telephone))
    erreurs.telephone = "Ce numéro ne semble pas valide (ex. : 06 12 34 56 78).";
  if (!(d.sujet in SUJETS_CONTACT)) erreurs.sujet = "Choisissez un sujet.";
  if (d.message.length < 10) erreurs.message = "Votre message doit contenir au moins 10 caractères.";
  return erreurs;
}

/* ---------- Commande ---------- */

export type Coordonnees = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
};

export type AdresseLivraison = {
  adresse: string;
  complement: string;
  codePostal: string;
  ville: string;
  zone: ZoneLivraison | "";
  pays: string;
};

export function validerCoordonnees(c: Coordonnees): Erreurs<keyof Coordonnees> {
  const erreurs: Erreurs<keyof Coordonnees> = {};
  if (c.prenom.length < 1) erreurs.prenom = "Indiquez votre prénom.";
  if (c.nom.length < 1) erreurs.nom = "Indiquez votre nom.";
  if (!emailValide(c.email)) erreurs.email = "Indiquez une adresse e-mail valide (ex. : nom@exemple.fr).";
  if (!telephoneValide(c.telephone))
    erreurs.telephone = "Indiquez un numéro de téléphone valide : le transporteur vous appelle avant de livrer.";
  return erreurs;
}

export function validerAdresse(a: AdresseLivraison): Erreurs<keyof AdresseLivraison> {
  const erreurs: Erreurs<keyof AdresseLivraison> = {};
  if (a.adresse.length < 4) erreurs.adresse = "Indiquez le numéro et la rue.";
  if (a.ville.length < 2) erreurs.ville = "Indiquez la ville.";
  if (!(a.zone in ZONES)) {
    erreurs.zone = "Choisissez votre zone de livraison.";
    return erreurs;
  }
  const cp = a.codePostal.replace(/\s/g, "");
  if (a.zone === "france") {
    if (!/^\d{5}$/.test(cp)) erreurs.codePostal = "Le code postal doit contenir 5 chiffres.";
    else if (cp.startsWith("20")) erreurs.codePostal = "Ce code postal est en Corse : choisissez la zone « Corse ».";
  } else if (a.zone === "corse") {
    if (!/^20\d{3}$/.test(cp)) erreurs.codePostal = "Un code postal corse commence par 20 (ex. : 20000).";
  } else if (a.zone === "suisse") {
    if (!/^\d{4}$/.test(cp)) erreurs.codePostal = "Le code postal suisse contient 4 chiffres.";
  } else {
    if (cp.length < 2 || cp.length > 10) erreurs.codePostal = "Indiquez le code postal.";
    if (a.pays.length < 2) erreurs.pays = "Indiquez le pays de livraison.";
  }
  return erreurs;
}

export function modeValide(mode: string): mode is ModeLivraison {
  return mode in MODES;
}

export function aucuneErreur(erreurs: Erreurs): boolean {
  return Object.keys(erreurs).length === 0;
}
