import type { Metadata } from "next";
import Link from "next/link";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { Icone, type NomIcone } from "@/components/ui/Icone";
import { MODES, ZONES, type ModeLivraison } from "@/data/livraison";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description:
    "Livraison en camion avec hayon ou camion grue en France, Corse et Suisse, ou retrait gratuit à Tarascon. Réception, réserves et droit de rétractation de 14 jours.",
  alternates: { canonical: "/livraison-retours" },
  openGraph: { title: "Livraison & retours | ART & STONE", url: "/livraison-retours" },
};

const ICONES_MODE: Partial<Record<ModeLivraison, NomIcone>> = { hayon: "camion", grue: "camion", retrait: "entrepot" };

export default function PageLivraison() {
  return (
    <>
      <EnTetePage
        titre="Livraison & retours"
        surtitre="Informations"
        intro="La pierre est lourde : voici comment elle arrive jusque chez vous, et comment se passe un retour."
        fil={[{ label: "Livraison & retours" }]}
      />
      <section className="conteneur py-12 sm:py-16" aria-labelledby="titre-modes">
        <h2 id="titre-modes" className="text-4xl">
          Les modes de livraison
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {(["hayon", "grue", "retrait"] as const).map((m) => (
            <li key={m} className="rounded-sm border border-greige bg-blanc p-6">
              <Icone nom={ICONES_MODE[m] ?? "camion"} className="size-8 text-terre-fonce" />
              <h3 className="mt-4 text-2xl">{MODES[m].label}</h3>
              <p className="mt-2 leading-relaxed text-anthracite/90">{MODES[m].description}</p>
            </li>
          ))}
        </ul>
        <div className="prose-pierre mt-10">
          <h3>Zones desservies</h3>
          <ul>
            <li>{ZONES.france.label}</li>
            <li>{ZONES.corse.label}</li>
            <li>{ZONES.suisse.label}</li>
            <li>
              Autres pays européens : <strong>devis de livraison sous 24 h</strong>. Vous pouvez envoyer votre commande,
              nous revenons vers vous avec le prix de la livraison avant tout paiement.
            </li>
          </ul>
          <h3>Frais et délais</h3>
          <p>
            Les frais de livraison dépendent du poids de votre commande, de la zone et du mode choisi. Ils sont calculés
            à la commande quand c&apos;est possible ; sinon, nous vous les confirmons sous 24 h, avant tout paiement. Le
            délai de livraison vous est confirmé au même moment.
          </p>
          <p>Les kits d&apos;échantillons sont envoyés par colis.</p>
        </div>
      </section>

      <section className="bg-sable" aria-labelledby="titre-reception">
        <div className="conteneur py-12 sm:py-16">
          <div className="prose-pierre">
            <h2 id="titre-reception" className="mt-0 text-4xl">
              À la livraison : vérifiez avant de signer
            </h2>
            <ol>
              <li>Vérifiez la marchandise en présence du chauffeur : nombre de palettes, état des pierres.</li>
              <li>
                En cas de casse ou de manque, <strong>notez des réserves précises sur le bon du transporteur</strong>{" "}
                (par exemple : « 2 dalles cassées sur la palette 1 »), puis signez.
              </li>
              <li>
                Prévenez-nous rapidement au{" "}
                <a href={`tel:${SITE.telephoneLien}`}>{SITE.telephone}</a> ou via la{" "}
                <Link href="/contact">page contact</Link>, avec des photos.
              </li>
            </ol>
            <p>Sans réserve écrite sur le bon du transporteur, il est très difficile de faire valoir un dommage.</p>
          </div>
        </div>
      </section>

      <section className="conteneur py-12 sm:py-16" aria-labelledby="titre-retours">
        <div className="prose-pierre">
          <h2 id="titre-retours" className="mt-0 text-4xl">
            Retours et droit de rétractation
          </h2>
          <p>
            Vous disposez d&apos;un <strong>délai de rétractation de 14 jours</strong> à compter de la réception de votre
            commande pour nous informer que vous souhaitez la retourner, sans avoir à vous justifier.
          </p>
          <div className="my-6 flex gap-4 rounded-sm border-l-4 border-terre bg-sable p-5">
            <Icone nom="poids" className="size-6 shrink-0 text-terre-fonce" />
            <p className="leading-relaxed">
              <strong>Les frais de retour sont à votre charge.</strong> La pierre étant lourde, le retour se fait
              obligatoirement par transporteur, à vos frais. Pensez-y avant de commander : c&apos;est aussi pour cela que
              nous vous conseillons de commander d&apos;abord des échantillons.
            </p>
          </div>
          <p>
            Les produits doivent nous être retournés complets, dans leur état d&apos;origine. Le remboursement des produits
            intervient après réception et vérification du retour.
          </p>
          <p>
            Pour tout retour, contactez-nous d&apos;abord au <a href={`tel:${SITE.telephoneLien}`}>{SITE.telephone}</a>{" "}
            : nous vous indiquons la marche à suivre. Le détail des conditions figure dans nos{" "}
            <Link href="/cgv">conditions générales de vente</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
