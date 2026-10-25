import { USAGES, type Usage } from "@/data/produits";
import { Icone, type NomIcone } from "@/components/ui/Icone";

export function BadgePhotoReelle({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-anthracite/85 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-white uppercase ${className}`}
    >
      <Icone nom="coche" className="size-3.5" />
      Photo réelle
    </span>
  );
}

export const ICONES_USAGE: Record<Usage, NomIcone> = {
  interieur: "maison",
  terrasse: "soleil",
  piscine: "vagues",
  jardin: "feuille",
  mur: "mur",
};

export function PictosUsages({ usages }: { usages: Usage[] }) {
  if (usages.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Usages recommandés">
      {usages.map((u) => (
        <li
          key={u}
          className="inline-flex items-center gap-2 rounded-full border border-greige bg-blanc px-3 py-1.5 text-sm"
        >
          <Icone nom={ICONES_USAGE[u]} className="size-4.5 text-terre-fonce" />
          {USAGES[u].label}
        </li>
      ))}
    </ul>
  );
}
