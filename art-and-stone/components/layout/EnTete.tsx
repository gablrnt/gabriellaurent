"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAVIGATION, SITE } from "@/data/site";
import { usePanier } from "@/components/panier/PanierProvider";
import { Icone } from "@/components/ui/Icone";
import { Logo } from "./Logo";

function estActif(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function BoutonPanier() {
  const { nombreArticles, pret } = usePanier();
  const libelle =
    pret && nombreArticles > 0 ? `Panier, ${nombreArticles} article${nombreArticles > 1 ? "s" : ""}` : "Panier, vide";
  return (
    <Link
      href="/panier"
      className="relative inline-flex size-11 items-center justify-center rounded-full text-anthracite transition-colors hover:bg-sable"
      aria-label={libelle}
    >
      <Icone nom="panier" className="size-6" />
      {pret && nombreArticles > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-terre px-1 text-[0.6875rem] leading-5 font-semibold text-white"
        >
          {nombreArticles}
        </span>
      )}
    </Link>
  );
}

export function EnTete() {
  const pathname = usePathname();
  // Le menu mobile est ouvert « sur » une page : il se referme seul au changement de page.
  const [ouvertSur, setOuvertSur] = useState<string | null>(null);
  const ouvert = ouvertSur === pathname;
  const menuRef = useRef<HTMLDialogElement>(null);

  // <dialog> natif : piège le focus, ferme avec Échap et rend le focus au bouton.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (ouvert && !menu.open) menu.showModal();
    if (!ouvert && menu.open) menu.close();
    document.body.style.overflow = ouvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <header className="sticky top-0 z-40 border-b border-greige/60 bg-creme/95 backdrop-blur supports-[backdrop-filter]:bg-creme/85">
      <div className="conteneur flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAVIGATION.map((lien) => {
              const actif = estActif(pathname, lien.href);
              return (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={`rounded-sm px-2.5 py-2 text-sm transition-colors hover:text-terre-fonce ${actif ? "font-semibold text-terre-fonce" : "text-anthracite"}`}
                  >
                    {lien.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <BoutonPanier />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-anthracite hover:bg-sable xl:hidden"
            aria-haspopup="dialog"
            aria-expanded={ouvert}
            aria-label="Ouvrir le menu"
            onClick={() => setOuvertSur(pathname)}
          >
            <Icone nom="menu" className="size-6" />
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClose={() => setOuvertSur(null)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-creme p-0 text-anthracite xl:hidden"
      >
        <div className="conteneur flex h-16 items-center justify-between border-b border-greige/60 sm:h-20">
          <Logo />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-sable"
            aria-label="Fermer le menu"
            onClick={() => setOuvertSur(null)}
          >
            <Icone nom="fermer" className="size-6" />
          </button>
        </div>
        <nav aria-label="Navigation principale (mobile)" className="conteneur pt-2 pb-10">
          <ul className="divide-y divide-greige/50">
            {NAVIGATION.map((lien) => {
              const actif = estActif(pathname, lien.href);
              return (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    onClick={() => setOuvertSur(null)}
                    className={`flex items-center justify-between py-3 font-serif text-[1.625rem] ${actif ? "text-terre-fonce" : "text-anthracite"}`}
                  >
                    {lien.label}
                    <Icone nom="chevronDroite" className="size-5 text-taupe" />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/panier"
                onClick={() => setOuvertSur(null)}
                className="flex items-center justify-between py-3 font-serif text-[1.625rem]"
              >
                Panier
                <Icone nom="panier" className="size-5 text-taupe" />
              </Link>
            </li>
          </ul>
          <a
            href={`tel:${SITE.telephoneLien}`}
            className="mt-6 flex items-center gap-3 rounded-sm bg-sable p-4 text-anthracite"
          >
            <Icone nom="telephone" className="size-5 text-terre-fonce" />
            <span>
              <span className="block text-sm text-taupe-fonce">Une question ? Appelez-nous</span>
              <span className="font-semibold">{SITE.telephone}</span>
            </span>
          </a>
        </nav>
      </dialog>
    </header>
  );
}
