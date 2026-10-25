"use client";

import Link from "next/link";
import { KIT_ECHANTILLONS } from "@/data/produits";
import { resoudrePanier } from "@/lib/commande";
import { formatPoids, formatPrix } from "@/lib/format";
import { LienBouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { usePanier } from "./PanierProvider";
import { QuantiteLigne } from "./QuantiteLigne";

export function ContenuPanier() {
  const { lignes, pret, changerQuantite, retirer } = usePanier();

  if (!pret) {
    return (
      <div className="space-y-4" aria-busy="true">
        <p className="sr-only">Chargement du panier…</p>
        {[0, 1].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-sm bg-sable" />
        ))}
      </div>
    );
  }

  const panier = resoudrePanier(lignes);

  if (panier.lignes.length === 0) {
    return (
      <div className="rounded-sm bg-sable px-6 py-14 text-center">
        <Icone nom="panier" className="mx-auto size-10 text-taupe" />
        <p className="mt-4 font-serif text-3xl">Votre panier est vide</p>
        <p className="mx-auto mt-2 max-w-md text-taupe-fonce">
          Parcourez nos pierres, ou commencez par un kit de 3 échantillons pour voir la pierre chez vous.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LienBouton href="/pierres">Voir les pierres</LienBouton>
          <LienBouton href="/echantillons" variante="secondaire">
            Commander des échantillons
          </LienBouton>
        </div>
      </div>
    );
  }

  const contientPierres = panier.lignes.some((l) => l.type === "produit");
  const contientEchantillons = panier.lignes.some((l) => l.type === "echantillons");
  const prixIndicatifs = panier.lignes.some((l) => l.prixProvisoire);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section aria-label="Articles du panier">
        <ul className="divide-y divide-greige/70 border-y border-greige/70">
          {panier.lignes.map((l) => (
            <li key={l.id} className="flex gap-4 py-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-sm bg-greige/40 sm:size-28">
                {l.image && (
                  <ImagePierre
                    src={l.image.url}
                    alt=""
                    fill
                    sizes="112px"
                    className={l.unite === "bidon" ? "bg-white object-contain p-2" : ""}
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-serif text-xl leading-snug">
                    <Link href={l.href} className="hover:text-terre-fonce">
                      {l.nom}
                    </Link>
                  </h2>
                  {l.details.length > 0 && (
                    <ul className="mt-1 text-sm text-taupe-fonce">
                      {l.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-1 text-sm">
                    {formatPrix(l.prixUnitaire)} TTC / {l.unite === "kit" ? "kit" : l.libelleUnite.replace("(s)", "")}
                    {l.prixProvisoire && <span className="text-taupe-fonce"> · prix indicatif</span>}
                  </p>
                  <div className="mt-3">
                    <QuantiteLigne
                      key={l.quantite}
                      quantite={l.quantite}
                      unite={l.libelleUnite}
                      nom={l.nom}
                      onChange={(q) => changerQuantite(l.id, q)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-lg font-semibold">{formatPrix(l.total)}</p>
                  <button
                    type="button"
                    onClick={() => retirer(l.id)}
                    className="inline-flex min-h-10 items-center gap-1.5 text-sm text-taupe-fonce underline-offset-4 hover:text-erreur hover:underline"
                  >
                    <Icone nom="corbeille" className="size-4" />
                    Retirer<span className="sr-only"> {l.nom} du panier</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/pierres"
          className="mt-6 inline-flex items-center gap-2 text-sm text-terre-fonce underline underline-offset-4"
        >
          <Icone nom="chevronGauche" className="size-4" />
          Continuer mes achats
        </Link>
      </section>

      <aside className="rounded-sm border border-greige bg-blanc p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Récapitulatif">
        <h2 className="font-serif text-2xl">Récapitulatif</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Sous-total TTC</dt>
            <dd className="text-lg font-semibold">{formatPrix(panier.sousTotal)}</dd>
          </div>
          {contientPierres && panier.poidsTotalKg !== null && panier.poidsTotalKg > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-1.5">
                <Icone nom="poids" className="size-4 text-taupe-fonce" /> Poids total estimé
              </dt>
              <dd className="font-medium">{formatPoids(panier.poidsTotalKg)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 text-taupe-fonce">
            <dt>Livraison</dt>
            <dd className="text-right">Calculée à l&apos;étape suivante</dd>
          </div>
        </dl>
        {prixIndicatifs && (
          <p className="mt-4 rounded-sm bg-sable px-3 py-2 text-xs text-taupe-fonce">
            Certains prix sont indicatifs : nous vous confirmons le montant exact avant tout paiement.
          </p>
        )}
        <LienBouton href="/commande" taille="grand" className="mt-6 w-full">
          Passer commande
          <Icone nom="fleche" className="size-5" />
        </LienBouton>
        <ul className="mt-5 space-y-2 text-xs text-taupe-fonce">
          {contientEchantillons && (
            <li className="flex gap-2">
              <Icone nom="echantillons" className="size-4 shrink-0" />
              Le kit d&apos;échantillons ({formatPrix(KIT_ECHANTILLONS.prix)}) vous est remboursé en bon d&apos;achat sur
              votre commande de pierres.
            </li>
          )}
          <li className="flex gap-2">
            <Icone nom="telephone" className="size-4 shrink-0" />
            Une question ? Nous vous répondons sous 24 h.
          </li>
        </ul>
      </aside>
    </div>
  );
}
