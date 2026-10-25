"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fait apparaître son contenu en douceur quand il entre dans l'écran.
 * Le CSS ne masque le bloc que si JavaScript est actif (classe `js` sur <html>)
 * et si l'utilisateur n'a pas demandé à réduire les animations.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const bloc = ref.current;
    if (!bloc) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree?.isIntersecting) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    observateur.observe(bloc);
    return () => observateur.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal className={`${className} ${visible ? "est-visible" : ""}`}>
      {children}
    </div>
  );
}
