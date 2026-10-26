import { Icone } from "@/components/ui/Icone";

export function PierreVivante() {
  return (
    <aside className="rounded-sm border-l-4 border-terre bg-sable p-5" aria-labelledby="pierre-vivante">
      <h2 id="pierre-vivante" className="flex items-center gap-2 font-sans text-base font-semibold">
        <Icone nom="carriere" className="size-5 text-terre-fonce" />
        La pierre naturelle est vivante
      </h2>
      <p className="mt-2 text-sm leading-relaxed">
        Variations de teinte, veines, fossiles et petites cavités font partie de son charme : ce ne sont pas des
        défauts. Deux dalles ne sont jamais tout à fait identiques. C&apos;est pour cela que nous vous recommandons de
        commander un échantillon avant votre commande.
      </p>
    </aside>
  );
}
