"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, FINITIONS, KIT_ECHANTILLONS, type Categorie, type Produit } from "@/data/produits";
import { formatPrix } from "@/lib/format";
import { Bouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { usePanier } from "./PanierProvider";

const N = KIT_ECHANTILLONS.nombre;

function Liste({
  pierres,
  choix,
  onBasculer,
}: {
  pierres: Produit[];
  choix: string[];
  onBasculer?: (slug: string) => void;
}) {
  const complet = choix.length >= N;
  const categories = [...new Set(pierres.map((p) => p.categorie))] as Categorie[];
  return (
    <div className="space-y-10">
      {categories.map((c) => (
        <fieldset key={c}>
          <legend className="mb-4 font-serif text-2xl">{CATEGORIES[c].titre}</legend>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pierres
              .filter((p) => p.categorie === c)
              .map((p) => {
                const coche = choix.includes(p.slug);
                const bloque = !coche && complet;
                return (
                  <li key={p.slug}>
                    <label
                      className={`flex h-full items-center gap-3 rounded-sm border p-2.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terre-fonce ${
                        coche
                          ? "border-anthracite bg-sable"
                          : bloque
                            ? "cursor-not-allowed border-greige/60 bg-blanc/50 opacity-60"
                            : "cursor-pointer border-greige bg-blanc hover:border-taupe"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={coche}
                        disabled={bloque || !onBasculer}
                        onChange={() => onBasculer?.(p.slug)}
                        className="size-5 shrink-0 accent-terre"
                      />
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-greige/40">
                        {p.images[0] && <ImagePierre src={p.images[0].url} alt="" fill sizes="64px" />}
                      </span>
                      <span className="min-w-0 text-sm leading-snug">
                        <span className="block font-medium">{p.nom}</span>
                        {p.finition && (
                          <span className="text-taupe-fonce">Finition {FINITIONS[p.finition].label.toLowerCase()}</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}

/** Liste affichée avant hydratation (HTML statique) */
export function ListeEchantillonsStatique({ pierres }: { pierres: Produit[] }) {
  return <Liste pierres={pierres} choix={[]} />;
}

export function SelecteurEchantillons({ pierres }: { pierres: Produit[] }) {
  const recherche = useSearchParams();
  const { ajouterEchantillons } = usePanier();
  const [choix, setChoix] = useState<string[]>(() =>
    (recherche.get("pierres") ?? "")
      .split(",")
      .filter((s) => pierres.some((p) => p.slug === s))
      .slice(0, N),
  );
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);

  function basculer(slug: string) {
    setMessage(null);
    setChoix((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length < N ? [...c, slug] : c));
  }

  function ajouter() {
    if (choix.length !== N) {
      setMessage({
        type: "erreur",
        texte: `Choisissez encore ${N - choix.length} pierre${N - choix.length > 1 ? "s" : ""} pour compléter votre kit.`,
      });
      return;
    }
    ajouterEchantillons(choix);
    setChoix([]);
    setMessage({ type: "ok", texte: "Votre kit de 3 échantillons a été ajouté au panier." });
  }

  const noms = choix.map((s) => pierres.find((p) => p.slug === s)?.nom).filter(Boolean);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <Liste pierres={pierres} choix={choix} onBasculer={basculer} />

      <aside
        className="sticky bottom-0 z-20 -mx-4 border-t border-greige bg-creme/95 p-4 backdrop-blur sm:mx-0 lg:top-28 lg:bottom-auto lg:rounded-sm lg:border lg:bg-blanc lg:p-6"
        aria-label="Votre kit d'échantillons"
      >
        <p className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-2xl">Votre kit</span>
          <span className="font-semibold" aria-live="polite">
            {choix.length} / {N} sélectionnée{choix.length > 1 ? "s" : ""}
          </span>
        </p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: N }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < choix.length ? "bg-terre" : "bg-greige/60"}`} />
          ))}
        </div>
        {noms.length > 0 && (
          <ul className="mt-4 hidden space-y-1 text-sm lg:block">
            {noms.map((n) => (
              <li key={n} className="flex gap-2">
                <Icone nom="coche" className="mt-0.5 size-4 shrink-0 text-terre-fonce" />
                {n}
              </li>
            ))}
          </ul>
        )}
        <Bouton taille="grand" className="mt-4 w-full" onClick={ajouter}>
          Ajouter le kit au panier — {formatPrix(KIT_ECHANTILLONS.prix)}
        </Bouton>
        <div aria-live="polite">
          {message && (
            <p
              className={`mt-3 text-sm font-medium ${message.type === "ok" ? "text-succes" : "text-erreur"}`}
            >
              {message.texte}{" "}
              {message.type === "ok" && (
                <Link href="/panier" className="text-anthracite underline underline-offset-4">
                  Voir le panier
                </Link>
              )}
            </p>
          )}
        </div>
        <p className="mt-3 hidden text-xs text-taupe-fonce lg:block">
          {formatPrix(KIT_ECHANTILLONS.prix)} remboursés en bon d&apos;achat sur votre commande de pierres.
        </p>
      </aside>
    </div>
  );
}
