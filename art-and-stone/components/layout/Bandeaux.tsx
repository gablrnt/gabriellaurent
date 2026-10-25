import { BANDEAU_INFOS, SITE } from "@/data/site";
import { PRIX_INDICATIFS } from "@/lib/catalogue";

/** Bandeau discret affiché tant qu'au moins un prix est provisoire */
export function BandeauPrix() {
  if (!PRIX_INDICATIFS) return null;
  return (
    <p className="bg-anthracite px-4 py-1.5 text-center text-[0.6875rem] tracking-[0.08em] text-creme uppercase">
      Site en préparation — prix indicatifs
    </p>
  );
}

export function BandeauInfos() {
  return (
    <div className="border-b border-greige/60 bg-sable">
      <p className="conteneur flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-xs text-anthracite">
        <span>{BANDEAU_INFOS[0]}</span>
        <span aria-hidden="true" className="text-taupe">
          ·
        </span>
        <span className="hidden sm:inline">{BANDEAU_INFOS[1]}</span>
        <span aria-hidden="true" className="hidden text-taupe sm:inline">
          ·
        </span>
        <a
          href={`tel:${SITE.telephoneLien}`}
          className="font-semibold whitespace-nowrap underline-offset-4 hover:underline"
        >
          {SITE.telephone}
        </a>
      </p>
    </div>
  );
}
