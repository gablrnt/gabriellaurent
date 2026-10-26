"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type Onglet = { id: string; titre: string; contenu: ReactNode };

/** Onglets accessibles (motif ARIA « tabs ») : flèches gauche/droite, Début, Fin */
export function Onglets({ onglets, libelle }: { onglets: Onglet[]; libelle: string }) {
  const [actif, setActif] = useState(0);
  const base = useId();
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);

  function activer(i: number) {
    const n = (i + onglets.length) % onglets.length;
    setActif(n);
    boutons.current[n]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={libelle}
        className="-mx-4 flex overflow-x-auto border-b border-greige px-4 sm:mx-0 sm:px-0"
      >
        {onglets.map((o, i) => (
          <button
            key={o.id}
            ref={(el) => {
              boutons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-onglet-${o.id}`}
            aria-selected={i === actif}
            aria-controls={`${base}-panneau-${o.id}`}
            tabIndex={i === actif ? 0 : -1}
            onClick={() => setActif(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") activer(i + 1);
              else if (e.key === "ArrowLeft") activer(i - 1);
              else if (e.key === "Home") activer(0);
              else if (e.key === "End") activer(onglets.length - 1);
              else return;
              e.preventDefault();
            }}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-6 sm:text-base ${
              i === actif
                ? "border-terre-fonce text-anthracite"
                : "border-transparent text-taupe-fonce hover:text-anthracite"
            }`}
          >
            {o.titre}
          </button>
        ))}
      </div>
      {onglets.map((o, i) => (
        <div
          key={o.id}
          role="tabpanel"
          id={`${base}-panneau-${o.id}`}
          aria-labelledby={`${base}-onglet-${o.id}`}
          hidden={i !== actif}
          tabIndex={0}
          className="py-6 sm:py-8"
        >
          {o.contenu}
        </div>
      ))}
    </div>
  );
}
