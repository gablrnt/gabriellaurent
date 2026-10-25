import type { Metadata } from "next";
import { AppelEchantillons } from "@/components/sections/AppelEchantillons";
import { GrilleRealisations } from "@/components/sections/GrilleRealisations";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { PRODUITS } from "@/data/produits";
import { REALISATIONS } from "@/data/realisations";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Piscines, terrasses, entrées et allées : découvrez des chantiers réels réalisés avec les pierres naturelles ART & STONE, de Saint-Tropez à Ramatuelle.",
  alternates: { canonical: "/realisations" },
  openGraph: { title: "Réalisations | ART & STONE", url: "/realisations" },
};

export default function PageRealisations() {
  const produits = Object.fromEntries(PRODUITS.map((p) => [p.slug, { slug: p.slug, nom: p.nom }]));
  return (
    <>
      <EnTetePage
        titre="Nos réalisations"
        surtitre="Chantiers réels"
        intro={
          <>
            Des pierres posées chez nos clients, photographiées sur place. Pour voir ce que nos clients en disent,{" "}
            <a
              href={SITE.avisGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-terre-fonce underline underline-offset-4"
            >
              consultez nos avis Google<span className="sr-only"> (nouvel onglet)</span>
            </a>
            .
          </>
        }
        fil={[{ label: "Réalisations" }]}
      />
      <section className="conteneur py-12 sm:py-16">
        <GrilleRealisations realisations={REALISATIONS} produits={produits} />
      </section>
      <AppelEchantillons />
    </>
  );
}
