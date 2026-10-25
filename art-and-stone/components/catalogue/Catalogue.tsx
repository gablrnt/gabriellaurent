"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { FINITIONS, TEINTES, USAGES, type Produit } from "@/data/produits";
import {
  filtrerProduits,
  lireFiltres,
  optionsDisponibles,
  type Filtres,
} from "@/lib/catalogue";
import { CarteProduit } from "@/components/produit/CarteProduit";
import { Icone } from "@/components/ui/Icone";
import { InfoFinition } from "@/components/ui/InfoFinition";

type Groupe = keyof Filtres;

const TITRES: Record<Groupe, string> = {
  usage: "Usage",
  teinte: "Teinte",
  finition: "Finition",
};

function libelle(groupe: Groupe, valeur: string): string {
  if (groupe === "usage") return USAGES[valeur as keyof typeof USAGES].label;
  if (groupe === "teinte") return TEINTES[valeur as keyof typeof TEINTES].label;
  return FINITIONS[valeur as keyof typeof FINITIONS].label;
}

export function GrilleProduits({ produits }: { produits: Produit[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:gap-x-8">
      {produits.map((p) => (
        <li key={p.slug} className="flex">
          <div className="w-full">
            <CarteProduit produit={p} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Version sans filtres actifs, servie dans le HTML statique avant hydratation */
export function CatalogueStatique({ produits }: { produits: Produit[] }) {
  return (
    <div>
      <p className="mb-6 text-sm text-taupe-fonce">
        {produits.length} produit{produits.length > 1 ? "s" : ""}
      </p>
      <GrilleProduits produits={produits} />
    </div>
  );
}

/** Catalogue avec filtres combinables, synchronisés avec l'URL */
export function Catalogue({ produits }: { produits: Produit[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtres = lireFiltres(searchParams);
  const options = optionsDisponibles(produits);
  const groupes = (Object.keys(options) as Groupe[]).filter((g) => options[g].length > 1);
  const resultats = filtrerProduits(produits, filtres);
  const nombreActifs = filtres.usage.length + filtres.teinte.length + filtres.finition.length;
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const idPanneau = useId();

  function appliquer(nouveaux: Filtres) {
    const params = new URLSearchParams(searchParams.toString());
    for (const g of Object.keys(nouveaux) as Groupe[]) {
      if (nouveaux[g].length > 0) params.set(g, nouveaux[g].join(","));
      else params.delete(g);
    }
    const requete = params.toString();
    router.replace(requete ? `${pathname}?${requete}` : pathname, { scroll: false });
  }

  function basculer(groupe: Groupe, valeur: string) {
    const actuelles = filtres[groupe] as string[];
    const suivantes = actuelles.includes(valeur)
      ? actuelles.filter((v) => v !== valeur)
      : [...actuelles, valeur];
    appliquer({ ...filtres, [groupe]: suivantes });
  }

  if (groupes.length === 0) return <CatalogueStatique produits={produits} />;

  return (
    <div>
      <div className="mb-8 border-y border-greige/70 py-4">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-anthracite/70 px-4 text-sm font-medium"
            aria-expanded={panneauOuvert}
            aria-controls={idPanneau}
            onClick={() => setPanneauOuvert((o) => !o)}
          >
            Filtrer{nombreActifs > 0 ? ` (${nombreActifs})` : ""}
            <Icone nom="chevronBas" className={`size-4 transition-transform ${panneauOuvert ? "rotate-180" : ""}`} />
          </button>
          {nombreActifs > 0 && (
            <button
              type="button"
              className="text-sm text-terre-fonce underline underline-offset-4"
              onClick={() => appliquer({ usage: [], teinte: [], finition: [] })}
            >
              Tout effacer
            </button>
          )}
        </div>

        {!panneauOuvert && nombreActifs > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 md:hidden" aria-label="Filtres actifs">
            {(Object.keys(filtres) as Groupe[]).flatMap((groupe) =>
              (filtres[groupe] as string[]).map((valeur) => (
                <li key={`${groupe}-${valeur}`}>
                  <button
                    type="button"
                    onClick={() => basculer(groupe, valeur)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-anthracite px-3 text-sm text-creme"
                  >
                    {libelle(groupe, valeur)}
                    <Icone nom="fermer" className="size-3.5" />
                    <span className="sr-only">(retirer ce filtre)</span>
                  </button>
                </li>
              )),
            )}
          </ul>
        )}

        <div
          id={idPanneau}
          className={`${panneauOuvert ? "mt-4 grid" : "hidden"} gap-5 md:mt-0 md:grid md:gap-4`}
        >
          {groupes.map((groupe) => {
            const idTitre = `${idPanneau}-${groupe}`;
            return (
              <div key={groupe} role="group" aria-labelledby={idTitre} className="md:flex md:items-start md:gap-6">
                <p
                  id={idTitre}
                  className="mb-2 text-xs font-semibold tracking-[0.18em] uppercase md:mb-0 md:w-24 md:shrink-0 md:pt-3"
                >
                  {TITRES[groupe]}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {(options[groupe] as string[]).map((valeur) => {
                    const actif = (filtres[groupe] as string[]).includes(valeur);
                    return (
                      <li key={valeur} className="inline-flex items-center">
                        <button
                          type="button"
                          aria-pressed={actif}
                          onClick={() => basculer(groupe, valeur)}
                          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors ${
                            actif
                              ? "border-anthracite bg-anthracite text-creme"
                              : "border-greige bg-blanc text-anthracite hover:border-anthracite"
                          }`}
                        >
                          {groupe === "teinte" && (
                            <span
                              aria-hidden="true"
                              className="size-3.5 rounded-full border border-anthracite/20"
                              style={{ backgroundColor: TEINTES[valeur as keyof typeof TEINTES].pastille }}
                            />
                          )}
                          {actif && <Icone nom="coche" className="size-3.5" />}
                          {libelle(groupe, valeur)}
                        </button>
                        {groupe === "finition" && (
                          <InfoFinition finition={valeur as keyof typeof FINITIONS} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-taupe-fonce" aria-live="polite">
          {resultats.length} produit{resultats.length > 1 ? "s" : ""}
          {nombreActifs > 0 ? " correspondant à votre sélection" : ""}
        </p>
        {nombreActifs > 0 && (
          <button
            type="button"
            className="hidden text-sm text-terre-fonce underline underline-offset-4 md:inline"
            onClick={() => appliquer({ usage: [], teinte: [], finition: [] })}
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {resultats.length > 0 ? (
        <GrilleProduits produits={resultats} />
      ) : (
        <div className="rounded-sm bg-sable px-6 py-12 text-center">
          <p className="font-serif text-2xl">Aucune pierre ne correspond à tous ces critères.</p>
          <p className="mt-2 text-taupe-fonce">Retirez un filtre, ou appelez-nous : nous avons peut-être la pierre qu&apos;il vous faut.</p>
          <button
            type="button"
            className="mt-6 text-terre-fonce underline underline-offset-4"
            onClick={() => appliquer({ usage: [], teinte: [], finition: [] })}
          >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  );
}
