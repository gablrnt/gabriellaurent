import { NextResponse, after } from "next/server";
import { estUnRobot, lireJson, reponseErreur } from "@/lib/api";
import { resumeCommande, validerCommande } from "@/lib/commande-serveur";
import { envoyerEmail } from "@/lib/email";

/**
 * Commande sans paiement en ligne (ou frais de livraison à confirmer) :
 * la boutique reçoit la commande par e-mail et rappelle le client sous 24 h.
 */
export async function POST(requete: Request) {
  const corps = await lireJson(requete);
  if (!corps) return reponseErreur("Requête invalide.");
  if (estUnRobot(corps)) return NextResponse.json({ ok: true, reference: "AS-0" });

  const resultat = validerCommande(corps);
  if (!resultat.ok) return reponseErreur(resultat.erreur, resultat.statut);
  const { commande } = resultat;
  const devis = commande.frais.statut === "devis";

  try {
    await envoyerEmail({
      sujet: `${devis ? "Demande de devis livraison" : "Nouvelle commande"} ${commande.reference} — ${commande.coordonnees.prenom} ${commande.coordonnees.nom}`,
      texte: resumeCommande(
        commande,
        devis
          ? "Nouvelle commande avec DEMANDE DE DEVIS DE LIVRAISON (hors zones tarifées). À rappeler sous 24 h."
          : "Nouvelle commande à valider (livraison et paiement). À rappeler sous 24 h.",
      ),
      repondreA: commande.coordonnees.email,
    });
  } catch (erreur) {
    console.error("[commande] échec de l'envoi :", erreur);
    return reponseErreur(
      "Votre commande n'a pas pu être transmise. Réessayez dans un instant ou appelez-nous.",
      502,
    );
  }

  // Accusé de réception au client (non bloquant)
  if (process.env.RESEND_API_KEY) {
    after(() =>
      envoyerEmail({
      a: commande.coordonnees.email,
      sujet: `ART & STONE — Nous avons bien reçu votre commande ${commande.reference}`,
      texte: resumeCommande(
        commande,
        `Bonjour ${commande.coordonnees.prenom},\n\nMerci pour votre commande. Nous vous recontactons sous 24 h pour valider la livraison et le paiement.\nAucun paiement n'a été effectué à ce stade.`,
      ),
      }).catch((erreur) => console.error("[commande] accusé de réception non envoyé :", erreur)),
    );
  }

  return NextResponse.json({ ok: true, reference: commande.reference });
}
