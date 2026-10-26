import type { Metadata } from "next";
import Link from "next/link";
import { AppelEchantillons } from "@/components/sections/AppelEchantillons";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { Icone } from "@/components/ui/Icone";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Conseils de pose et d'entretien",
  description:
    "Poser et entretenir une pierre naturelle, expliqué simplement : support, joints, colle, pente, DTU, nettoyage au savon doux et protection.",
  alternates: { canonical: "/conseils" },
  openGraph: { title: "Conseils de pose et d'entretien | ART & STONE", url: "/conseils" },
};

function Conseil({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 rounded-sm border border-greige bg-blanc p-5">
      <Icone nom="coche" className="mt-1 size-5 shrink-0 text-terre-fonce" />
      <div>
        <h3 className="font-sans text-base font-semibold">{titre}</h3>
        <div className="mt-1 leading-relaxed text-anthracite/90">{children}</div>
      </div>
    </li>
  );
}

export default function PageConseils() {
  return (
    <>
      <EnTetePage
        titre="Conseils de pose et d'entretien"
        surtitre="Conseils"
        intro="L'essentiel pour réussir la pose de votre pierre naturelle et la garder belle longtemps, sans jargon."
        fil={[{ label: "Conseils" }]}
      >
        <nav aria-label="Sommaire" className="mt-6 flex flex-wrap gap-3">
          <a
            href="#pose"
            className="rounded-full border border-anthracite/70 px-4 py-2 text-sm hover:bg-anthracite hover:text-creme"
          >
            La pose
          </a>
          <a
            href="#entretien"
            className="rounded-full border border-anthracite/70 px-4 py-2 text-sm hover:bg-anthracite hover:text-creme"
          >
            L&apos;entretien
          </a>
        </nav>
      </EnTetePage>

      <section id="pose" className="conteneur scroll-mt-28 py-12 sm:py-16" aria-labelledby="titre-pose">
        <h2 id="titre-pose" className="text-4xl sm:text-5xl">
          La pose
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed">
          La pierre naturelle se pose comme un carrelage, avec quelques règles en plus. Voici les points à vérifier avec
          votre poseur.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          <Conseil titre="Un support propre, stable et sec">
            La dalle ou la chape qui reçoit la pierre doit être propre, stable et bien sèche avant la pose.
          </Conseil>
          <Conseil titre="Mélangez les dalles de plusieurs caisses">
            Chaque pierre est unique. En piochant dans plusieurs caisses à la fois, vous répartissez les nuances sur
            toute la surface et évitez les zones plus claires ou plus foncées.
          </Conseil>
          <Conseil titre="Des joints de la bonne largeur">
            De 3 à 6 mm en intérieur. Au minimum 4,5 mm en extérieur.
          </Conseil>
          <Conseil titre="Une colle et des joints adaptés">
            Choisissez une colle et des joints souples, de teinte claire, adaptés à la pierre naturelle.
          </Conseil>
          <Conseil titre="Une pente pour l'eau, en extérieur">
            En terrasse, prévoyez une pente d&apos;au moins 1,5 % pour que l&apos;eau de pluie s&apos;écoule.
          </Conseil>
          <Conseil titre="Faites poser par un professionnel">
            Confiez la pose à un professionnel, qui respectera les règles de l&apos;art : les DTU 52.1 et 52.2.
          </Conseil>
        </ul>
      </section>

      <section id="entretien" className="scroll-mt-28 bg-sable" aria-labelledby="titre-entretien">
        <div className="conteneur py-12 sm:py-16">
          <h2 id="titre-entretien" className="text-4xl sm:text-5xl">
            L&apos;entretien
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed">Une pierre bien protégée s&apos;entretient très simplement.</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            <Conseil titre="Au quotidien : un savon doux">
              Nettoyez avec un savon doux au pH neutre, dilué dans l&apos;eau.
            </Conseil>
            <Conseil titre="Évitez les produits acides">
              Pas de vinaigre, de détartrant ni de nettoyant acide sur la pierre naturelle.
            </Conseil>
            <Conseil titre="Protégez la pierre">
              Appliquez{" "}
              <Link href="/produit/protect-pierre-base" className="text-terre-fonce underline underline-offset-4">
                Protect Pierre Base
              </Link>{" "}
              en première couche, puis{" "}
              <Link href="/produit/protect-pierre-finish" className="text-terre-fonce underline underline-offset-4">
                Protect Pierre Finish
              </Link>{" "}
              en finition.
            </Conseil>
            <Conseil titre="Contre les mousses, en extérieur">
              Utilisez{" "}
              <Link href="/produit/clean-pro" className="text-terre-fonce underline underline-offset-4">
                Clean Pro
              </Link>
              , notre nettoyant antimousse.
            </Conseil>
            <Conseil titre="Après le chantier">
              Nettoyez en profondeur avec{" "}
              <Link href="/produit/decap-pro" className="text-terre-fonce underline underline-offset-4">
                Decap Pro
              </Link>
              .
            </Conseil>
          </ul>
          <p className="mt-8 leading-relaxed">
            Besoin d&apos;un conseil sur votre pierre ? Appelez-nous au{" "}
            <a href={`tel:${SITE.telephoneLien}`} className="font-semibold underline underline-offset-4">
              {SITE.telephone}
            </a>
            .
          </p>
        </div>
      </section>
      <AppelEchantillons />
    </>
  );
}
