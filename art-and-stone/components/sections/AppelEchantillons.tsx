import { KIT_ECHANTILLONS } from "@/data/produits";
import { SITE } from "@/data/site";
import { formatPrix } from "@/lib/format";
import { LienBouton } from "@/components/ui/Bouton";
import { Reveal } from "@/components/ui/Reveal";

export function AppelEchantillons() {
  return (
    <section className="bg-anthracite text-creme">
      <Reveal className="conteneur flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-greige uppercase">Hésitez-vous encore ?</p>
          <h2 className="mt-2 text-3xl text-white sm:text-4xl">
            Recevez 3 échantillons chez vous pour {formatPrix(KIT_ECHANTILLONS.prix)}
          </h2>
          <p className="mt-3 text-creme/85">
            Remboursés en bon d&apos;achat sur votre commande. Ou appelez-nous au{" "}
            <a href={`tel:${SITE.telephoneLien}`} className="font-semibold text-white underline underline-offset-4">
              {SITE.telephone}
            </a>
            .
          </p>
        </div>
        <LienBouton href="/echantillons" taille="grand" className="shrink-0">
          Choisir mes échantillons
        </LienBouton>
      </Reveal>
    </section>
  );
}
