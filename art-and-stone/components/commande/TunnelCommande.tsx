"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MODES, ZONES, type ModeLivraison, type ZoneLivraison } from "@/data/livraison";
import { calculerFraisLivraison, modesDisponibles, resoudrePanier, type FraisLivraison } from "@/lib/commande";
import { formatNombre, formatPrix } from "@/lib/format";
import {
  aucuneErreur,
  validerAdresse,
  validerCoordonnees,
  type AdresseLivraison,
  type Coordonnees,
  type Erreurs,
} from "@/lib/validation";
import { usePanier } from "@/components/panier/PanierProvider";
import { Bouton, LienBouton } from "@/components/ui/Bouton";
import { Champ, ChampListe, ChampPiege, ChampTexte } from "@/components/ui/Champ";
import { Icone } from "@/components/ui/Icone";

const ETAPES = ["Coordonnées", "Adresse de livraison", "Mode de livraison", "Récapitulatif"] as const;

function libelleFrais(frais: FraisLivraison): string {
  if (frais.montant === null) return frais.libelle;
  if (frais.montant === 0) return frais.libelle || "Gratuit";
  return formatPrix(frais.montant);
}

function BarreProgression({ etape }: { etape: number }) {
  return (
    <nav aria-label="Étapes de la commande" className="mb-8">
      <p className="mb-3 text-sm text-taupe-fonce">
        Étape {etape + 1} sur {ETAPES.length}
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-greige/50"
        role="progressbar"
        aria-label="Progression de la commande"
        aria-valuemin={1}
        aria-valuemax={ETAPES.length}
        aria-valuenow={etape + 1}
      >
        <div
          className="h-full rounded-full bg-terre transition-[width] duration-500"
          style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }}
        />
      </div>
      <ol className="mt-3 hidden grid-cols-4 gap-2 text-sm sm:grid">
        {ETAPES.map((titre, i) => (
          <li
            key={titre}
            aria-current={i === etape ? "step" : undefined}
            className={`flex items-center gap-2 ${i === etape ? "font-semibold text-anthracite" : i < etape ? "text-anthracite" : "text-taupe-fonce"}`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${i < etape ? "bg-anthracite text-creme" : i === etape ? "bg-terre text-white" : "border border-taupe"}`}
              aria-hidden="true"
            >
              {i < etape ? <Icone nom="coche" className="size-3.5" /> : i + 1}
            </span>
            {titre}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TunnelCommande({ paiementEnLigne }: { paiementEnLigne: boolean }) {
  const router = useRouter();
  const recherche = useSearchParams();
  const paiementAnnule = recherche.get("paiement") === "annule";
  const { lignes, pret, vider } = usePanier();

  const [etape, setEtape] = useState(0);
  const [coordonnees, setCoordonnees] = useState<Coordonnees>({ prenom: "", nom: "", email: "", telephone: "" });
  const [adresse, setAdresse] = useState<AdresseLivraison>({
    adresse: "",
    complement: "",
    codePostal: "",
    ville: "",
    zone: "",
    pays: "",
  });
  const [mode, setMode] = useState<ModeLivraison | "">("");
  const [message, setMessage] = useState("");
  const [cgv, setCgv] = useState(false);
  const [piege, setPiege] = useState("");
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const titreRef = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);

  // Au changement d'étape, le focus va sur le titre (lecteurs d'écran, clavier).
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    titreRef.current?.focus();
    titreRef.current?.scrollIntoView({ block: "start" });
  }, [etape]);

  if (!pret) {
    return <div className="h-96 animate-pulse rounded-sm bg-sable" aria-busy="true" />;
  }

  const panier = resoudrePanier(lignes);
  if (panier.lignes.length === 0) {
    return (
      <div className="rounded-sm bg-sable px-6 py-14 text-center">
        <p className="font-serif text-3xl">Votre panier est vide</p>
        <p className="mt-2 text-taupe-fonce">Ajoutez des pierres ou des échantillons pour passer commande.</p>
        <LienBouton href="/pierres" className="mt-6">
          Voir les pierres
        </LienBouton>
      </div>
    );
  }

  const modes = modesDisponibles(panier);
  const zone = adresse.zone as ZoneLivraison;
  const modeValide = mode !== "" && modes.includes(mode) ? mode : "";
  const frais = adresse.zone && modeValide ? calculerFraisLivraison(panier, zone, modeValide) : null;
  const total = panier.sousTotal + (frais?.montant ?? 0);
  const payerEnLigne = paiementEnLigne && frais?.statut === "calcule";

  function focusPremiereErreur() {
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[aria-invalid='true'], [data-erreur='true']")?.focus();
    });
  }

  function suivant(e: FormEvent) {
    e.preventDefault();
    let nouvelles: Erreurs = {};
    if (etape === 0) nouvelles = validerCoordonnees(coordonnees);
    if (etape === 1) nouvelles = validerAdresse(adresse);
    if (etape === 2 && !modeValide) nouvelles = { mode: "Choisissez un mode de livraison." };
    setErreurs(nouvelles);
    if (!aucuneErreur(nouvelles)) {
      focusPremiereErreur();
      return;
    }
    setEtape((x) => x + 1);
  }

  async function confirmer(e: FormEvent) {
    e.preventDefault();
    setErreurEnvoi(null);
    if (!cgv) {
      setErreurs({ cgv: "Cochez cette case pour accepter les conditions générales de vente." });
      focusPremiereErreur();
      return;
    }
    setErreurs({});
    setEnvoi(true);
    const corps = { lignes, coordonnees, adresse, mode: modeValide, message, cgv, site: piege };
    try {
      const reponse = await fetch(payerEnLigne ? "/api/checkout" : "/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      const donnees = (await reponse.json().catch(() => ({}))) as { url?: string; reference?: string; erreur?: string };
      if (!reponse.ok) throw new Error(donnees.erreur || "Une erreur est survenue.");
      if (payerEnLigne && donnees.url) {
        window.location.assign(donnees.url);
        return;
      }
      vider();
      router.push(`/commande/confirmation?ref=${encodeURIComponent(donnees.reference ?? "")}`);
    } catch (erreur) {
      setErreurEnvoi(erreur instanceof Error ? erreur.message : "Une erreur est survenue.");
      setEnvoi(false);
    }
  }

  const titre = ETAPES[etape];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div>
        {paiementAnnule && etape === 0 && (
          <p className="mb-6 rounded-sm bg-sable px-4 py-3 text-sm">
            Le paiement a été annulé : votre panier est conservé, vous pouvez reprendre votre commande.
          </p>
        )}
        <BarreProgression etape={etape} />
        <h2 ref={titreRef} tabIndex={-1} className="scroll-mt-28 text-3xl outline-none sm:text-4xl">
          {titre}
        </h2>

        {etape === 0 && (
          <form onSubmit={suivant} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
            <Champ
              label="Prénom"
              autoComplete="given-name"
              value={coordonnees.prenom}
              onChange={(e) => setCoordonnees({ ...coordonnees, prenom: e.target.value })}
              erreur={erreurs.prenom}
            />
            <Champ
              label="Nom"
              autoComplete="family-name"
              value={coordonnees.nom}
              onChange={(e) => setCoordonnees({ ...coordonnees, nom: e.target.value })}
              erreur={erreurs.nom}
            />
            <Champ
              label="E-mail"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={coordonnees.email}
              onChange={(e) => setCoordonnees({ ...coordonnees, email: e.target.value })}
              erreur={erreurs.email}
              aide="Pour vous envoyer le récapitulatif de commande."
            />
            <Champ
              label="Téléphone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={coordonnees.telephone}
              onChange={(e) => setCoordonnees({ ...coordonnees, telephone: e.target.value })}
              erreur={erreurs.telephone}
              aide="Nous vous appelons pour organiser la livraison."
            />
            <div className="sm:col-span-2">
              <Bouton type="submit" taille="grand" className="w-full sm:w-auto">
                Continuer
                <Icone nom="fleche" className="size-5" />
              </Bouton>
            </div>
          </form>
        )}

        {etape === 1 && (
          <form onSubmit={suivant} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
            <ChampListe
              label="Zone de livraison"
              className="sm:col-span-2"
              value={adresse.zone}
              onChange={(e) => setAdresse({ ...adresse, zone: e.target.value as ZoneLivraison | "" })}
              erreur={erreurs.zone}
            >
              <option value="">Choisissez…</option>
              {(Object.keys(ZONES) as ZoneLivraison[]).map((z) => (
                <option key={z} value={z}>
                  {ZONES[z].label}
                </option>
              ))}
            </ChampListe>
            {adresse.zone === "europe" && (
              <div className="sm:col-span-2">
                <p className="mb-4 flex gap-2 rounded-sm bg-sable px-4 py-3 text-sm">
                  <Icone nom="info" className="size-5 shrink-0 text-terre-fonce" />
                  Devis de livraison sous 24 h : vous pouvez envoyer votre commande, nous vous recontactons avec le
                  prix de la livraison avant tout paiement.
                </p>
                <Champ
                  label="Pays"
                  autoComplete="country-name"
                  value={adresse.pays}
                  onChange={(e) => setAdresse({ ...adresse, pays: e.target.value })}
                  erreur={erreurs.pays}
                />
              </div>
            )}
            <Champ
              label="Adresse"
              className="sm:col-span-2"
              autoComplete="address-line1"
              value={adresse.adresse}
              onChange={(e) => setAdresse({ ...adresse, adresse: e.target.value })}
              erreur={erreurs.adresse}
            />
            <Champ
              label="Complément d'adresse"
              facultatif
              className="sm:col-span-2"
              autoComplete="address-line2"
              value={adresse.complement}
              onChange={(e) => setAdresse({ ...adresse, complement: e.target.value })}
            />
            <Champ
              label="Code postal"
              autoComplete="postal-code"
              inputMode={adresse.zone === "europe" ? "text" : "numeric"}
              value={adresse.codePostal}
              onChange={(e) => setAdresse({ ...adresse, codePostal: e.target.value })}
              erreur={erreurs.codePostal}
            />
            <Champ
              label="Ville"
              autoComplete="address-level2"
              value={adresse.ville}
              onChange={(e) => setAdresse({ ...adresse, ville: e.target.value })}
              erreur={erreurs.ville}
            />
            <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row">
              <Bouton variante="secondaire" taille="grand" onClick={() => setEtape(0)}>
                Retour
              </Bouton>
              <Bouton type="submit" taille="grand">
                Continuer
                <Icone nom="fleche" className="size-5" />
              </Bouton>
            </div>
          </form>
        )}

        {etape === 2 && (
          <form onSubmit={suivant} noValidate className="mt-6">
            <fieldset aria-describedby={erreurs.mode ? "erreur-mode" : undefined}>
              <legend className="sr-only">Mode de livraison</legend>
              <div className="grid gap-3">
                {modes.map((m) => {
                  const f = calculerFraisLivraison(panier, zone, m);
                  const choisi = modeValide === m;
                  return (
                    <label
                      key={m}
                      className={`flex cursor-pointer gap-4 rounded-sm border p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terre-fonce ${choisi ? "border-anthracite bg-sable" : "border-greige bg-blanc hover:border-taupe"}`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={m}
                        checked={choisi}
                        onChange={() => setMode(m)}
                        data-erreur={erreurs.mode && m === modes[0] ? "true" : undefined}
                        className="mt-1 size-5 shrink-0 accent-terre"
                      />
                      <span className="flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className="font-semibold">{MODES[m].label}</span>
                          <span className={f.montant === null ? "text-sm text-terre-fonce" : "font-semibold"}>
                            {libelleFrais(f)}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-taupe-fonce">{MODES[m].description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {erreurs.mode && (
                <p id="erreur-mode" className="mt-2 text-sm font-medium text-erreur">
                  {erreurs.mode}
                </p>
              )}
            </fieldset>
            {panier.poidsTotalKg === null && !ZONES[zone].surDevis && (
              <p className="mt-4 flex gap-2 text-sm text-taupe-fonce">
                <Icone nom="info" className="size-5 shrink-0" />
                Le poids de certains produits reste à confirmer : nous calculons vos frais de livraison et vous les
                communiquons sous 24 h, avant tout paiement.
              </p>
            )}
            <ChampTexte
              label="Précisions pour la livraison"
              facultatif
              className="mt-6"
              rows={3}
              placeholder="Accès au chantier, rue étroite, portail, créneau souhaité…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
            />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <Bouton variante="secondaire" taille="grand" onClick={() => setEtape(1)}>
                Retour
              </Bouton>
              <Bouton type="submit" taille="grand">
                Voir le récapitulatif
                <Icone nom="fleche" className="size-5" />
              </Bouton>
            </div>
          </form>
        )}

        {etape === 3 && frais && modeValide && (
          <form onSubmit={confirmer} noValidate className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-greige bg-blanc p-4 text-sm">
                <p className="mb-2 flex items-center justify-between font-semibold">
                  Coordonnées
                  <button type="button" onClick={() => setEtape(0)} className="text-terre-fonce underline underline-offset-4">
                    Modifier<span className="sr-only"> les coordonnées</span>
                  </button>
                </p>
                <p>
                  {coordonnees.prenom} {coordonnees.nom}
                </p>
                <p className="break-all">{coordonnees.email}</p>
                <p>{coordonnees.telephone}</p>
              </div>
              <div className="rounded-sm border border-greige bg-blanc p-4 text-sm">
                <p className="mb-2 flex items-center justify-between font-semibold">
                  Adresse
                  <button type="button" onClick={() => setEtape(1)} className="text-terre-fonce underline underline-offset-4">
                    Modifier<span className="sr-only"> l&apos;adresse</span>
                  </button>
                </p>
                <p>{adresse.adresse}</p>
                {adresse.complement && <p>{adresse.complement}</p>}
                <p>
                  {adresse.codePostal} {adresse.ville}
                </p>
                <p>
                  {ZONES[zone].label}
                  {zone === "europe" ? ` — ${adresse.pays}` : ""}
                </p>
              </div>
              <div className="rounded-sm border border-greige bg-blanc p-4 text-sm">
                <p className="mb-2 flex items-center justify-between font-semibold">
                  Livraison
                  <button type="button" onClick={() => setEtape(2)} className="text-terre-fonce underline underline-offset-4">
                    Modifier<span className="sr-only"> le mode de livraison</span>
                  </button>
                </p>
                <p>{MODES[modeValide].label}</p>
                <p className="mt-1 font-medium">{libelleFrais(frais)}</p>
              </div>
            </div>

            <div className="rounded-sm border border-greige bg-blanc">
              <ul className="divide-y divide-greige/70">
                {panier.lignes.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4 p-4 text-sm">
                    <div>
                      <p className="font-medium">{l.nom}</p>
                      {l.details.map((d) => (
                        <p key={d} className="text-taupe-fonce">
                          {d}
                        </p>
                      ))}
                      <p className="text-taupe-fonce">
                        {formatNombre(l.quantite)} {l.libelleUnite} × {formatPrix(l.prixUnitaire)}
                      </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">{formatPrix(l.total)}</p>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 border-t border-greige p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt>Sous-total TTC</dt>
                  <dd>{formatPrix(panier.sousTotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Livraison</dt>
                  <dd className="text-right">{libelleFrais(frais)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-greige pt-3 text-base font-semibold">
                  <dt>Total TTC{frais.montant === null ? " (hors livraison)" : ""}</dt>
                  <dd>{formatPrix(total)}</dd>
                </div>
              </dl>
            </div>

            {!payerEnLigne && (
              <p className="flex gap-3 rounded-sm bg-sable px-4 py-3 text-sm">
                <Icone nom="telephone" className="size-5 shrink-0 text-terre-fonce" />
                <span>
                  Aucun paiement n&apos;est demandé maintenant. En confirmant, vous nous envoyez votre commande : nous
                  vous recontactons sous 24 h pour valider la livraison et le paiement.
                </span>
              </p>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={cgv}
                  onChange={(e) => {
                    setCgv(e.target.checked);
                    setErreurs({});
                  }}
                  aria-invalid={erreurs.cgv ? true : undefined}
                  aria-describedby={erreurs.cgv ? "erreur-cgv" : undefined}
                  required
                  className="mt-0.5 size-5 shrink-0 accent-terre"
                />
                <span className="text-sm">
                  J&apos;accepte les{" "}
                  <Link href="/cgv" target="_blank" className="text-terre-fonce underline underline-offset-4">
                    conditions générales de vente
                    <span className="sr-only"> (nouvel onglet)</span>
                  </Link>
                  .
                </span>
              </label>
              {erreurs.cgv && (
                <p id="erreur-cgv" className="mt-2 pl-8 text-sm font-medium text-erreur">
                  {erreurs.cgv}
                </p>
              )}
            </div>

            <ChampPiege valeur={piege} onChange={setPiege} />

            {erreurEnvoi && (
              <p role="alert" className="rounded-sm border border-erreur/40 bg-erreur/5 px-4 py-3 text-sm text-erreur">
                {erreurEnvoi}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Bouton variante="secondaire" taille="grand" onClick={() => setEtape(2)} disabled={envoi}>
                Retour
              </Bouton>
              <Bouton type="submit" taille="grand" disabled={envoi} className="sm:min-w-72">
                {envoi ? (
                  "Envoi en cours…"
                ) : payerEnLigne ? (
                  <>
                    <Icone nom="cadenas" className="size-5" />
                    Payer {formatPrix(total)} par carte
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </Bouton>
            </div>
            {payerEnLigne && (
              <p className="text-xs text-taupe-fonce">
                Paiement sécurisé par Stripe : vos coordonnées bancaires ne transitent pas par notre site.
              </p>
            )}
          </form>
        )}
      </div>

      <aside className="rounded-sm border border-greige bg-blanc p-5 lg:sticky lg:top-28" aria-label="Votre panier">
        <p className="flex items-center justify-between font-serif text-2xl">
          Votre panier
          <Link href="/panier" className="font-sans text-sm text-terre-fonce underline underline-offset-4">
            Modifier
          </Link>
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {panier.lignes.map((l) => (
            <li key={l.id} className="flex justify-between gap-3">
              <span>
                {l.nom}
                <span className="text-taupe-fonce">
                  {" "}
                  · {formatNombre(l.quantite)} {l.libelleUnite}
                </span>
              </span>
              <span className="whitespace-nowrap">{formatPrix(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-greige pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Sous-total TTC</dt>
            <dd className="font-semibold">{formatPrix(panier.sousTotal)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-taupe-fonce">
            <dt>Livraison</dt>
            <dd className="text-right">{frais ? libelleFrais(frais) : "Choisie à l'étape 3"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
