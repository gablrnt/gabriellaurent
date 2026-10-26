import { Icone } from "./Icone";

/** Encadré bien visible sur les pages juridiques modèles */
export function AvertissementJuridique() {
  return (
    <div role="note" className="mb-10 flex gap-4 rounded-sm border-2 border-terre bg-terre/10 p-5">
      <Icone nom="info" className="size-6 shrink-0 text-terre-fonce" />
      <div>
        <p className="text-lg font-semibold">Texte à faire valider par un professionnel</p>
        <p className="mt-1 text-sm leading-relaxed">
          Cette page est un modèle de travail. Les passages entre crochets [ ] sont à compléter, et l&apos;ensemble doit
          être relu et validé par un juriste ou un avocat avant la mise en ligne de la boutique.
        </p>
      </div>
    </div>
  );
}
