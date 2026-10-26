"use client";

import { useEffect } from "react";
import { usePanier } from "./PanierProvider";

/** Vide le panier une fois la commande confirmée */
export function ViderPanier() {
  const { vider, pret, lignes } = usePanier();
  useEffect(() => {
    if (pret && lignes.length > 0) vider();
  }, [pret, lignes.length, vider]);
  return null;
}
