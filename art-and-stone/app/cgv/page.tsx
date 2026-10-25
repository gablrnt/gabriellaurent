import type { Metadata } from "next";
import Link from "next/link";
import { PageJuridique } from "@/components/ui/PageJuridique";
import { KIT_ECHANTILLONS } from "@/data/produits";
import { SITE } from "@/data/site";
import { formatPrix } from "@/lib/format";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de la boutique en ligne ART & STONE, pierre naturelle pour les particuliers.",
  alternates: { canonical: "/cgv" },
};

export default function PageCGV() {
  return (
    <PageJuridique titre="Conditions générales de vente">
      <p>Dernière mise à jour : [date].</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent aux ventes de pierres naturelles, de
        produits d&apos;entretien et d&apos;échantillons conclues sur le site [adresse du site] entre la société [raison
        sociale] (« ART &amp; STONE ») et toute personne physique agissant en qualité de consommateur (« le client »).
        Toute commande implique l&apos;acceptation sans réserve des présentes CGV.
      </p>

      <h2>2. Vendeur</h2>
      <p>
        [Raison sociale], [forme juridique] au capital de [montant] €, dont le siège est situé [adresse complète] — RCS
        [ville et numéro] — SIRET [numéro] — TVA intracommunautaire [numéro]. Téléphone : {SITE.telephone} — E-mail :
        [adresse e-mail].
      </p>

      <h2>3. Produits</h2>
      <p>
        Les produits sont décrits sur leur fiche avec le plus d&apos;exactitude possible. La pierre naturelle est un
        matériau vivant : variations de teinte, veines, fossiles et petites cavités font partie de sa nature et ne
        constituent pas un défaut. Les photographies sont non contractuelles ; les visuels d&apos;ambiance générés par
        intelligence artificielle sont signalés comme tels. Le client est invité à commander des échantillons avant sa
        commande.
      </p>

      <h2>4. Prix</h2>
      <p>
        Les prix sont indiqués en euros toutes taxes comprises (TTC), dans l&apos;unité du produit (m², mètre linéaire,
        pièce ou bidon), hors frais de livraison. Les prix signalés « prix indicatif » sont confirmés au client avant
        tout paiement. [Préciser le traitement de la TVA pour les livraisons en Suisse et hors Union européenne.]
      </p>

      <h2>5. Commande</h2>
      <p>
        Le client sélectionne ses produits, renseigne ses coordonnées, son adresse et le mode de livraison, puis valide
        sa commande après avoir accepté les présentes CGV. Lorsque les frais de livraison ne peuvent pas être calculés
        en ligne, ART &amp; STONE recontacte le client sous 24 h pour confirmer le montant de la livraison et les
        modalités de paiement ; la vente est conclue après acceptation de ce montant par le client. [À valider.]
      </p>

      <h2>6. Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire via la solution sécurisée Stripe, ou selon les modalités
        convenues avec le client lorsque la commande est confirmée par téléphone [préciser : virement, etc.]. Les
        coordonnées bancaires ne transitent pas par le site d&apos;ART &amp; STONE.
      </p>

      <h2>7. Échantillons</h2>
      <p>
        Le kit de {KIT_ECHANTILLONS.nombre} échantillons est vendu {formatPrix(KIT_ECHANTILLONS.prix)} TTC. Ce montant
        est remboursé sous forme de bon d&apos;achat, déduit d&apos;une commande ultérieure de pierres. [Préciser la
        durée de validité du bon d&apos;achat et ses conditions.]
      </p>

      <h2>8. Livraison</h2>
      <p>
        ART &amp; STONE livre en France continentale, en Corse et en Suisse, par camion avec hayon (dépose au pied du
        camion) ou par camion grue, ou propose le retrait gratuit au stock de Tarascon. Les livraisons vers
        d&apos;autres pays européens font l&apos;objet d&apos;un devis. Les délais sont confirmés au client lors de la
        validation de la commande. Le client s&apos;assure que l&apos;accès au lieu de livraison permet le passage
        d&apos;un poids lourd. [Préciser les conditions d&apos;accès et la procédure si la livraison est impossible.]
      </p>
      <p>
        À la réception, le client vérifie la marchandise en présence du transporteur et porte toute réserve précise sur
        le bon de livraison. [Préciser le délai et la forme de confirmation des réserves auprès du transporteur et
        d&apos;ART &amp; STONE.]
      </p>

      <h2>9. Droit de rétractation</h2>
      <p>
        Conformément au Code de la consommation, le client dispose d&apos;un délai de 14 jours à compter de la réception
        des produits pour exercer son droit de rétractation, sans avoir à motiver sa décision, en informant ART &amp;
        STONE par une déclaration dénuée d&apos;ambiguïté [joindre le formulaire type de rétractation].
      </p>
      <p>
        <strong>
          Les frais de retour sont à la charge du client. La pierre étant lourde, le retour s&apos;effectue par
          transporteur, aux frais du client.
        </strong>{" "}
        Les produits doivent être retournés complets et dans leur état d&apos;origine. ART &amp; STONE rembourse le
        client dans les conditions et délais prévus par la loi.
      </p>
      <p>
        [À valider : exceptions au droit de rétractation, notamment pour les produits confectionnés selon les
        spécifications du client ou nettement personnalisés (découpe sur mesure, etc.).]
      </p>

      <h2>10. Garanties légales</h2>
      <p>
        Le client bénéficie de la garantie légale de conformité (articles L.217-3 et suivants du Code de la
        consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil). [Reproduire les
        mentions légales obligatoires relatives à ces garanties.]
      </p>

      <h2>11. Pose et responsabilité</h2>
      <p>
        La pose n&apos;est pas comprise dans la vente. Les conseils de pose et d&apos;entretien fournis sur le site sont
        donnés à titre indicatif ; ART &amp; STONE recommande de faire poser les produits par un professionnel, dans le
        respect des règles de l&apos;art (DTU 52.1 et 52.2). [À valider.]
      </p>

      <h2>12. Données personnelles</h2>
      <p>
        Les données collectées lors de la commande sont traitées conformément à notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>13. Médiation et litiges</h2>
      <p>
        En cas de litige, le client peut recourir gratuitement au médiateur de la consommation : [nom et coordonnées du
        médiateur]. Les présentes CGV sont soumises au droit français. [À valider.]
      </p>
    </PageJuridique>
  );
}
