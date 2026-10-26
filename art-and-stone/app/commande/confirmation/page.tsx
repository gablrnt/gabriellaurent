import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/commande/Confirmation";
import { LienBouton } from "@/components/ui/Bouton";
import { Icone } from "@/components/ui/Icone";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Commande envoyée",
  robots: { index: false, follow: false },
};

export default function PageConfirmation() {
  return (
    <div className="conteneur max-w-3xl py-16 text-center sm:py-24">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-succes/10 text-succes">
        <Icone nom="coche" className="size-8" />
      </span>
      <h1 className="mt-6 text-4xl sm:text-5xl">Merci, votre commande est envoyée</h1>
      <Suspense fallback={null}>
        <Confirmation />
      </Suspense>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
        Nous vous recontactons sous 24 h pour valider la livraison et le paiement.
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
