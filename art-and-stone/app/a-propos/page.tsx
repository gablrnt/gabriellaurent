import type { Metadata } from "next";
import { Reassurance } from "@/components/sections/Reassurance";
import { LienBouton } from "@/components/ui/Bouton";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description:
    "ART & STONE, entreprise familiale fondée par Pablo Dumonceau : stock permanent de pierre naturelle à Tarascon, blocs sélectionnés en carrière, produits introuvables en grande distribution.",
  alternates: { canonical: "/a-propos" },
  openGraph: { title: "Qui sommes-nous ? | ART & STONE", url: "/a-propos" },
};

export default function PageAPropos() {
  return (
    <>
      <EnTetePage
        titre="Une entreprise familiale de pierre naturelle"
        surtitre="Qui sommes-nous ?"
        fil={[{ label: "Qui sommes-nous ?" }]}
      />
      <section className="conteneur grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-greige/40 lg:aspect-auto lg:min-h-[28rem]">
          <ImagePierre
            src="https://artandstone.fr/images/equipe_stock_reel.webp"
            alt="L'équipe ART & STONE dans le stock de pierres à Tarascon"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload
          />
        </div>
        <div className="prose-pierre">
          <p className="text-lg">
            ART &amp; STONE est une entreprise familiale fondée par <strong>Pablo Dumonceau</strong>. Fournisseur et
            fabricant de pierre naturelle, nous travaillons depuis Tarascon, dans les Bouches-du-Rhône.
          </p>
          <h2>Un stock permanent à Tarascon</h2>
          <p>
            Nos pierres sont stockées à Tarascon, près des grands axes routiers et du port de Marseille. Quand vous
            commandez, la pierre est déjà chez nous.
          </p>
          <h2>Des blocs sélectionnés en carrière</h2>
          <p>
            Nous choisissons nous-mêmes les blocs, directement en carrière. C&apos;est ce qui nous permet de vous
            proposer des pierres que vous ne trouverez pas en grande distribution.
          </p>
          <h2>Des professionnels aux particuliers</h2>
          <p>
            Notre site{" "}
            <a href={SITE.sitePro} target="_blank" rel="noopener noreferrer">
              artandstone.fr<span className="sr-only"> (nouvel onglet)</span>
            </a>{" "}
            s&apos;adresse aux professionnels, sur devis. Cette boutique est pensée pour vous, particuliers : des prix
            affichés, des échantillons, un calculateur de quantité et un conseil par téléphone, réponse sous 24 h.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LienBouton href="/pierres">Voir nos pierres</LienBouton>
            <LienBouton href="/contact" variante="secondaire">
              Nous contacter
            </LienBouton>
          </div>
        </div>
      </section>
      <Reassurance />
    </>
  );
}
