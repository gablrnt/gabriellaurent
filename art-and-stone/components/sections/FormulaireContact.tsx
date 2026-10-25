"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Bouton } from "@/components/ui/Bouton";
import { Champ, ChampListe, ChampPiege, ChampTexte } from "@/components/ui/Champ";
import { Icone } from "@/components/ui/Icone";
import {
  SUJETS_CONTACT,
  aucuneErreur,
  validerContact,
  type DonneesContact,
  type Erreurs,
  type SujetContact,
} from "@/lib/validation";

const VIDE: DonneesContact = { nom: "", email: "", telephone: "", sujet: "", message: "" };

export function FormulaireContact() {
  const [donnees, setDonnees] = useState<DonneesContact>(VIDE);
  const [erreurs, setErreurs] = useState<Erreurs<keyof DonneesContact>>({});
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);

  const maj = (champ: keyof DonneesContact) => (valeur: string) => setDonnees((d) => ({ ...d, [champ]: valeur }));

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setErreurEnvoi(null);
    const propres = { ...donnees, nom: donnees.nom.trim(), email: donnees.email.trim(), message: donnees.message.trim() };
    const nouvelles = validerContact(propres);
    setErreurs(nouvelles);
    if (!aucuneErreur(nouvelles)) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setEtat("envoi");
    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...propres, site: piege }),
      });
      const resultat = (await reponse.json().catch(() => ({}))) as { erreur?: string };
      if (!reponse.ok) throw new Error(resultat.erreur || "Une erreur est survenue.");
      setEtat("envoye");
      setDonnees(VIDE);
    } catch (erreur) {
      setErreurEnvoi(erreur instanceof Error ? erreur.message : "Une erreur est survenue.");
      setEtat("saisie");
    }
  }

  if (etat === "envoye") {
    return (
      <div role="status" className="rounded-sm bg-succes/10 p-6 text-center">
        <Icone nom="coche" className="mx-auto size-10 text-succes" />
        <p className="mt-3 font-serif text-3xl">Merci, votre message est envoyé</p>
        <p className="mt-2">Nous vous répondons sous 24 h.</p>
        <button
          type="button"
          onClick={() => setEtat("saisie")}
          className="mt-4 text-sm text-terre-fonce underline underline-offset-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <Champ
        label="Nom"
        autoComplete="name"
        value={donnees.nom}
        onChange={(e) => maj("nom")(e.target.value)}
        erreur={erreurs.nom}
      />
      <Champ
        label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={donnees.email}
        onChange={(e) => maj("email")(e.target.value)}
        erreur={erreurs.email}
      />
      <Champ
        label="Téléphone"
        facultatif
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={donnees.telephone}
        onChange={(e) => maj("telephone")(e.target.value)}
        erreur={erreurs.telephone}
        aide="Pratique si vous préférez qu'on vous rappelle."
      />
      <ChampListe
        label="Sujet"
        value={donnees.sujet}
        onChange={(e) => maj("sujet")(e.target.value as SujetContact)}
        erreur={erreurs.sujet}
      >
        <option value="">Choisissez…</option>
        {(Object.keys(SUJETS_CONTACT) as SujetContact[]).map((s) => (
          <option key={s} value={s}>
            {SUJETS_CONTACT[s]}
          </option>
        ))}
      </ChampListe>
      <ChampTexte
        label="Message"
        className="sm:col-span-2"
        rows={6}
        value={donnees.message}
        onChange={(e) => maj("message")(e.target.value)}
        erreur={erreurs.message}
        maxLength={5000}
        placeholder="Votre projet, la surface, la pierre qui vous intéresse…"
      />
      <ChampPiege valeur={piege} onChange={setPiege} />
      {erreurEnvoi && (
        <p role="alert" className="rounded-sm border border-erreur/40 bg-erreur/5 px-4 py-3 text-sm text-erreur sm:col-span-2">
          {erreurEnvoi}
        </p>
      )}
      <div className="sm:col-span-2">
        <Bouton type="submit" taille="grand" disabled={etat === "envoi"} className="w-full sm:w-auto">
          {etat === "envoi" ? "Envoi en cours…" : "Envoyer mon message"}
        </Bouton>
        <p className="mt-3 text-xs text-taupe-fonce">
          Vos informations servent uniquement à vous répondre. Voir notre{" "}
          <Link href="/confidentialite" className="underline underline-offset-4">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
