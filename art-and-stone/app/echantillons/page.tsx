import type { Metadata } from "next";
import { Suspense } from "react";
import { ListeEchantillonsStatique, SelecteurEchantillons } from "@/components/panier/SelecteurEchantillons";
import { EnTetePage } from "@/components/ui/EnTetePage";
import { Icone, type NomIcone } from "@/components/ui/Icone";
import { KIT_ECHANTILLONS } from "@/data/produits";
import { formatPrix } from "@/lib/format";
import { pierres } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Échantillons de pierre naturelle",
  description: `Recevez 3 échantillons de pierre naturelle au choix pour ${formatPrix(KIT_ECHANTILLONS.prix)}, remboursés en bon d'achat sur votre commande. Voyez et touchez la pierre chez vous avant d'acheter.`,
  alternates: { canonical: "/echantillons" },
  openGraph: { title: "Échantillons de pierre naturelle | ART & STONE", url: "/echantillons" },
};

const ETAPES: { icone: NomIcone; texte: string }[] = [
  { icone: "echantillons", texte: "Cochez 3 pierres qui vous plaisent" },
  { icone: "camion", texte: "Recevez vos échantillons chez vous" },
  { icone: "coche", texte: `Vos ${formatPrix(KIT_ECHANTILLONS.prix)} sont remboursés en bon d'achat sur votre commande` },
];

export default function PageEchantillons() {
  const liste = pierres();
  return (
    <>
      <EnTetePage
        titre={`3 échantillons au choix pour ${formatPrix(KIT_ECHANTILLONS.prix)}`}
        surtitre="Échantillons"
        intro="Une photo ne remplace pas la pierre en main : comparez les teintes à la lumière de chez vous, touchez la finition, posez-la à côté de vos murs et de vos meubles."
        fil={[{ label: "Échantillons" }]}
      >
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {ETAPES.map((e, i) => (
            <li key={e.texte} className="flex items-center gap-3 rounded-sm bg-creme p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-anthracite font-serif text-lg text-creme">
                {i + 1}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icone nom={e.icone} className="size-5 shrink-0 text-terre-fonce" />
                {e.texte}
              </span>
            </li>
          ))}
        </ol>
      </EnTetePage>
      <section className="conteneur py-10 sm:py-14" aria-label="Choix des échantillons">
        <h2 className="mb-8 text-3xl sm:text-4xl">Choisissez exactement 3 pierres</h2>
        <Suspense fallback={<ListeEchantillonsStatique pierres={liste} />}>
          <SelecteurEchantillons pierres={liste} />
        </Suspense>
      </section>
    </>
  );
}
