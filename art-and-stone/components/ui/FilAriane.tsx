import Link from "next/link";
import { SITE } from "@/data/site";
import { JsonLd } from "./JsonLd";

export type Etape = { label: string; href?: string };

export function FilAriane({ etapes }: { etapes: Etape[] }) {
  const toutes: Etape[] = [{ label: "Accueil", href: "/" }, ...etapes];
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-taupe-fonce">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {toutes.map((etape, i) => (
          <li key={`${etape.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {etape.href && i < toutes.length - 1 ? (
              <Link href={etape.href} className="underline-offset-4 hover:text-anthracite hover:underline">
                {etape.label}
              </Link>
            ) : (
              <span aria-current={i === toutes.length - 1 ? "page" : undefined} className="text-anthracite">
                {etape.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: toutes.map((etape, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: etape.label,
            ...(etape.href ? { item: `${SITE.url}${etape.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}
