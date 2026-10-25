import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue, CatalogueStatique } from "@/components/catalogue/Catalogue";
import { AppelEchantillons } from "@/components/sections/AppelEchantillons";
import { Reassurance } from "@/components/sections/Reassurance";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { pierres } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Toutes les pierres naturelles",
  description:
    "Dallages, margelles, pas japonais, couvertines et parements en pierre naturelle. Filtrez par usage, teinte et finition. Stock à Tarascon, livraison partout en France.",
  alternates: { canonical: "/pierres" },
  openGraph: { title: "Toutes les pierres naturelles | ART & STONE", url: "/pierres" },
};

export default function PagePierres() {
  const produits = pierres();
  return (
    <>
      <EnTetePage
        titre="Toutes les pierres"
        surtitre="Catalogue"
        intro="Choisissez votre pierre selon l'endroit où elle sera posée, la teinte et la finition qui vous plaisent. Chaque filtre est expliqué en une phrase."
        fil={[{ label: "Toutes les pierres" }]}
      />
      <section className="conteneur py-10 sm:py-14">
        <Suspense fallback={<CatalogueStatique produits={produits} />}>
          <Catalogue produits={produits} />
        </Suspense>
      </section>
      <Reassurance />
      <AppelEchantillons />
    </>
  );
}
