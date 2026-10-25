import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CarteProduit } from "@/components/produit/CarteProduit";
import { Avis } from "@/components/sections/Avis";
import { Faq } from "@/components/sections/Faq";
import { Reassurance } from "@/components/sections/Reassurance";
import { LienBouton } from "@/components/ui/Bouton";
import { Icone, type NomIcone } from "@/components/ui/Icone";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ } from "@/data/faq";
import { REALISATIONS } from "@/data/realisations";
import { SITE } from "@/data/site";
import { bestSellers } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: { absolute: "ART & STONE — La pierre naturelle, livrée chez vous" },
  description:
    "Dallages, margelles et pierres de jardin en pierre naturelle sélectionnés en carrière. Stock à Tarascon en Provence, échantillons avant d'acheter, livraison partout en France, en Corse et en Suisse.",
  alternates: { canonical: "/" },
};

const PROJETS = [
  {
    titre: "Sol intérieur",
    href: "/sols?usage=interieur",
    image: "https://artandstone.fr/images/dallage_aurelia_greige_vieillie_cuisine.webp",
    alt: "Cuisine au sol en dallage de pierre naturelle greige vieillie",
  },
  {
    titre: "Terrasse & piscine",
    href: "/pierres?usage=terrasse,piscine",
    image: "https://artandstone.fr/images/villa_saint_tropez_piscine_aurelia_beige_1.webp",
    alt: "Terrasse et piscine en pierre naturelle Aurelia Greige dans une villa à Saint-Tropez",
  },
  {
    titre: "Jardin",
    href: "/jardin",
    image: "https://artandstone.fr/images/pas_japonais_xl_aurelia_greige_authentique_1.webp",
    alt: "Pas japonais XL en pierre naturelle Aurelia Greige",
  },
  {
    titre: "Murs",
    href: "/murs",
    image: "https://artandstone.fr/images/parement_rock_face_provencale_facade.webp",
    alt: "Façade habillée de parements en pierre naturelle Rock Face Provençale",
  },
];

const ETAPES: { icone: NomIcone; titre: string; texte: string }[] = [
  {
    icone: "echantillons",
    titre: "Recevez vos échantillons chez vous",
    texte: "3 pierres au choix pour 9,90 €, remboursés sur votre commande. Comparez-les chez vous, à votre lumière.",
  },
  {
    icone: "calculette",
    titre: "Calculez votre surface, on ajoute la marge de coupe",
    texte:
      "Saisissez vos m² ou vos mètres linéaires : le calculateur ajoute 10 % pour les coupes et arrondit pour vous.",
  },
  {
    icone: "camion",
    titre: "Livraison en camion jusque chez vous",
    texte: "Camion avec hayon ou camion grue, en France, en Corse et en Suisse. Ou retrait gratuit à Tarascon.",
  },
];

