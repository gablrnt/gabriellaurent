import type { Metadata } from "next";
import { PageJuridique } from "@/components/ui/PageJuridique";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment ART & STONE collecte et protège vos données personnelles.",
  alternates: { canonical: "/confidentialite" },
};

export default function PageConfidentialite() {
  return (
    <PageJuridique titre="Politique de confidentialité">
      <p>Dernière mise à jour : [date].</p>

      <h2>Responsable du traitement</h2>
      <p>[Raison sociale], [adresse complète] — Téléphone : {SITE.telephone} — E-mail : [adresse e-mail].</p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Formulaire de contact</strong> : nom, adresse e-mail, téléphone (facultatif), sujet et message.
        </li>
        <li>
          <strong>Commande</strong> : prénom, nom, adresse e-mail, téléphone, adresse de livraison, contenu de la
          commande et précisions de livraison.
        </li>
        <li>
          <strong>Paiement</strong> : les paiements par carte sont traités directement par Stripe ; ART &amp; STONE
          n&apos;a jamais accès à vos coordonnées bancaires.
        </li>
      </ul>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Traiter et livrer vos commandes (exécution du contrat).</li>
        <li>Répondre à vos demandes de contact (intérêt légitime ou mesures précontractuelles).</li>
        <li>Respecter nos obligations comptables et fiscales (obligation légale).</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Vos données sont destinées à ART &amp; STONE et, pour les besoins strictement nécessaires, à ses prestataires :
        hébergement du site [nom de l&apos;hébergeur], envoi des e-mails (Resend), paiement (Stripe) et transporteurs
        pour la livraison. [À compléter et vérifier les transferts hors Union européenne.]
      </p>

      <h2>Durée de conservation</h2>
      <p>
        [À préciser : par exemple, données de contact conservées 3 ans après le dernier échange ; données de commande
        conservées pendant la durée légale de conservation des pièces comptables.]
      </p>

      <h2>Panier et cookies</h2>
      <p>
        Le contenu de votre panier est enregistré uniquement dans votre navigateur (stockage local), pour que vous le
        retrouviez à votre prochaine visite. Le site n&apos;utilise pas de cookie publicitaire ni de mesure
        d&apos;audience. Lors d&apos;un paiement, Stripe peut déposer ses propres cookies, nécessaires à la sécurité de
        la transaction. [À mettre à jour si un outil de mesure d&apos;audience est ajouté.]
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de
        limitation et de portabilité de vos données. Pour l&apos;exercer, écrivez-nous à [adresse e-mail]. Vous pouvez
        également adresser une réclamation à la CNIL (www.cnil.fr).
      </p>
    </PageJuridique>
  );
}
