/**
 * AVIS CLIENTS
 *
 * N'ajoutez ici que de vrais avis, recopiés à l'identique (par exemple
 * depuis votre fiche Google), avec l'accord de leur auteur.
 * Tant que la liste est vide, la page d'accueil affiche seulement le lien
 * « Voir nos avis Google ».
 *
 * Exemple :
 * {
 *   auteur: "Prénom N.",
 *   ville: "Aix-en-Provence",
 *   note: 5,
 *   texte: "Texte de l'avis…",
 *   date: "2026-05",
 * },
 */

export type Avis = {
  auteur: string;
  ville?: string;
  /** Note sur 5 */
  note: 1 | 2 | 3 | 4 | 5;
  texte: string;
  /** Mois de l'avis, format AAAA-MM */
  date?: string;
};

export const AVIS: Avis[] = [];
