"use client";

import { useSearchParams } from "next/navigation";
import { ViderPanier } from "@/components/panier/ViderPanier";

/** Référence de la commande, lue dans l'adresse (?ref=AS-…) */
export function Confirmation() {
  const reference = (useSearchParams().get("ref") ?? "").slice(0, 40);
  return (
    <>
      <ViderPanier />
      {reference && (
        <p className="mt-4 text-taupe-fonce">
          Référence : <strong className="text-anthracite">{reference}</strong>
        </p>
      )}
    </>
  );
}
