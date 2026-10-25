import "server-only";
import { MODES, ZONES, type ModeLivraison, type ZoneLivraison } from "@/data/livraison";
import {
  calculerFraisLivraison,
  modesDisponibles,
  nettoyerLignes,
  resoudrePanier,
  type FraisLivraison,
  type PanierResolu,
} from "@/lib/commande";
import { formatNombre, formatPrix } from "@/lib/format";
import {
  aucuneErreur,
  texte,
  validerAdresse,
  validerCoordonnees,
  type AdresseLivraison,
  type Coordonnees,
} from "@/lib/validation";

export type Commande = {
  reference: string;
  coordonnees: Coordonnees;
  adresse: AdresseLivraison & { zone: ZoneLivraison };
  mode: ModeLivraison;
  message: string;
  panier: PanierResolu;
  frais: FraisLivraison;
  total: number;
};

export type ResultatValidation = { ok: true; commande: Commande } | { ok: false; erreur: string; statut: number };

function nouvelleReference(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const aleatoire = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AS-${date}-${aleatoire}`;
}

/** Valide une commande envoyée par le navigateur et recalcule tous les montants côté serveur */
export function validerCommande(corps: unknown): ResultatValidation {
  if (!corps || typeof corps !== "object") return { ok: false, erreur: "Requête invalide.", statut: 400 };
  const d = corps as Record<string, unknown>;
  const c = (d.coordonnees ?? {}) as Record<string, unknown>;
  const a = (d.adresse ?? {}) as Record<string, unknown>;

  if (d.cgv !== true) {
    return { ok: false, erreur: "Vous devez accepter les conditions générales de vente.", statut: 400 };
  }

  const coordonnees: Coordonnees = {
    prenom: texte(c.prenom, 80),
    nom: texte(c.nom, 80),
    email: texte(c.email, 254),
    telephone: texte(c.telephone, 30),
  };
  const adresse: AdresseLivraison = {
    adresse: texte(a.adresse, 200),
    complement: texte(a.complement, 200),
    codePostal: texte(a.codePostal, 12),
    ville: texte(a.ville, 100),
    zone: (typeof a.zone === "string" && a.zone in ZONES ? a.zone : "") as ZoneLivraison | "",
    pays: texte(a.pays, 80),
  };
  if (!aucuneErreur(validerCoordonnees(coordonnees)) || !aucuneErreur(validerAdresse(adresse))) {
    return { ok: false, erreur: "Certaines informations sont incomplètes ou invalides.", statut: 400 };
  }

  const panier = resoudrePanier(nettoyerLignes(d.lignes));
  if (panier.lignes.length === 0) return { ok: false, erreur: "Votre panier est vide.", statut: 400 };

  const mode = d.mode as ModeLivraison;
  if (typeof d.mode !== "string" || !(d.mode in MODES) || !modesDisponibles(panier).includes(mode)) {
    return { ok: false, erreur: "Choisissez un mode de livraison.", statut: 400 };
  }

  const zone = adresse.zone as ZoneLivraison;
  const frais = calculerFraisLivraison(panier, zone, mode);
  return {
    ok: true,
    commande: {
      reference: nouvelleReference(),
      coordonnees,
      adresse: { ...adresse, zone },
      mode,
      message: texte(d.message, 1000),
      panier,
      frais,
      total: panier.sousTotal + (frais.montant ?? 0),
    },
  };
}

/** Récapitulatif texte de la commande, pour l'e-mail */
export function resumeCommande(commande: Commande, entete: string): string {
  const { coordonnees: c, adresse: a, panier, frais } = commande;
  const lignes = panier.lignes.map((l) => {
    const details = l.details.length > 0 ? `\n      ${l.details.join("\n      ")}` : "";
    const provisoire = l.prixProvisoire ? " (prix indicatif)" : "";
    return `  - ${l.nom} : ${formatNombre(l.quantite)} ${l.libelleUnite} × ${formatPrix(l.prixUnitaire)} = ${formatPrix(l.total)}${provisoire}${details}`;
  });
  const poids =
    panier.poidsTotalKg === null
      ? "inconnu (au moins un poids non renseigné)"
      : `${formatNombre(panier.poidsTotalKg)} kg`;

  return [
    entete,
    "",
    `Référence : ${commande.reference}`,
    "",
    "CLIENT",
    `  ${c.prenom} ${c.nom}`,
    `  ${c.email}`,
    `  ${c.telephone}`,
    "",
    "ADRESSE DE LIVRAISON",
    `  ${a.adresse}`,
    ...(a.complement ? [`  ${a.complement}`] : []),
    `  ${a.codePostal} ${a.ville}`,
    `  ${ZONES[a.zone].label}${a.zone === "europe" ? ` — ${a.pays}` : ""}`,
    "",
    "ARTICLES",
    ...lignes,
    "",
    `Sous-total TTC : ${formatPrix(panier.sousTotal)}`,
    `Mode de livraison : ${MODES[commande.mode].label}`,
    `Frais de livraison : ${frais.montant === null ? frais.libelle : formatPrix(frais.montant)}`,
    `Total TTC${frais.montant === null ? " (hors livraison)" : ""} : ${formatPrix(commande.total)}`,
    `Poids estimé : ${poids}`,
    ...(commande.message ? ["", "MESSAGE DU CLIENT", commande.message] : []),
  ].join("\n");
}
