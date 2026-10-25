/**
 * Icônes au trait (24 × 24), dessinées pour le site.
 * Décoratives par défaut (aria-hidden) : le texte voisin porte le sens.
 */

const TRACES = {
  panier: (
    <>
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fermer: <path d="M6 6l12 12M18 6 6 18" />,
  telephone: (
    <path d="M6.6 3.8 9 3.3l1.6 4-1.9 1.3a11 11 0 0 0 6.7 6.7l1.3-1.9 4 1.6-.5 2.4a2 2 0 0 1-2.1 1.6A16.5 16.5 0 0 1 5 5.9a2 2 0 0 1 1.6-2.1Z" />
  ),
  camion: (
    <>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3 3.5v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  entrepot: (
    <>
      <path d="M3 20V9l9-5 9 5v11" />
      <path d="M7 20v-7h10v7M7 16.5h10" />
    </>
  ),
  carriere: (
    <>
      <path d="M2.5 19.5 9 8l4 6 2.5-3.5 6 9z" />
      <path d="M2.5 19.5h19" />
    </>
  ),
  echantillons: (
    <>
      <rect x="3" y="3.5" width="8" height="8" rx="1" />
      <rect x="13" y="3.5" width="8" height="8" rx="1" />
      <rect x="8" y="13" width="8" height="8" rx="1" />
    </>
  ),
  cadenas: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </>
  ),
  conseil: (
    <>
      <path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z" />
      <path d="M8 9.5h8M8 12h5" />
    </>
  ),
  maison: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" />
    </>
  ),
  soleil: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </>
  ),
  vagues: (
    <path d="M2.5 9c2 0 2-1.5 4-1.5S8.5 9 10.5 9s2-1.5 4-1.5S16.5 9 18.5 9s2-1.5 3-1.5M2.5 13.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5M2.5 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5" />
  ),
  feuille: (
    <>
      <path d="M5 19c0-8 5-13.5 15-14-.5 10-6 15-14 15" />
      <path d="M5 19c3-4 6-7 10-9.5" />
    </>
  ),
  mur: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1" />
      <path d="M3 9.5h18M3 14.5h18M9 4.5v5M15 9.5v5M9 14.5v5" />
    </>
  ),
  goutte: <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />,
  flocon: (
    <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2" />
  ),
  chaussure: (
    <>
      <path d="M3 16.5V8.5h5.5l1.5 3.5c3 .5 7 1.5 9 3.5v1z" />
      <path d="M3 19.5h17M6 19.5v-3M10 19.5v-3M14 19.5v-3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  moins: <path d="M5 12h14" />,
  corbeille: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5.5M14 11v5.5" />
    </>
  ),
  fleche: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronBas: <path d="m6 9 6 6 6-6" />,
  chevronGauche: <path d="m15 6-6 6 6 6" />,
  chevronDroite: <path d="m9 6 6 6-6 6" />,
  coche: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5v.5" />
    </>
  ),
  zoom: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6" />
    </>
  ),
  agrandir: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7v.01" />
    </>
  ),
  etoile: (
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
  ),
  poids: (
    <>
      <path d="M7.5 8.5h9l2.5 12h-14z" />
      <circle cx="12" cy="5.5" r="2.2" />
    </>
  ),
  calculette: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  famille: (
    <>
      <circle cx="8" cy="7.5" r="2.5" />
      <circle cx="16" cy="7.5" r="2.5" />
      <path d="M3.5 19.5v-2a4.5 4.5 0 0 1 9 0v2M11.5 19.5v-2a4.5 4.5 0 0 1 9 0v2" />
    </>
  ),
  courrier: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
} as const;

export type NomIcone = keyof typeof TRACES;

export function Icone({
  nom,
  className = "size-5",
  titre,
}: {
  nom: NomIcone;
  className?: string;
  /** Si fourni, l'icône est annoncée aux lecteurs d'écran */
  titre?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={titre ? undefined : true}
      role={titre ? "img" : undefined}
      aria-label={titre}
      focusable="false"
    >
      {TRACES[nom]}
    </svg>
  );
}
