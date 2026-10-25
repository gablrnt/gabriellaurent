import Link from "next/link";
import type { ComponentProps } from "react";

type Variante = "primaire" | "secondaire" | "clair" | "lien";
type Taille = "normal" | "grand";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 text-center [&>svg]:shrink-0";

const VARIANTES: Record<Variante, string> = {
  // Texte blanc sur terre cuite : contraste 4,6:1 (AA)
  primaire: "bg-terre text-white hover:bg-terre-fonce shadow-sm",
  secondaire: "border border-anthracite/80 text-anthracite bg-transparent hover:bg-anthracite hover:text-creme",
  clair: "bg-creme text-anthracite hover:bg-white",
  lien: "text-terre-fonce underline underline-offset-4 hover:text-anthracite px-0 py-0",
};

const TAILLES: Record<Taille, string> = {
  normal: "min-h-11 px-5 py-2.5 text-sm",
  grand: "min-h-12 px-6 py-3 text-base",
};

export function classesBouton(variante: Variante = "primaire", taille: Taille = "normal") {
  return `${BASE} ${VARIANTES[variante]} ${variante === "lien" ? "" : TAILLES[taille]}`;
}

export function LienBouton({
  variante,
  taille,
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variante?: Variante; taille?: Taille }) {
  return <Link className={`${classesBouton(variante, taille)} ${className}`} {...props} />;
}

export function Bouton({
  variante,
  taille,
  className = "",
  type = "button",
  ...props
}: ComponentProps<"button"> & { variante?: Variante; taille?: Taille }) {
  return <button type={type} className={`${classesBouton(variante, taille)} ${className}`} {...props} />;
}
