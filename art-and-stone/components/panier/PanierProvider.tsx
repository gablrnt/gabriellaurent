"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ProfilNez } from "@/data/produits";
import { QUANTITE_MAX, idLigneEchantillons, idLigneProduit, nettoyerLignes, type LignePanier } from "@/lib/commande";

/**
 * Panier côté client : React context + localStorage.
 * Si localStorage est indisponible (navigation privée stricte, quota plein,
 * cookies bloqués…), le panier fonctionne quand même, en mémoire, le temps
 * de la visite.
 */

const CLE_STOCKAGE = "artandstone-panier-v1";

type EtatPanier = { lignes: LignePanier[]; pret: boolean };

const ETAT_SERVEUR: EtatPanier = { lignes: [], pret: false };
let etat: EtatPanier | null = null;
const abonnes = new Set<() => void>();

function lireStockage(): LignePanier[] {
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    return brut ? nettoyerLignes(JSON.parse(brut)) : [];
  } catch {
    return [];
  }
}

function ecrireStockage(lignes: LignePanier[]) {
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(lignes));
  } catch {
    // Stockage indisponible : le panier reste en mémoire pour cette visite.
  }
}

function getSnapshot(): EtatPanier {
  if (etat === null) etat = { lignes: lireStockage(), pret: true };
  return etat;
}

function getServerSnapshot(): EtatPanier {
  return ETAT_SERVEUR;
}

function subscribe(abonne: () => void) {
  abonnes.add(abonne);
  // Synchronisation entre onglets
  const surStockage = (e: StorageEvent) => {
    if (e.key !== CLE_STOCKAGE) return;
    etat = { lignes: lireStockage(), pret: true };
    abonnes.forEach((a) => a());
  };
  window.addEventListener("storage", surStockage);
  return () => {
    abonnes.delete(abonne);
    window.removeEventListener("storage", surStockage);
  };
}

function modifier(transformation: (lignes: LignePanier[]) => LignePanier[]) {
  const lignes = transformation(getSnapshot().lignes);
  etat = { lignes, pret: true };
  ecrireStockage(lignes);
  abonnes.forEach((a) => a());
}

type ContexteValeur = {
  lignes: LignePanier[];
  /** false pendant le premier rendu, avant la lecture du stockage */
  pret: boolean;
  nombreArticles: number;
  ajouterProduit: (slug: string, quantite: number, profilNez?: ProfilNez) => void;
  ajouterEchantillons: (pierres: string[]) => void;
  changerQuantite: (id: string, quantite: number) => void;
  retirer: (id: string) => void;
  vider: () => void;
};

const PanierContext = createContext<ContexteValeur | null>(null);

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const { lignes, pret } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const ajouterProduit = useCallback((slug: string, quantite: number, profilNez?: ProfilNez) => {
    const id = idLigneProduit(slug, profilNez);
    modifier((actuelles) => {
      const existante = actuelles.find((l) => l.id === id);
      if (existante) {
        return actuelles.map((l) =>
          l.id === id ? { ...l, quantite: Math.min(QUANTITE_MAX, l.quantite + quantite) } : l,
        );
      }
      return [...actuelles, { type: "produit", id, slug, quantite, ...(profilNez ? { profilNez } : {}) }];
    });
  }, []);

  const ajouterEchantillons = useCallback((pierres: string[]) => {
    const id = idLigneEchantillons(pierres);
    modifier((actuelles) => {
      if (actuelles.some((l) => l.id === id)) {
        return actuelles.map((l) => (l.id === id ? { ...l, quantite: Math.min(QUANTITE_MAX, l.quantite + 1) } : l));
      }
      return [...actuelles, { type: "echantillons", id, pierres: [...pierres], quantite: 1 }];
    });
  }, []);

  const changerQuantite = useCallback((id: string, quantite: number) => {
    const q = Math.floor(quantite);
    if (!Number.isFinite(q)) return;
    modifier((actuelles) =>
      q < 1
        ? actuelles.filter((l) => l.id !== id)
        : actuelles.map((l) => (l.id === id ? { ...l, quantite: Math.min(QUANTITE_MAX, q) } : l)),
    );
  }, []);

  const retirer = useCallback((id: string) => {
    modifier((actuelles) => actuelles.filter((l) => l.id !== id));
  }, []);

  const vider = useCallback(() => modifier(() => []), []);

  const valeur = useMemo<ContexteValeur>(
    () => ({
      lignes,
      pret,
      nombreArticles: lignes.length,
      ajouterProduit,
      ajouterEchantillons,
      changerQuantite,
      retirer,
      vider,
    }),
    [lignes, pret, ajouterProduit, ajouterEchantillons, changerQuantite, retirer, vider],
  );

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>;
}

export function usePanier(): ContexteValeur {
  const contexte = useContext(PanierContext);
  if (!contexte) throw new Error("usePanier doit être utilisé dans <PanierProvider>");
  return contexte;
}
