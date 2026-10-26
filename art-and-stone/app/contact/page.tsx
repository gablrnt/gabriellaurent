import type { Metadata } from "next";
import { FormulaireContact } from "@/components/sections/FormulaireContact";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { Icone } from "@/components/ui/Icone";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Une question sur une pierre, des échantillons ou la livraison ? Appelez ART & STONE au ${SITE.telephone} ou écrivez-nous : réponse sous 24 h.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | ART & STONE", url: "/contact" },
};

export default function PageContact() {
  return (
    <>
      <EnTetePage
        titre="Parlons de votre projet"
        surtitre="Contact"
        intro="Une question sur une pierre, une quantité, la livraison ? Nous vous répondons sous 24 h."
        fil={[{ label: "Contact" }]}
      />
      <section className="conteneur grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-6">
          <div className="rounded-sm bg-anthracite p-6 text-creme">
            <p className="text-xs font-semibold tracking-[0.18em] text-greige uppercase">Par téléphone</p>
            <a
              href={`tel:${SITE.telephoneLien}`}
              className="mt-3 flex items-center gap-3 font-serif text-3xl text-white hover:underline"
            >
              <Icone nom="telephone" className="size-6 text-greige" />
              {SITE.telephone}
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm text-creme/85">
              <Icone nom="horloge" className="size-4" />
              {SITE.horaires}
            </p>
          </div>
          <div className="rounded-sm border border-greige bg-blanc p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-taupe-fonce uppercase">Notre stock</p>
            <p className="mt-2 font-medium">ART &amp; STONE — {SITE.ville}</p>
            <p className="mt-1 text-sm text-taupe-fonce">
              Retrait des commandes sur rendez-vous convenu par téléphone.
            </p>
          </div>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-sm border border-greige bg-blanc p-6 hover:border-taupe"
          >
            <Icone nom="instagram" className="size-6 text-terre-fonce" />
            <span>
              <span className="block text-sm text-taupe-fonce">Suivez-nous sur Instagram</span>
              <span className="font-medium">{SITE.instagram.compte}</span>
            </span>
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </aside>
        <div>
          <h2 className="mb-6 text-3xl sm:text-4xl">Écrivez-nous</h2>
          <FormulaireContact />
        </div>
      </section>
    </>
  );
}
