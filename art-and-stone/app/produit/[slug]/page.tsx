import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AchatProduit } from "@/components/produit/AchatProduit";
import { PictosUsages } from "@/components/produit/Badges";
import { CarteProduit } from "@/components/produit/CarteProduit";
import { Caracteristiques, Entretien, Livraison, Pose } from "@/components/produit/ContenuOnglets";
import { GalerieProduit } from "@/components/produit/GalerieProduit";
import { PierreVivante } from "@/components/produit/PierreVivante";
import { Prix } from "@/components/produit/Prix";
import { ProtectionAssociee } from "@/components/produit/ProtectionAssociee";
import { SaisieSurfaceProvider } from "@/components/produit/SaisieSurface";
import { Reassurance } from "@/components/sections/Reassurance";
import { FilAriane } from "@/components/ui/FilAriane";
import { Icone } from "@/components/ui/Icone";
import { InfoFinition } from "@/components/ui/InfoFinition";
import { JsonLd } from "@/components/ui/JsonLd";
import { Onglets, type Onglet } from "@/components/ui/Onglets";
import { CATEGORIES, FINITIONS, PRODUITS, SLUGS_PROTECTION, TEINTES } from "@/data/produits";
import { SITE } from "@/data/site";
import { getProduit, produitsDeCategorie } from "@/lib/catalogue";

// Une page statique par produit ; toute autre adresse renvoie une page 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produit = getProduit(slug);
  if (!produit) return {};
  const image = produit.images[0];
  return {
    title: produit.nom,
    description: `${produit.descriptionCourte} Livraison France, Corse et Suisse depuis notre stock de Tarascon.`,
    alternates: { canonical: `/produit/${produit.slug}` },
    openGraph: {
      title: `${produit.nom} | ART & STONE`,
      description: produit.descriptionCourte,
      url: `/produit/${produit.slug}`,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
  };
}

export default async function PageProduit({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const produit = getProduit(slug);
  if (!produit) notFound();

  const categorie = CATEGORIES[produit.categorie];
  const estEntretien = produit.categorie === "entretien";
  const protection = SLUGS_PROTECTION.map((s) => getProduit(s)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined && p.slug !== produit.slug,
  );
  const similaires = produitsDeCategorie(produit.categorie)
    .filter((p) => p.slug !== produit.slug)
    .slice(0, 3);

  const onglets: Onglet[] = [
    { id: "caracteristiques", titre: "Caractéristiques", contenu: <Caracteristiques produit={produit} /> },
    ...(estEntretien ? [] : [{ id: "pose", titre: "Pose", contenu: <Pose produit={produit} /> }]),
    {
      id: "entretien",
      titre: "Entretien",
      contenu: <Entretien avecProtection={protection.length > 0} />,
    },
    { id: "livraison", titre: "Livraison", contenu: <Livraison /> },
  ];

  return (
    <SaisieSurfaceProvider>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: produit.nom,
          description: produit.descriptionCourte,
          image: produit.images.map((i) => i.url),
          sku: produit.slug,
          category: categorie.titre,
          brand: { "@type": "Brand", name: "ART & STONE" },
          ...(produit.finition
            ? {
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Finition", value: FINITIONS[produit.finition].label },
                ],
              }
            : {}),
          offers: {
            "@type": "Offer",
            url: `${SITE.url}/produit/${produit.slug}`,
            priceCurrency: "EUR",
            price: produit.prix.toFixed(2),
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "ART & STONE" },
          },
        }}
      />

      <section className="conteneur pt-6 pb-12 sm:pt-8">
        <FilAriane etapes={[{ label: categorie.nom, href: `/${produit.categorie}` }, { label: produit.nom }]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <GalerieProduit images={produit.images} nom={produit.nom} />
          </div>

          <div>
            <p className="surtitre">{categorie.titre}</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{produit.nom}</h1>
            <p className="mt-4 text-base leading-relaxed sm:text-lg">{produit.descriptionCourte}</p>

            {(produit.teinte || produit.finition) && (
              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {produit.teinte && (
                  <div>
                    <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Teinte</dt>
                    <dd className="mt-1 flex items-center gap-2 font-medium">
                      <span
                        aria-hidden="true"
                        className="size-4 rounded-full border border-anthracite/20"
                        style={{ backgroundColor: TEINTES[produit.teinte].pastille }}
                      />
                      {TEINTES[produit.teinte].label}
                    </dd>
                  </div>
                )}
                {produit.finition && (
                  <div>
                    <dt className="text-xs tracking-wide text-taupe-fonce uppercase">Finition</dt>
                    <dd className="mt-0.5 flex items-center gap-1 font-medium">
                      {FINITIONS[produit.finition].label}
                      <InfoFinition finition={produit.finition} />
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {produit.usages.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs tracking-wide text-taupe-fonce uppercase">Usages recommandés</p>
                <PictosUsages usages={produit.usages} />
              </div>
            )}

            {(produit.antiderapant === true || produit.resistantGel === true) && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {produit.antiderapant === true && (
                  <li className="inline-flex items-center gap-2 rounded-full bg-sable px-3 py-1.5 text-sm">
                    <Icone nom="chaussure" className="size-4.5 text-terre-fonce" />
                    Antidérapant
                  </li>
                )}
                {produit.resistantGel === true && (
                  <li className="inline-flex items-center gap-2 rounded-full bg-sable px-3 py-1.5 text-sm">
                    <Icone nom="flocon" className="size-4.5 text-terre-fonce" />
                    Résistant au gel
                  </li>
                )}
              </ul>
            )}

            <div className="mt-6 border-t border-greige/70 pt-6">
              <Prix produit={produit} taille="grand" />
            </div>

            <div className="mt-6">
              <AchatProduit produit={produit} />
            </div>

            {!estEntretien && (
              <div className="mt-6">
                <PierreVivante />
              </div>
            )}

            <p className="mt-6 flex items-start gap-3 text-sm">
              <Icone nom="telephone" className="mt-0.5 size-5 shrink-0 text-terre-fonce" />
              <span>
                Un doute sur la quantité ou la pierre ? Appelez-nous au{" "}
                <a href={`tel:${SITE.telephoneLien}`} className="font-semibold underline underline-offset-4">
                  {SITE.telephone}
                </a>{" "}
                ({SITE.horaires.toLowerCase()}).
              </span>
            </p>
          </div>
        </div>
      </section>

      {protection.length > 0 && (
        <section id="protection" className="scroll-mt-28 bg-sable" aria-labelledby="titre-protection">
          <div className="conteneur py-12">
            <p className="surtitre">{estEntretien ? "À utiliser avec" : "Produits associés"}</p>
            <h2 id="titre-protection" className="mt-2 text-3xl sm:text-4xl">
              {estEntretien ? "Complétez la protection" : "Protégez votre pierre dès la pose"}
            </h2>
            <div className="mt-6">
              <ProtectionAssociee produits={protection} />
            </div>
          </div>
        </section>
      )}

      <section className="conteneur py-12" aria-label="Informations détaillées">
        <Onglets onglets={onglets} libelle={`Informations sur ${produit.nom}`} />
      </section>

      {similaires.length > 0 && (
        <section className="border-t border-greige/60" aria-labelledby="titre-similaires">
          <div className="conteneur py-12">
            <h2 id="titre-similaires" className="text-3xl sm:text-4xl">
              {estEntretien ? "Les autres produits d'entretien" : "Vous aimerez aussi"}
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
              {similaires.map((p) => (
                <li key={p.slug}>
                  <CarteProduit produit={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Reassurance />
    </SaisieSurfaceProvider>
  );
}
