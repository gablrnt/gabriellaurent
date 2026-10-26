import type { Metadata } from "next";
import { Suspense } from "react";
import { TunnelCommande } from "@/components/commande/TunnelCommande";
import { FilAriane } from "@/components/ui/FilAriane";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function PageCommande() {
  return (
    <div className="conteneur py-8 sm:py-12">
      <FilAriane etapes={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />
      <h1 className="mt-6 mb-8 text-4xl sm:text-5xl">Votre commande</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-sm bg-sable" />}>
        <TunnelCommande />
      </Suspense>
    </div>
  );
}
