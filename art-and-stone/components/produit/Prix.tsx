import { UNITES, type Produit } from "@/data/produits";
import { formatPrix } from "@/lib/format";

export function Prix({
  produit,
  taille = "normal",
}: {
  produit: Pick<Produit, "prix" | "unite" | "prixProvisoire">;
  taille?: "normal" | "grand";
}) {
  const unite = UNITES[produit.unite];
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <span className={taille === "grand" ? "font-serif text-4xl font-semibold" : "text-lg font-semibold"}>
          {formatPrix(produit.prix)}
        </span>
        <span className={taille === "grand" ? "text-base text-taupe-fonce" : "text-sm text-taupe-fonce"}>
          TTC {unite.suffixe}
          <span className="sr-only"> ({unite.libelle})</span>
        </span>
      </p>
      {produit.prixProvisoire && (
        <p className="mt-0.5 text-xs font-medium tracking-wide text-taupe-fonce uppercase">Prix indicatif</p>
      )}
    </div>
  );
}