export default function Accueil() {
  const selection = bestSellers();

  return (
    <>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ART & STONE",
          url: SITE.url,
          telephone: "+33 6 24 27 03 28",
          description: SITE.description,
          sameAs: [SITE.instagram.url, SITE.sitePro],
          address: { "@type": "PostalAddress", addressLocality: "Tarascon", addressCountry: "FR" },
        }}
      />

      {/* 1. Hero */}
      <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden bg-anthracite sm:min-h-[calc(100svh-8rem)]">
        <Image
          src="https://artandstone.fr/images/hero_accueil.webp"
          alt="Réalisation en pierre naturelle ART & STONE"
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-anthracite/85 via-anthracite/45 to-anthracite/15"
        />
        <div className="conteneur pt-24 pb-14 sm:pb-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-creme/90 uppercase">Pierre naturelle · Provence</p>
          <h1 className="mt-4 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
            La pierre naturelle, livrée chez vous
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-creme sm:text-xl">
            Dallages, margelles et pierres de jardin sélectionnés en carrière. Stock en Provence, livraison partout en
            France.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LienBouton href="/pierres" taille="grand">
              Voir les pierres
              <Icone nom="fleche" className="size-5" />
            </LienBouton>
            <LienBouton href="/echantillons" variante="clair" taille="grand">
              Commander des échantillons
            </LienBouton>
          </div>
        </div>
      </section>

      {/* 2. Réassurance */}
      <Reassurance />

      {/* 3. Choisissez votre projet */}
      <section className="conteneur py-16 sm:py-24" aria-labelledby="titre-projets">
        <Reveal>
          <p className="surtitre">Par où commencer ?</p>
          <h2 id="titre-projets" className="mt-2 text-4xl sm:text-5xl">
            Choisissez votre projet
          </h2>
        </Reveal>
        <Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
            {PROJETS.map((p) => (
              <li key={p.titre}>
                <Link
                  href={p.href}
                  className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-sm bg-greige/40 sm:aspect-[5/4] lg:aspect-[16/10]"
                >
                  <ImagePierre
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-anthracite/80 via-anthracite/10 to-transparent"
                  />
                  <span className="relative flex w-full items-center justify-between gap-4 p-5 sm:p-7">
                    <span className="font-serif text-3xl text-white sm:text-4xl">{p.titre}</span>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-creme text-anthracite transition-transform group-hover:translate-x-1">
                      <Icone nom="fleche" className="size-5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 4. Comment ça marche */}
      <section className="bg-sable" aria-labelledby="titre-etapes">
        <div className="conteneur py-16 sm:py-24">
          <Reveal>
            <p className="surtitre">Simple et sans surprise</p>
            <h2 id="titre-etapes" className="mt-2 text-4xl sm:text-5xl">
              Comment ça marche
            </h2>
          </Reveal>
          <Reveal>
            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {ETAPES.map((e, i) => (
                <li key={e.titre} className="relative">
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-6xl leading-none text-terre" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="flex size-12 items-center justify-center rounded-full border border-greige bg-blanc text-terre-fonce">
                      <Icone nom={e.icone} className="size-6" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl">
                    <span className="sr-only">Étape {i + 1} : </span>
                    {e.titre}
                  </h3>
                  <p className="mt-2 leading-relaxed text-anthracite/85">{e.texte}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="mt-10">
            <LienBouton href="/echantillons" variante="secondaire">
              Commencer par les échantillons
            </LienBouton>
          </Reveal>
        </div>
      </section>

      {/* 5. Best-sellers */}
      <section className="conteneur py-16 sm:py-24" aria-labelledby="titre-selection">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="surtitre">Les plus demandées</p>
            <h2 id="titre-selection" className="mt-2 text-4xl sm:text-5xl">
              Nos best-sellers
            </h2>
          </div>
          <Link
            href="/pierres"
            className="inline-flex items-center gap-2 font-medium text-terre-fonce underline-offset-4 hover:underline"
          >
            Toutes les pierres <Icone nom="fleche" className="size-4" />
          </Link>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:gap-x-8">
          {selection.map((p) => (
            <li key={p.slug}>
              <CarteProduit produit={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Réalisations + avis */}
      <section className="bg-anthracite text-creme" aria-labelledby="titre-realisations">
        <div className="conteneur py-16 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-greige uppercase">Chantiers réels</p>
              <h2 id="titre-realisations" className="mt-2 text-4xl text-white sm:text-5xl">
                Nos réalisations
              </h2>
            </div>
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 font-medium text-white underline-offset-4 hover:underline"
            >
              Voir toutes les réalisations <Icone nom="fleche" className="size-4" />
            </Link>
          </Reveal>
          <Reveal>
            <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {REALISATIONS.slice(0, 4).map((r) => (
                <li key={r.slug}>
                  <Link href={`/realisations#${r.slug}`} className="group block">
                    <span className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-taupe/40">
                      <ImagePierre
                        src={r.image.url}
                        alt={r.image.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-3 block font-serif text-xl text-white">{r.titre}</span>
                    {r.lieu && <span className="text-sm text-creme/75">{r.lieu}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-10 rounded-sm bg-creme p-6 text-anthracite sm:p-8">
            <h3 className="text-2xl">Ils nous ont fait confiance</h3>
            <div className="mt-4">
              <Avis />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Entreprise familiale */}
      <section
        className="conteneur grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16"
        aria-labelledby="titre-famille"
      >
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-sm bg-greige/40">
          <ImagePierre
            src="https://artandstone.fr/images/equipe_stock_reel.webp"
            alt="L'équipe ART & STONE dans le stock de pierres à Tarascon"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal>
          <p className="surtitre">Qui sommes-nous</p>
          <h2 id="titre-famille" className="mt-2 text-4xl sm:text-5xl">
            Une entreprise familiale
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Fournisseur et fabricant de pierre naturelle à Tarascon, nous travaillons avec les professionnels de la
            pierre. Cette boutique ouvre notre stock aux particuliers, avec le même soin.
          </p>
          <ul className="mt-6 space-y-4">
            {[
              {
                icone: "entrepot" as const,
                texte: "Un stock physique à Tarascon : les pierres que vous commandez sont chez nous.",
              },
              {
                icone: "carriere" as const,
                texte: "Nous sélectionnons nous-mêmes les blocs, directement en carrière.",
              },
              { icone: "horloge" as const, texte: "Une question, un devis ? Nous vous répondons sous 24 h." },
            ].map((p) => (
              <li key={p.texte} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sable text-terre-fonce">
                  <Icone nom={p.icone} className="size-5" />
                </span>
                <span className="pt-2">{p.texte}</span>
              </li>
            ))}
          </ul>
          <LienBouton href="/a-propos" variante="secondaire" className="mt-8">
            Découvrir notre histoire
          </LienBouton>
        </Reveal>
      </section>

      {/* 8. FAQ */}
      <section className="bg-sable" aria-labelledby="titre-faq">
        <div className="conteneur grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="surtitre">Questions fréquentes</p>
            <h2 id="titre-faq" className="mt-2 text-4xl sm:text-5xl">
              Vos questions
            </h2>
            <p className="mt-4 leading-relaxed">
              Une autre question ? Appelez-nous au{" "}
              <a href={`tel:${SITE.telephoneLien}`} className="font-semibold underline underline-offset-4">
                {SITE.telephone}
              </a>{" "}
              ou{" "}
              <Link href="/contact" className="font-semibold underline underline-offset-4">
                écrivez-nous
              </Link>
              .
            </p>
          </Reveal>
          <Reveal>
            <Faq questions={FAQ} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
