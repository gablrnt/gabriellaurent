"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import {
  KIT_ECHANTILLONS,
  MARGE_COUPE,
  PROFILS_NEZ,
  UNITES,
  type ProfilNez,
  type Produit,
} from "@/data/produits";
import {
  lireNombre,
  margeApplicable,
  nombreBidons,
  quantiteACommander,
  surfaceParBidon,
} from "@/lib/calculs";
import { formatNombre, formatPoids, formatPrix } from "@/lib/format";
import { usePanier } from "@/components/panier/PanierProvider";
import { Bouton, LienBouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { ProfilNezSchema } from "./ProfilNezSchema";
import { useSaisieSurface } from "./SaisieSurface";

const CLASSE_CHAMP =
  "block w-full rounded-sm border border-taupe bg-blanc px-3.5 py-3 text-lg text-anthracite placeholder:text-taupe-fonce/70 focus:border-anthracite";

function ConfirmationAjout({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="min-h-0">
      {message && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm bg-succes/10 px-4 py-3 text-sm text-succes">
          <Icone nom="coche" className="size-5" />
          <span className="font-medium">{message}</span>
          <Link href="/panier" className="font-semibold text-anthracite underline underline-offset-4">
            Voir le panier
          </Link>
        </p>
      )}
    </div>
  );
}

/** Choix obligatoire du profil de nez (margelles) */
function ChoixProfilNez({
  valeur,
  onChange,
  erreur,
  groupeRef,
}: {
  valeur: ProfilNez | null;
  onChange: (p: ProfilNez) => void;
  erreur: boolean;
  groupeRef: React.RefObject<HTMLFieldSetElement | null>;
}) {
  const idErreur = useId();
  return (
    <fieldset
      ref={groupeRef}
      tabIndex={-1}
      aria-describedby={erreur ? idErreur : undefined}
      className="rounded-sm"
    >
      <legend className="mb-1 text-sm font-semibold">
        Profil de nez <span className="font-normal text-taupe-fonce">(obligatoire)</span>
      </legend>
      <p className="mb-3 text-sm text-taupe-fonce">Le nez est le bord de la margelle côté bassin.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(Object.keys(PROFILS_NEZ) as ProfilNez[]).map((p) => {
          const choisi = valeur === p;
          return (
            <label
              key={p}
              className={`flex cursor-pointer items-center gap-3 rounded-sm border p-2.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terre-fonce ${
                choisi ? "border-anthracite bg-sable" : "border-greige bg-blanc hover:border-taupe"
              }`}
            >
              <input
                type="radio"
                name="profil-nez"
                value={p}
                checked={choisi}
                onChange={() => onChange(p)}
                className="sr-only"
              />
              <ProfilNezSchema profil={p} className="w-16 shrink-0 text-anthracite" />
              <span className="text-sm leading-tight">
                <span className="font-semibold">{p}</span> — {PROFILS_NEZ[p].nom}
                <span className="mt-0.5 block text-xs text-taupe-fonce">{PROFILS_NEZ[p].description}</span>
              </span>
              {choisi && <Icone nom="coche" className="ml-auto size-5 shrink-0 text-terre-fonce" />}
            </label>
          );
        })}
      </div>
      {erreur && (
        <p id={idErreur} className="mt-2 text-sm font-medium text-erreur">
          Choisissez un profil de nez avant d&apos;ajouter la margelle au panier.
        </p>
      )}
    </fieldset>
  );
}

