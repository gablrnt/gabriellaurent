import type { Metadata } from "next";
import { ViderPanier } from "@/components/panier/ViderPanier";
import { LienBouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { SITE } from "@/data/site";
import { sessionPayee } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Commande envoyée",
  robots: { index: false, follow: false },
};

export default async function PageConfirmation({ searchParams }: PageProps<"/commande/confirmation">) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref.slice(0, 40) : "";
  const sessionId = typeof params.session_id === "string" ? params.session_id : "";
  const viaStripe = sessionId !== "";
  const paye = viaStripe ? await sessionPayee(sessionId) : false;

  return (
    <div className="conteneur max-w-3xl py-16 text-center sm:py-24">
      {(!viaStripe || paye) && <ViderPanier />}
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-succes/10 text-succes">
        <Icone nom="coche" className="size-8" />
      </span>
      <h1 className="mt-6 text-4xl sm:text-5xl">
        {viaStripe ? (paye ? "Merci, votre paiement est confirmé" : "Merci pour votre commande") : "Merci, votre commande est envoyée"}
      </h1>
      {reference && (
        <p className="mt-4 text-taupe-fonce">
          Référence : <strong className="text-anthracite">{reference}</strong>
        </p>
      )}
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
        {viaStripe
          ? paye
            ? "Nous vous recontactons sous 24 h pour organiser la livraison."
            : "Nous vérifions la réception de votre paiement et vous recontactons sous 24 h pour organiser la livraison."
          : "Nous vous recontactons sous 24 h pour valider la livraison et le paiement."}
      </p>
      <p className="mt-4 text-taupe-fonce">
        Une question en attendant ? Appelez-nous au{" "}
        <a href={`tel:${SITE.telephoneLien}`} className="font-semibold text-anthracite underline underline-offset-4">
          {SITE.telephone}
        </a>
        .
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <LienBouton href="/conseils">Lire nos conseils de pose</LienBouton>
        <LienBouton href="/" variante="secondaire">
          Retour à l&apos;accueil
        </LienBouton>
      </div>
    </div>
  );
}
