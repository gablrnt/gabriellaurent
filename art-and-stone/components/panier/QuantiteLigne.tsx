"use client";

import { useState } from "react";
import { QUANTITE_MAX } from "@/lib/commande";
import { Icone } from "@/components/ui/Icone";

/** Sélecteur de quantité : boutons − / + et saisie directe */
export function QuantiteLigne({
  quantite,
  unite,
  nom,
  onChange,
}: {
  quantite: number;
  unite: string;
  nom: string;
  onChange: (q: number) => void;
}) {
  // Brouillon de saisie : réinitialisé (via `key`) quand la quantité change ailleurs.
  const [brouillon, setBrouillon] = useState(String(quantite));

  function valider(valeur: string) {
    const q = Math.floor(Number(valeur));
    if (Number.isFinite(q) && q >= 1) onChange(Math.min(QUANTITE_MAX, q));
    else setBrouillon(String(quantite));
  }

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center rounded-sm border border-taupe bg-blanc">
        <button
          type="button"
          onClick={() => onChange(quantite - 1)}
          disabled={quantite <= 1}
          className="inline-flex size-10 items-center justify-center disabled:opacity-40"
          aria-label={`Diminuer la quantité de ${nom}`}
        >
          <Icone nom="moins" className="size-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={brouillon}
          onChange={(e) => setBrouillon(e.target.value.replace(/[^\d]/g, ""))}
          onBlur={(e) => valider(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") valider(e.currentTarget.value);
          }}
          className="h-10 w-14 border-x border-greige bg-transparent text-center font-medium"
          aria-label={`Quantité de ${nom}, en ${unite}`}
        />
        <button
          type="button"
          onClick={() => onChange(quantite + 1)}
          disabled={quantite >= QUANTITE_MAX}
          className="inline-flex size-10 items-center justify-center disabled:opacity-40"
          aria-label={`Augmenter la quantité de ${nom}`}
        >
          <Icone nom="plus" className="size-4" />
        </button>
      </div>
      <span className="text-sm text-taupe-fonce">{unite}</span>
    </div>
  );
}
