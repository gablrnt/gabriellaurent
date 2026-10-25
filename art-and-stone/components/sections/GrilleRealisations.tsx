"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Realisation } from "@/data/realisations";
import { Icone } from "@/components/ui/Icone";
import { ImagePierre } from "@/components/ui/ImagePierre";

type ProduitLie = { slug: string; nom: string };

export function GrilleRealisations({
  realisations,
  produits,
}: {
  realisations: Realisation[];
  produits: Record<string, ProduitLie>;
}) {
  const [ouverte, setOuverte] = useState<number | null>(null);
  const dialogueRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogueRef.current;
    if (!d) return;
    if (ouverte !== null && !d.open) d.showModal();
    if (ouverte === null && d.open) d.close();
    document.body.style.overflow = ouverte !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ouverte]);

  const r = ouverte !== null ? realisations[ouverte] : null;
  const aller = (pas: number) =>
    setOuverte((i) => (i === null ? null : (i + pas + realisations.length) % realisations.length));

  return (
    <>
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {realisations.map((real, i) => (
          <li key={real.slug} id={real.slug} className="scroll-mt-28">
            <button
              type="button"
              onClick={() => setOuverte(i)}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-sm bg-greige/40"
              aria-label={`Agrandir la photo : ${real.titre}`}
            >
              <ImagePierre
                src={real.image.url}
                alt={real.image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-creme/90 px-3 py-1.5 text-xs font-medium text-anthracite">
                <Icone nom="agrandir" className="size-4" />
                Agrandir
              </span>
            </button>
            <h2 className="mt-4 text-3xl">{real.titre}</h2>
            {real.lieu && <p className="text-sm text-taupe-fonce">{real.lieu}</p>}
            <p className="mt-2 leading-relaxed">{real.description}</p>
            {real.produits.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="text-taupe-fonce">Pierres utilisées :</span>
                {real.produits
                  .filter((s) => produits[s])
                  .map((s) => (
                    <Link key={s} href={`/produit/${s}`} className="text-terre-fonce underline underline-offset-4">
                      {produits[s].nom}
                    </Link>
                  ))}
              </p>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogueRef}
        aria-label={r ? `Réalisation : ${r.titre}` : "Réalisation"}
        onClose={() => setOuverte(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") aller(-1);
          if (e.key === "ArrowRight") aller(1);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-anthracite p-0 text-creme backdrop:bg-anthracite"
      >
        {r && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="truncate">
                <span className="font-serif text-xl">{r.titre}</span>
                <span className="text-sm text-creme/70">
                  {" "}
                  — {(ouverte ?? 0) + 1}/{realisations.length}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setOuverte(null)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-creme/10 hover:bg-creme/20"
                aria-label="Fermer"
              >
                <Icone nom="fermer" className="size-6" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image src={r.image.url} alt={r.image.alt} fill sizes="100vw" className="object-contain" />
              <button
                type="button"
                onClick={() => aller(-1)}
                className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-anthracite/70 hover:bg-anthracite"
                aria-label="Réalisation précédente"
              >
                <Icone nom="chevronGauche" className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => aller(1)}
                className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-anthracite/70 hover:bg-anthracite"
                aria-label="Réalisation suivante"
              >
                <Icone nom="chevronDroite" className="size-6" />
              </button>
            </div>
            <p className="px-4 py-4 text-center text-sm text-creme/85">{r.description}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
