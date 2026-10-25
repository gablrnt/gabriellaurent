"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fait apparaître en douceur les blocs marqués `data-reveal` quand ils
 * entrent dans l'écran. Le CSS ne masque ces blocs que si JavaScript est
 * actif (classe `js`) et si l'utilisateur n'a pas demandé à réduire les
 * animations : le contenu reste toujours lisible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const blocs = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.est-visible)");
    if (!("IntersectionObserver" in window)) {
      blocs.forEach((b) => b.classList.add("est-visible"));
      return;
    }
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (entree.isIntersecting) {
            entree.target.classList.add("est-visible");
            observateur.unobserve(entree.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    blocs.forEach((b) => observateur.observe(b));
    return () => observateur.disconnect();
  }, [pathname]);

  return null;
}
