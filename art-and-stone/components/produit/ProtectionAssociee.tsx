"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Produit } from "@/data/produits";
import { lireNombre, nombreBidons, surfaceParBidon } from "@/lib/calculs";
import { formatNombre, formatPrix } from "@/lib/format";
import { usePanier } from "@/components/panier/PanierProvider";
import { Bouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { useSaisieSurface } from "./SaisieSurface";

/**
 * Produits associés (Protect Pierre Base + Finish) avec le nombre de bidons
 * calculé pour la surface saisie dans le calculateur.
 */
export function ProtectionAssociee({ produits }: { produits: Produit[] }) {
  const { surface, setSurface } = useSaisieSurface();
  const { ajouterProduit } = usePanier();
  const [ajoute, setAjoute] = useState<string | null>(null);
  const idChamp = useId();
  const m2 = lireNombre(surface);

  return (
    <div>
      <div className="max-w-sm">
        <label htmlFor={idChamp} className="mb-1.5 block text-sm font-medium">
          Surface à protéger, en m²
        </label>
        <div className="relative">
          <input
            id={idChamp}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Ex. : 30"
            value={surface}
            onChange={(e) => {
              setSurface(e.target.value);
              setAjoute(null);
            }}
            className="block w-full rounded-sm border border-taupe bg-blanc px-3.5 py-3 pr-14 text-lg placeholder:text-taupe-fonce/70 focus:border-anthracite"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-taupe-fonce">m²</span>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {produits.map((p) => {
          const quantite = m2 > 0 ? nombreBidons(m2, p) : 1;
          const couverture = surfaceParBidon(p);
          return (
            <li key={p.slug} className="flex gap-4 rounded-sm border border-greige bg-blanc p-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-sm bg-white sm:size-28">
                {p.images[0] && (
                  <ImagePierre src={p.images[0].url} alt={p.images[0].alt} fill sizes="112px" className="object-contain p-2" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-serif text-xl">
                  <Link href={`/produit/${p.slug}`} className="hover:text-terre-fonce">
                    {p.nom}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-taupe-fonce">{p.descriptionCourte}</p>
                <p className="mt-2 text-sm">
                  {formatPrix(p.prix)} TTC le bidon
                  {couverture !== null && (
                    <span className="text-taupe-fonce">
                      {" "}
                      · couvre environ {formatNombre(couverture)} m²
                      {p.entretien?.precisionRendement ? ` ${p.entretien.precisionRendement}` : ""}
                    </span>
                  )}
                </p>
                <p className="mt-2 font-semibold" aria-live="polite">
                  {m2 > 0 ? `Pour ${formatNombre(m2)} m² : ` : ""}
                  {quantite} bidon{quantite > 1 ? "s" : ""} — {formatPrix(quantite * p.prix)}
                </p>
                <Bouton
                  variante="secondaire"
                  className="mt-3 self-start"
                  onClick={() => {
                    ajouterProduit(p.slug, quantite);
                    setAjoute(p.slug);
                  }}
                >
                  {ajoute === p.slug ? (
                    <>
                      <Icone nom="coche" className="size-4" /> Ajouté au panier
                    </>
                  ) : (
                    `Ajouter ${quantite} bidon${quantite > 1 ? "s" : ""}`
                  )}
                </Bouton>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-taupe-fonce">
        Estimation pour une couche, d&apos;après le rendement de chaque produit. Protect Pierre Base s&apos;applique
        en première couche, Protect Pierre Finish en finition.
      </p>
    </div>
  );
}
