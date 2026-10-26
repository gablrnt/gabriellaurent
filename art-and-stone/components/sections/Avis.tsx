import { AVIS } from "@/data/avis";
import { SITE } from "@/data/site";
import { Icone } from "@/components/ui/Icone";

/** Avis clients : n'affiche que les avis réellement saisis dans data/avis.ts */
export function Avis() {
  return (
    <div>
      {AVIS.length > 0 && (
        <ul className="mb-8 grid gap-4 md:grid-cols-3">
          {AVIS.map((a) => (
            <li key={`${a.auteur}-${a.texte.slice(0, 20)}`} className="rounded-sm border border-greige bg-blanc p-5">
              <p className="flex gap-0.5 text-terre" aria-label={`Note : ${a.note} sur 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icone key={i} nom="etoile" className={`size-4 ${i < a.note ? "fill-current" : "opacity-30"}`} />
                ))}
              </p>
              <blockquote className="mt-3 text-sm leading-relaxed">« {a.texte} »</blockquote>
              <p className="mt-3 text-sm font-semibold">
                {a.auteur}
                {a.ville && <span className="font-normal text-taupe-fonce"> — {a.ville}</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
      <a
        href={SITE.avisGoogleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-medium text-terre-fonce underline underline-offset-4 hover:text-anthracite"
      >
        <Icone nom="etoile" className="size-5" />
        Voir nos avis Google
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    </div>
  );
}
