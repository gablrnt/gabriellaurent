import Link from "next/link";
import { LienBouton } from "@/components/ui/Bouton";
import { NAVIGATION } from "@/data/site";

export default function PageIntrouvable() {
  return (
    <div className="conteneur max-w-3xl py-20 text-center sm:py-28">
      <p className="surtitre">Erreur 404</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Cette page est introuvable</h1>
      <p className="mt-4 text-lg text-taupe-fonce">
        Le lien est peut-être ancien, ou la pierre n&apos;est plus au catalogue.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LienBouton href="/pierres">Voir toutes les pierres</LienBouton>
        <LienBouton href="/" variante="secondaire">
          Retour à l&apos;accueil
        </LienBouton>
      </div>
      <ul className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {NAVIGATION.slice(1).map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-terre-fonce underline underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
