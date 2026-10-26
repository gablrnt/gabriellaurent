import Link from "next/link";
import { CATEGORIES } from "@/data/produits";
import { LIENS_LEGAUX, SITE } from "@/data/site";
import { Icone } from "@/components/ui/Icone";
import { Logo } from "./Logo";

const LIENS_BOUTIQUE = [
  { href: "/pierres", label: "Toutes les pierres" },
  ...(["sols", "piscine", "jardin", "murs", "entretien"] as const).map((c) => ({
    href: `/${c}`,
    label: CATEGORIES[c].titre,
  })),
  { href: "/echantillons", label: "Échantillons" },
];

const LIENS_AIDE = [
  { href: "/conseils", label: "Conseils de pose et d'entretien" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/a-propos", label: "Qui sommes-nous ?" },
  { href: "/contact", label: "Contact" },
];

function ColonneLiens({ titre, liens }: { titre: string; liens: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.18em] text-greige uppercase">{titre}</h2>
      <ul className="space-y-2.5 text-sm">
        {liens.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-creme/90 underline-offset-4 hover:text-white hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PiedDePage() {
  return (
    <footer className="bg-anthracite text-creme">
      <div className="conteneur grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo clair />
          <p className="max-w-xs text-sm leading-relaxed text-creme/80">
            Entreprise familiale, fournisseur et fabricant de pierre naturelle à {SITE.ville}.
          </p>
          <a
            href={`tel:${SITE.telephoneLien}`}
            className="flex items-center gap-3 text-lg font-semibold text-white hover:underline"
          >
            <Icone nom="telephone" className="size-5 text-greige" />
            {SITE.telephone}
          </a>
          <p className="text-sm text-creme/80">{SITE.horaires}</p>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-creme/90 hover:text-white hover:underline"
          >
            <Icone nom="instagram" className="size-5 text-greige" />
            Instagram {SITE.instagram.compte}
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </div>

        <ColonneLiens titre="La boutique" liens={LIENS_BOUTIQUE} />
        <ColonneLiens titre="Vous aider" liens={LIENS_AIDE} />
        <ColonneLiens titre="Informations" liens={LIENS_LEGAUX} />
      </div>

      <div className="border-t border-creme/15">
        <div className="conteneur flex flex-col gap-3 py-6 text-sm text-creme/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© ART &amp; STONE — Pierre naturelle, Tarascon</p>
          <a
            href={SITE.sitePro}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Vous êtes professionnel ? → artandstone.fr
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
