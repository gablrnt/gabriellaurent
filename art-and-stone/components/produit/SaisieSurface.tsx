"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Surface saisie par le client sur la fiche produit (texte brut, ex. « 24,5 »),
 * partagée entre le calculateur et le calcul des bidons de protection.
 */
type Valeur = { surface: string; setSurface: (v: string) => void };

const SurfaceContext = createContext<Valeur | null>(null);

export function SaisieSurfaceProvider({ children }: { children: ReactNode }) {
  const [surface, setSurface] = useState("");
  return <SurfaceContext.Provider value={{ surface, setSurface }}>{children}</SurfaceContext.Provider>;
}

export function useSaisieSurface(): Valeur {
  const valeur = useContext(SurfaceContext);
  if (!valeur) throw new Error("useSaisieSurface doit être utilisé dans <SaisieSurfaceProvider>");
  return valeur;
}