/** Calculateur pour les pierres (m², mètre linéaire, pièce) */
function CalculateurPierre({ produit }: { produit: Produit }) {
  const { ajouterProduit } = usePanier();
  const surfacePartagee = useSaisieSurface();
  const [saisieLocale, setSaisieLocale] = useState("");
  // Au m², la surface saisie sert aussi au calcul des produits de protection.
  const saisie = produit.unite === "m2" ? surfacePartagee.surface : saisieLocale;
  const setSaisie = produit.unite === "m2" ? surfacePartagee.setSurface : setSaisieLocale;

  const [avecMarge, setAvecMarge] = useState(true);
  const [profil, setProfil] = useState<ProfilNez | null>(null);
  const [erreurProfil, setErreurProfil] = useState(false);
  const [erreurSaisie, setErreurSaisie] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const profilRef = useRef<HTMLFieldSetElement>(null);
  const champRef = useRef<HTMLInputElement>(null);
  const idChamp = useId();
  const idAide = useId();
  const idMarge = useId();

  const unite = UNITES[produit.unite];
  const marge = margeApplicable(produit);
  const valeur = lireNombre(saisie);
  const quantite = produit.unite === "piece" ? Math.ceil(valeur) : quantiteACommander(valeur, marge && avecMarge);
  const total = quantite * produit.prix;
  const poids = produit.poidsKgParUnite !== null ? quantite * produit.poidsKgParUnite : null;

  const libelleChamp =
    produit.unite === "m2"
      ? "Surface à couvrir, en m²"
      : produit.unite === "ml"
        ? "Longueur à couvrir, en mètres linéaires"
        : "Nombre de pièces";

  function ajouter() {
    setConfirmation(null);
    if (quantite <= 0) {
      setErreurSaisie(true);
      champRef.current?.focus();
      return;
    }
    if (produit.profilNezObligatoire && !profil) {
      setErreurProfil(true);
      profilRef.current?.focus();
      return;
    }
    ajouterProduit(produit.slug, quantite, produit.profilNezObligatoire ? (profil ?? undefined) : undefined);
    setConfirmation(`${formatNombre(quantite)} ${unite.quantite} ajouté${quantite > 1 ? "s" : ""} au panier.`);
  }

  return (
    <div className="rounded-sm border border-greige bg-blanc/60 p-4 sm:p-6">
      <h2 className="flex items-center gap-2 font-sans text-base font-semibold">
        <Icone nom="calculette" className="size-5 text-terre-fonce" />
        Calculez votre quantité
      </h2>

      <div className="mt-4">
        <label htmlFor={idChamp} className="mb-1.5 block text-sm font-medium">
          {libelleChamp}
        </label>
        <div className="relative">
          <input
            ref={champRef}
            id={idChamp}
            type="text"
            inputMode={produit.unite === "piece" ? "numeric" : "decimal"}
            autoComplete="off"
            placeholder={produit.unite === "piece" ? "Ex. : 12" : "Ex. : 24,5"}
            value={saisie}
            onChange={(e) => {
              setSaisie(e.target.value);
              setErreurSaisie(false);
              setConfirmation(null);
            }}
            aria-invalid={erreurSaisie || undefined}
            aria-describedby={erreurSaisie ? idAide : undefined}
            className={`${CLASSE_CHAMP} pr-16`}
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-taupe-fonce">
            {unite.quantite}
          </span>
        </div>
        {erreurSaisie && (
          <p id={idAide} className="mt-1.5 text-sm font-medium text-erreur">
            Indiquez {produit.unite === "piece" ? "le nombre de pièces" : produit.unite === "m2" ? "votre surface" : "votre longueur"} pour calculer la quantité.
          </p>
        )}
      </div>

      {marge && (
        <div className="mt-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={avecMarge}
              onChange={(e) => setAvecMarge(e.target.checked)}
              aria-describedby={idMarge}
              className="mt-0.5 size-5 shrink-0 accent-terre"
            />
            <span className="text-sm font-medium">Ajouter {MARGE_COUPE * 100} % de marge de coupe</span>
          </label>
          <p id={idMarge} className="mt-1 pl-8 text-sm text-taupe-fonce">
            Recommandé : cette marge couvre les coupes en bordure, la casse éventuelle et le choix des teintes à
            la pose.
          </p>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-greige/70 pt-4" aria-live="polite">
        <div>
          <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Quantité à commander</dt>
          <dd className="mt-0.5 text-lg font-semibold">
            {quantite > 0 ? `${formatNombre(quantite)} ${unite.quantite}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Prix total TTC</dt>
          <dd className="mt-0.5 text-lg font-semibold">{quantite > 0 ? formatPrix(total) : "—"}</dd>
        </div>
        {poids !== null && quantite > 0 && (
          <div>
            <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Poids estimé</dt>
            <dd className="mt-0.5 font-semibold">{formatPoids(poids)}</dd>
          </div>
        )}
      </dl>
      {quantite > 0 && produit.unite !== "piece" && (
        <p className="mt-2 text-xs text-taupe-fonce">
          Arrondi {produit.unite === "m2" ? "au m²" : "au mètre"} supérieur. Nous vérifions votre quantité avec vous
          avant l&apos;expédition.
        </p>
      )}

      {produit.profilNezObligatoire && (
        <div className="mt-6">
          <ChoixProfilNez
            valeur={profil}
            onChange={(p) => {
              setProfil(p);
              setErreurProfil(false);
              setConfirmation(null);
            }}
            erreur={erreurProfil}
            groupeRef={profilRef}
          />
        </div>
      )}

      <Bouton taille="grand" className="mt-6 w-full" onClick={ajouter}>
        <Icone nom="panier" className="size-5" />
        Ajouter au panier
      </Bouton>
      <ConfirmationAjout message={confirmation} />
    </div>
  );
}

/** Mini-calculateur pour les produits d'entretien : surface → nombre de bidons */
function CalculateurBidons({ produit }: { produit: Produit }) {
  const { ajouterProduit } = usePanier();
  const [saisie, setSaisie] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const idChamp = useId();
  const surface = lireNombre(saisie);
  const quantite = surface > 0 ? nombreBidons(surface, produit) : 1;
  const couverture = surfaceParBidon(produit);

  return (
    <div className="rounded-sm border border-greige bg-blanc/60 p-4 sm:p-6">
      <h2 className="flex items-center gap-2 font-sans text-base font-semibold">
        <Icone nom="calculette" className="size-5 text-terre-fonce" />
        Combien de bidons ?
      </h2>
      {produit.entretien && couverture !== null && (
        <p className="mt-2 text-sm text-taupe-fonce">
          Un bidon de {formatNombre(produit.entretien.contenanceL)} L couvre environ {formatNombre(couverture)} m²
          {produit.entretien.precisionRendement ? ` ${produit.entretien.precisionRendement}` : ""} (rendement{" "}
          {formatNombre(produit.entretien.rendementM2ParL)} m²/L).
        </p>
      )}
      <label htmlFor={idChamp} className="mt-4 mb-1.5 block text-sm font-medium">
        Surface à traiter, en m²
      </label>
      <div className="relative">
        <input
          id={idChamp}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ex. : 40"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value);
            setConfirmation(null);
          }}
          className={`${CLASSE_CHAMP} pr-14`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-taupe-fonce">m²</span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-greige/70 pt-4" aria-live="polite">
        <div>
          <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Bidons nécessaires</dt>
          <dd className="mt-0.5 text-lg font-semibold">
            {quantite} bidon{quantite > 1 ? "s" : ""}
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Prix total TTC</dt>
          <dd className="mt-0.5 text-lg font-semibold">{formatPrix(quantite * produit.prix)}</dd>
        </div>
      </dl>
      {produit.entretien?.precisionRendement && (
        <p className="mt-2 text-xs text-taupe-fonce">
          Calcul pour une couche. Appelez-nous pour savoir combien de couches prévoir sur votre pierre.
        </p>
      )}
      <Bouton
        taille="grand"
        className="mt-6 w-full"
        onClick={() => {
          ajouterProduit(produit.slug, quantite);
          setConfirmation(`${quantite} bidon${quantite > 1 ? "s" : ""} ajouté${quantite > 1 ? "s" : ""} au panier.`);
        }}
      >
        <Icone nom="panier" className="size-5" />
        Ajouter au panier
      </Bouton>
      <ConfirmationAjout message={confirmation} />
    </div>
  );
}

export function AchatProduit({ produit }: { produit: Produit }) {
  if (produit.unite === "bidon") return <CalculateurBidons produit={produit} />;
  return (
    <div className="space-y-4">
      <CalculateurPierre produit={produit} />
      <LienBouton
        href={`/echantillons?pierres=${produit.slug}`}
        variante="secondaire"
        taille="grand"
        className="w-full"
      >
        <Icone nom="echantillons" className="size-5" />
        <span>
          Commander un échantillon — {formatPrix(KIT_ECHANTILLONS.prix)}, remboursé sur votre commande
        </span>
      </LienBouton>
    </div>
  );
}
