import "server-only";
import { MODES, ZONES } from "@/data/livraison";
import type { Commande } from "@/lib/commande-serveur";

/**
 * Stripe Checkout via l'API REST (sans SDK).
 * Documentation : https://docs.stripe.com/api/checkout/sessions/create
 */

const API = "https://api.stripe.com/v1";

export function stripeConfigure(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function enCentimes(euros: number): number {
  return Math.round(euros * 100);
}

/** Encode un objet imbriqué au format attendu par Stripe : line_items[0][price_data][currency]=eur */
function encoder(objet: Record<string, unknown>, prefixe = "", params = new URLSearchParams()): URLSearchParams {
  for (const [cle, valeur] of Object.entries(objet)) {
    if (valeur === undefined || valeur === null) continue;
    const nom = prefixe ? `${prefixe}[${cle}]` : cle;
    if (typeof valeur === "object") encoder(valeur as Record<string, unknown>, nom, params);
    else params.append(nom, String(valeur));
  }
  return params;
}

async function appelStripe<T>(chemin: string, init?: { method?: string; corps?: URLSearchParams }): Promise<T> {
  const reponse = await fetch(`${API}${chemin}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: init?.corps,
    cache: "no-store",
  });
  const donnees = (await reponse.json()) as T & { error?: { message?: string } };
  if (!reponse.ok) throw new Error(`Stripe (${reponse.status}) : ${donnees.error?.message ?? "erreur inconnue"}`);
  return donnees;
}

export async function creerSessionCheckout(commande: Commande, origine: string): Promise<string> {
  const { coordonnees: c, adresse: a, panier, frais } = commande;

  const articles = panier.lignes.map((l) => ({
    quantity: l.quantite,
    price_data: {
      currency: "eur",
      unit_amount: enCentimes(l.prixUnitaire),
      product_data: {
        name: l.nom,
        ...(l.details.length > 0 ? { description: l.details.join(" · ").slice(0, 500) } : {}),
      },
    },
  }));
  if (frais.montant !== null && frais.montant > 0) {
    articles.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: enCentimes(frais.montant),
        product_data: { name: `Livraison — ${MODES[commande.mode].label}` },
      },
    });
  }

  const metadata = {
    reference: commande.reference,
    client: `${c.prenom} ${c.nom}`.slice(0, 500),
    telephone: c.telephone,
    adresse: `${a.adresse}${a.complement ? `, ${a.complement}` : ""}, ${a.codePostal} ${a.ville}`.slice(0, 500),
    zone: ZONES[a.zone].label,
    livraison: MODES[commande.mode].label,
    ...(commande.message ? { message: commande.message.slice(0, 500) } : {}),
  };

  const corps = encoder({
    mode: "payment",
    locale: "fr",
    customer_email: c.email,
    client_reference_id: commande.reference,
    success_url: `${origine}/commande/confirmation?ref=${commande.reference}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origine}/commande?paiement=annule`,
    line_items: Object.fromEntries(articles.map((article, i) => [i, article])),
    metadata,
    payment_intent_data: { metadata, description: `Commande ${commande.reference}` },
  });

  const session = await appelStripe<{ url: string }>("/checkout/sessions", { method: "POST", corps });
  return session.url;
}

/** Vérifie qu'une session Checkout a bien été payée (page de confirmation) */
export async function sessionPayee(sessionId: string): Promise<boolean> {
  if (!stripeConfigure() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  try {
    const session = await appelStripe<{ payment_status: string }>(
      `/checkout/sessions/${encodeURIComponent(sessionId)}`,
    );
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}
