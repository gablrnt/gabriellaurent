const formateurPrix = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const formateurPrixRond = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const formateurNombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** 79 → « 79 € » ; 9.9 → « 9,90 € » */
export function formatPrix(montant: number): string {
  return Number.isInteger(montant) ? formateurPrixRond.format(montant) : formateurPrix.format(montant);
}

/** 12.5 → « 12,5 » */
export function formatNombre(valeur: number): string {
  return formateurNombre.format(valeur);
}

/** 1830 → « 1 830 kg » ; 2400 → « 2,4 t » */
export function formatPoids(kg: number): string {
  if (kg >= 1000) return `${formatNombre(Math.round(kg / 100) / 10)} t`;
  return `${formatNombre(Math.round(kg))} kg`;
}

/** Arrondi monétaire au centime */
export function arrondiCentime(montant: number): number {
  return Math.round(montant * 100) / 100;
}
