import { Icone, type NomIcone } from "@/components/ui/Icone";

const POINTS: { icone: NomIcone; titre: string; texte: string }[] = [
  { icone: "entrepot", titre: "Stock réel à Tarascon", texte: "Les pierres sont chez nous, en Provence." },
  { icone: "carriere", titre: "Sélection en carrière", texte: "Nous choisissons nos blocs sur place." },
  { icone: "echantillons", titre: "Échantillons avant d'acheter", texte: "Voyez et touchez la pierre chez vous." },
  {
    icone: "cadenas",
    titre: "Paiement sécurisé",
    texte: "Vos coordonnées bancaires ne transitent jamais par notre site.",
  },
  {
    icone: "telephone",
    titre: "Conseil par téléphone",
    texte: "Appelez-nous : réponse sous 24 h.",
  },
];

export function Reassurance({ fond = "sable" }: { fond?: "sable" | "creme" }) {
  return (
    <section aria-label="Nos engagements" className={fond === "sable" ? "bg-sable" : "bg-creme"}>
      <ul className="conteneur grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {POINTS.map((p, i) => (
          <li
            key={p.titre}
            className={`flex flex-col items-center text-center ${i === POINTS.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <span className="flex size-12 items-center justify-center rounded-full border border-greige bg-blanc text-terre-fonce">
              <Icone nom={p.icone} className="size-6" />
            </span>
            <p className="mt-3 text-sm font-semibold">{p.titre}</p>
            <p className="mt-1 max-w-48 text-xs leading-relaxed text-taupe-fonce">{p.texte}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
