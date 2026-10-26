import "server-only";
import { NextResponse } from "next/server";

export function reponseErreur(message: string, statut = 400) {
  return NextResponse.json({ ok: false, erreur: message }, { status: statut });
}

/** Lit le corps JSON d'une requête (limité à 50 Ko) ; null si invalide */
export async function lireJson(requete: Request): Promise<Record<string, unknown> | null> {
  const taille = Number(requete.headers.get("content-length") ?? 0);
  if (taille > 50_000) return null;
  try {
    const corps = await requete.json();
    return corps && typeof corps === "object" ? (corps as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Champ piège invisible : un humain le laisse vide, un robot le remplit */
export function estUnRobot(corps: Record<string, unknown>): boolean {
  return typeof corps.site === "string" && corps.site.trim().length > 0;
}

export function origineSite(requete: Request): string {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return configuree || new URL(requete.url).origin;
}
