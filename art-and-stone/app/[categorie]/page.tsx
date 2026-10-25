import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalogue, CatalogueStatique } from "@/components/catalogue/Catalogue";
import { AppelEchantillons } from "@/components/sections/AppelEchantillons";
import { Reassurance } from "@/components/sections/Reassurance";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { CATEGORIES, type Categorie } from "@/data/produits";
import { estCategorie, produitsDeCategorie } from "@/lib/catalogue";

// Seules les 5 catégories existent : toute autre adresse renvoie une page 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(CATEGORIES) as Categorie[]).map((categorie) => ({ categorie }));
}

const DESCRIPTIONS: Record<Categorie, string> = {
  sols: "Dallages en pierre naturelle pour l'intérieur et la terrasse : finitions vieillie, sablée brossée ou brossée, tons crème, greige et gris. Calcul de quantité et livraison partout en France.",
  piscine:
    "Margelles de piscine en pierre naturelle, au mètre linéaire, avec choix du profil de nez. Stock à Tarascon, livraison en France, en Corse et en Suisse.",
  jardin:
    "Pas japonais et couvertines en pierre naturelle pour le jardin. Stock en Provence, livraison partout en France.",
  murs: "Parements muraux en pierre naturelle éclatée pour façades et murs intérieurs. Stock à Tarascon, livraison partout en France.",
  entretien:
    "Produits de protection et d'entretien de la pierre naturelle : Protect Pierre Base et Finish, Clean Pro antimousse, Decap Pro. Calcul du nombre de bidons.",
};

export async function generateMetadata({ params }: PageProps<"/[categorie]">): Promise<Metadata> {
  const { categorie } = await params;
  if (!estCategorie(categorie)) return {};
  const c = CATEGORIES[categorie];
  return {
    title: c.titre,
    description: DESCRIPTIONS[categorie],
    alternates: { canonical: `/${categorie}` },
    openGraph: {
      title: `${c.titre} | ART & STONE`,
      description: DESCRIPTIONS[categorie],
      url: `/${categorie}`,
      images: [{ url: c.image, alt: c.imageAlt }],
    },
  };
}

export default async function PageCategorie({ params }: PageProps<"/[categorie]">) {
  const { categorie } = await params;
  if (!estCategorie(categorie)) notFound();
  const c = CATEGORIES[categorie];
  const produits = produitsDeCategorie(categorie);

  return (
    <>
      <EnTetePage titre={c.titre} surtitre={c.nom} intro={c.intro} fil={[{ label: c.nom }]} />
      <section className="conteneur py-10 sm:py-14">
        <Suspense fallback={<CatalogueStatique produits={produits} />}>
          <Catalogue produits={produits} />
        </Suspense>
      </section>
      <Reassurance />
      {categorie !== "entretien" && <AppelEchantillons />}
    </>
  );
}
