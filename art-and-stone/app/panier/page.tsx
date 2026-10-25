import type { Metadata } from "next";
import { ContenuPanier } from "@/components/panier/ContenuPanier";
import { FilAriane } from "@/components/ui/FilAriane";

export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false, follow: true },
};

export default function PagePanier() {
  return (
    <div className="conteneur py-8 sm:py-12">
      <FilAriane etapes={[{ label: "Panier" }]} />
      <h1 className="mt-6 mb-8 text-4xl sm:text-5xl">Votre panier</h1>
      <ContenuPanier />
    </div>
  );
}
