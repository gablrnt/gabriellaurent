import { NextResponse, after } from "next/server";
import { estUnRobot, lireJson, origineSite, reponseErreur } from "@/lib/api";
import { resumeCommande, validerCommande } from "@/lib/commande-serveur";
import { envoyerEmail } from "@/lib/email";
import { creerSessionCheckout, stripeConfigure } from "@/lib/stripe";

/**
 * Paiement par carte via Stripe Checkout.
 * Possible seulement si STRIPE_SECRET_KEY est défini ET si les frais de
 * livraison sont calculables ; sinon la commande passe par /api/commande.
 */
export async function POST(requete: Request) {
  if (!stripeConfigure()) return reponseErreur("Le paiement en ligne n'est pas disponible.", 503);

  const corps = await lireJson(requete);
  if (!corps) return reponseErreur("Requête invalide.");
  if (estUnRobot(corps)) return reponseErreur("Requête invalide.");

  const resultat = validerCommande(corps);
  if (!resultat.ok) return reponseErreur(resultat.erreur, resultat.statut);
  const { commande } = resultat;
  if (commande.frais.statut !== "calcule") {
    return reponseErreur("Les frais de livraison de cette commande doivent être confirmés par notre équipe.", 409);
  }

  let url: string;
  try {
    url = await creerSessionCheckout(commande, origineSite(requete));
  } catch (erreur) {
    console.error("[checkout] Stripe :", erreur);
    return reponseErreur("Le paiement n'a pas pu démarrer. Réessayez ou appelez-nous.", 502);
  }

  // La boutique reçoit les détails de livraison ; le paiement se vérifie dans le tableau de bord Stripe.
  after(() =>
    envoyerEmail({
    sujet: `Commande ${commande.reference} — paiement Stripe en cours — ${commande.coordonnees.prenom} ${commande.coordonnees.nom}`,
    texte: resumeCommande(
      commande,
      "Le client a été redirigé vers le paiement Stripe. Vérifiez dans Stripe que le paiement est confirmé (référence ci-dessous) avant de préparer la commande.",
    ),
    repondreA: commande.coordonnees.email,
    }).catch((erreur) => console.error("[checkout] e-mail non envoyé :", erreur)),
  );

  return NextResponse.json({ ok: true, url });
}
