import type { Metadata } from "next";
import Link from "next/link";
import { PageJuridique } from "@/components/ui/PageJuridique";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site ART & STONE, pierre naturelle à Tarascon.",
  alternates: { canonical: "/mentions-legales" },
};

export default function PageMentionsLegales() {
  return (
    <PageJuridique titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        [Raison sociale] — [forme juridique] au capital de [montant] €
        <br />
        Siège social : [adresse complète]
        <br />
        RCS [ville et numéro] — SIRET [numéro] — TVA intracommunautaire [numéro]
        <br />
        Téléphone : {SITE.telephone} — E-mail : [adresse e-mail]
        <br />
        Directeur de la publication : [nom et prénom]
      </p>

      <h2>Hébergement</h2>
      <p>
        [Nom de l&apos;hébergeur — par exemple Vercel Inc. ou Netlify, Inc.]
        <br />
        [Adresse complète et téléphone de l&apos;hébergeur]
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, photographies, logos, mise en page) est la propriété
        d&apos;ART &amp; STONE ou de ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite.
      </p>

      <h2>Crédits photos</h2>
      <p>
        Photographies : ART &amp; STONE. Les visuels d&apos;ambiance générés par intelligence artificielle sont signalés
        comme tels sur les fiches produits. [À compléter.]
      </p>

      <h2>Données personnelles</h2>
      <p>
        Voir notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </PageJuridique>
  );
}
