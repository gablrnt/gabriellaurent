import Link from "next/link";
import { SITE } from "@/data/site";

export function Logo({ clair = false }: { clair?: boolean }) {
  return (
    <Link href="/" className="group inline-flex flex-col leading-none" aria-label="ART & STONE, retour à l'accueil">
      <span
        className={`font-serif text-[1.35rem] font-semibold tracking-logo sm:text-2xl ${clair ? "text-creme" : "text-anthracite"}`}
      >
        ART&nbsp;&amp;&nbsp;STONE
      </span>
      <span
        className={`mt-1 text-[0.625rem] tracking-[0.12em] uppercase sm:text-[0.6875rem] ${clair ? "text-greige" : "text-taupe-fonce"}`}
      >
        {SITE.sousTitre}
      </span>
    </Link>
  );
}
