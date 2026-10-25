import type { ProfilNez } from "@/data/produits";

/**
 * Schémas simples des profils de nez, vus en coupe :
 * la margelle est dessinée de profil, le nez (bord côté bassin) à droite.
 */
const CONTOURS: Record<ProfilNez, string> = {
  // N1 — nez arrondi ½ boudin : demi-cercle complet sur l'épaisseur
  N1: "M6 14 H62 A10 10 0 0 1 62 34 H6 Z",
  // N2 — arête légèrement arrondie : bord droit, petits congés en haut et en bas
  N2: "M6 14 H68 Q72 14 72 18 V30 Q72 34 68 34 H6 Z",
  // N3 — léger chanfrein 45° : angle supérieur coupé en biais
  N3: "M6 14 H65 L72 21 V34 H6 Z",
  // N4 — nez à talon : nez arrondi prolongé par un retombant vers le bas
  N4: "M6 14 H64 A8 8 0 0 1 72 22 V42 H62 V34 H6 Z",
  // N5 — rainure goutte d'eau : bord arrondi, rainure creusée en sous-face
  N5: "M6 14 H64 A10 10 0 0 1 64 34 H60 V29 A2.5 2.5 0 0 0 55 29 V34 H6 Z",
};

export function ProfilNezSchema({ profil, className = "w-20" }: { profil: ProfilNez; className?: string }) {
  return (
    <svg viewBox="0 0 80 48" className={className} aria-hidden="true" focusable="false">
      <path
        d={CONTOURS[profil]}
        fill="var(--color-greige)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
