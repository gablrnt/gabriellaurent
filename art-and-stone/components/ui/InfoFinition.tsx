"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FINITIONS, type Finition } from "@/data/produits";
import { Icone } from "./Icone";

type Mode = "survol" | "clic" | null;

const LARGEUR_MAX = 256;
const MARGE_ECRAN = 16;

/**
 * Explication d'une finition en une phrase.
 * Souris : au survol. Mobile et clavier : au toucher / Entrée.
 * Les lecteurs d'écran lisent l'explication dès le focus (aria-describedby).
 */
export function InfoFinition({ finition, className = "" }: { finition: Finition; className?: string }) {
  const [mode, setMode] = useState<Mode>(null);
  const [decalage, setDecalage] = useState(0);
  const id = useId();
  const conteneurRef = useRef<HTMLSpanElement>(null);
  const boutonRef = useRef<HTMLButtonElement>(null);
  const { label, explication } = FINITIONS[finition];

  // Recentre la bulle pour qu'elle ne sorte jamais de l'écran (téléphones).
  function ouvrir(nouveauMode: Exclude<Mode, null>) {
    const bouton = boutonRef.current;
    if (bouton) {
      const r = bouton.getBoundingClientRect();
      const largeur = Math.min(LARGEUR_MAX, window.innerWidth - 2 * MARGE_ECRAN);
      const gauche = r.left + r.width / 2 - largeur / 2;
      const corrigee = Math.min(Math.max(gauche, MARGE_ECRAN), window.innerWidth - MARGE_ECRAN - largeur);
      setDecalage(Math.round(corrigee - gauche));
    }
    setMode(nouveauMode);
  }

  // Fermeture au toucher en dehors (iOS ne retire pas le focus du bouton).
  useEffect(() => {
    if (mode !== "clic") return;
    const surPointeur = (e: PointerEvent) => {
      if (!conteneurRef.current?.contains(e.target as Node)) setMode(null);
    };
    document.addEventListener("pointerdown", surPointeur);
    return () => document.removeEventListener("pointerdown", surPointeur);
  }, [mode]);

  return (
    <span
      ref={conteneurRef}
      className={`relative inline-flex ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && mode === null) ouvrir("survol");
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse" && mode === "survol") setMode(null);
      }}
    >
      <button
        ref={boutonRef}
        type="button"
        className="inline-flex size-7 items-center justify-center rounded-full text-terre-fonce hover:bg-sable"
        aria-label={`Qu'est-ce que la finition ${label.toLowerCase()} ?`}
        aria-describedby={id}
        aria-expanded={mode !== null}
        onClick={() => (mode === "clic" ? setMode(null) : ouvrir("clic"))}
        onBlur={() => setMode(null)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setMode(null);
        }}
      >
        <Icone nom="info" className="size-4.5" />
      </button>
      <span
        id={id}
        role="tooltip"
        style={{ transform: `translateX(calc(-50% + ${decalage}px))` }}
        className={`${mode ? "block" : "hidden"} absolute top-full left-1/2 z-30 mt-1.5 w-64 max-w-[calc(100vw-2rem)] rounded-sm bg-anthracite px-3 py-2 text-left text-sm leading-snug font-normal tracking-normal text-creme normal-case shadow-lg`}
      >
        <strong className="font-semibold">{label} :</strong>{" "}
        {explication.charAt(0).toLowerCase() + explication.slice(1)}
      </span>
    </span>
  );
}
