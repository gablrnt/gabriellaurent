import Link from "next/link";
import { CATEGORIES, FINITIONS, TEINTES, USAGES, type Produit } from "@/data/produits";
import { MODES } from "@/data/livraison";
import { formatNombre } from "@/lib/format";

const UNITE_VENTE: Record<Produit["unite"], string> = {
  m2: "Au m²",
  ml: "Au mètre linéaire",
  piece: "À la pièce",
  bidon: "Au bidon",
};

const SUFFIXE_POIDS: Record<Produit["unite"], string> = {
  m2: "kg/m²",
  ml: "kg/ml",
  piece: "kg/pièce",
  bidon: "kg/bidon",
};

const ouiNon = (v: boolean) => (v ? "Oui" : "Non");

/** Seuls les champs renseignés sont affichés */
export function Caracteristiques({ produit }: { produit: Produit }) {
  const lignes: [string, string][] = [["Catégorie", CATEGORIES[produit.categorie].titre]];
  if (produit.teinte) lignes.push(["Teinte", TEINTES[produit.teinte].label]);
  if (produit.finition) lignes.push(["Finition", FINITIONS[produit.finition].label]);
  if (produit.usages.length > 0)
    lignes.push(["Usages recommandés", produit.usages.map((u) => USAGES[u].label).join(", ")]);
  lignes.push(["Vente", UNITE_VENTE[produit.unite]]);
  if (produit.formats) lignes.push(["Formats", produit.formats]);
  if (produit.epaisseur) lignes.push(["Épaisseur", produit.epaisseur]);
  if (produit.origine) lignes.push(["Origine", produit.origine]);
  if (produit.poidsKgParUnite !== null)
    lignes.push(["Poids", `${formatNombre(produit.poidsKgParUnite)} ${SUFFIXE_POIDS[produit.unite]}`]);
  if (produit.antiderapant !== null) lignes.push(["Antidérapant", ouiNon(produit.antiderapant)]);
  if (produit.resistantGel !== null) lignes.push(["Résistant au gel", ouiNon(produit.resistantGel)]);
  if (produit.entretien) {
    lignes.push(["Contenance", `${formatNombre(produit.entretien.contenanceL)} L`]);
    lignes.push([
      "Rendement",
      `${formatNombre(produit.entretien.rendementM2ParL)} m²/L${produit.entretien.precisionRendement ? ` ${produit.entretien.precisionRendement}` : ""}`,
    ]);
  }

  return (
    <div className="max-w-2xl">
      <dl className="divide-y divide-greige/70 border-y border-greige/70">
        {lignes.map(([terme, valeur]) => (
          <div key={terme} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 py-3 text-sm sm:text-base">
            <dt className="text-taupe-fonce">{terme}</dt>
            <dd className="font-medium">{valeur}</dd>
          </div>
        ))}
      </dl>
      {produit.categorie !== "entretien" && (
        <p className="mt-4 text-sm text-taupe-fonce">
          Formats, épaisseurs et caractéristiques techniques détaillées : appelez-nous ou écrivez-nous, nous vous
          répondons sous 24 h.
        </p>
      )}
    </div>
  );
}

export function Pose({ produit }: { produit: Produit }) {
  const sol = produit.categorie === "sols" || produit.categorie === "piscine";
  return (
    <div className="prose-pierre">
      {sol ? (
        <ul>
          <li>Posez sur un support propre, stable et sec.</li>
          <li>Mélangez les dalles de plusieurs caisses pour bien répartir les nuances de la pierre.</li>
          <li>Prévoyez des joints de 3 à 6 mm en intérieur, et d&apos;au moins 4,5 mm en extérieur.</li>
          <li>Utilisez une colle et des joints souples, de teinte claire, adaptés à la pierre naturelle.</li>
          <li>En extérieur, gardez une pente d&apos;au moins 1,5 % pour que l&apos;eau s&apos;écoule.</li>
          <li>Faites poser votre pierre par un professionnel, dans le respect des DTU 52.1 et 52.2.</li>
        </ul>
      ) : (
        <ul>
          <li>Posez sur un support propre, stable et sec.</li>
          <li>Mélangez les pièces de plusieurs caisses pour bien répartir les nuances de la pierre.</li>
          <li>Utilisez une colle et des joints adaptés à la pierre naturelle.</li>
          <li>Pour un résultat durable, faites appel à un professionnel de la pose.</li>
        </ul>
      )}
      <p>
        <Link href="/conseils#pose">Lire tous nos conseils de pose</Link>
      </p>
    </div>
  );
}

export function Entretien({ avecProtection }: { avecProtection: boolean }) {
  return (
    <div className="prose-pierre">
      <ul>
        <li>Au quotidien, nettoyez avec un savon doux au pH neutre.</li>
        <li>Évitez les produits acides (vinaigre, détartrants…).</li>
        <li>
          Protégez la pierre avec <Link href="/produit/protect-pierre-base">Protect Pierre Base</Link> puis{" "}
          <Link href="/produit/protect-pierre-finish">Protect Pierre Finish</Link>.
        </li>
        <li>
          En extérieur, éliminez les mousses avec <Link href="/produit/clean-pro">Clean Pro</Link>.
        </li>
        <li>
          Après le chantier, nettoyez en profondeur avec <Link href="/produit/decap-pro">Decap Pro</Link>.
        </li>
      </ul>
      <p>
        {avecProtection && (
          <>
            <a href="#protection">Calculer les bidons de protection pour votre surface</a> ·{" "}
          </>
        )}
        <Link href="/conseils#entretien">Tous nos conseils d&apos;entretien</Link>
      </p>
    </div>
  );
}

export function Livraison() {
  return (
    <div className="prose-pierre">
      <ul>
        <li>
          <strong>{MODES.hayon.label}</strong> : dépose au pied du camion.
        </li>
        <li>
          <strong>{MODES.grue.label}</strong> : dépose au plus près du chantier, selon l&apos;accès.
        </li>
        <li>
          <strong>{MODES.retrait.label}</strong>.
        </li>
      </ul>
      <p>
        Nous livrons en France continentale, en Corse et en Suisse. Pour les autres pays européens, nous vous envoyons
        un devis de livraison sous 24 h. Les frais sont calculés à la commande selon le poids et la zone, ou confirmés
        sous 24 h.
      </p>
      <p>
        À la réception, vérifiez la marchandise en présence du chauffeur et notez toute réserve sur le bon du
        transporteur.
      </p>
      <p>
        <Link href="/livraison-retours">Livraison et retours : tout savoir</Link>
      </p>
    </div>
  );
}
