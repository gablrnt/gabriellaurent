import { NextResponse } from "next/server";
import { estUnRobot, lireJson, reponseErreur } from "@/lib/api";
import { envoyerEmail } from "@/lib/email";
import {
  SUJETS_CONTACT,
  aucuneErreur,
  texte,
  validerContact,
  type DonneesContact,
  type SujetContact,
} from "@/lib/validation";

export async function POST(requete: Request) {
  const corps = await lireJson(requete);
  if (!corps) return reponseErreur("Requête invalide.");
  if (estUnRobot(corps)) return NextResponse.json({ ok: true });

  const donnees: DonneesContact = {
    nom: texte(corps.nom, 100),
    email: texte(corps.email, 254),
    telephone: texte(corps.telephone, 30),
    sujet: (typeof corps.sujet === "string" && corps.sujet in SUJETS_CONTACT ? corps.sujet : "") as SujetContact | "",
    message: texte(corps.message, 5000),
  };
  if (!aucuneErreur(validerContact(donnees))) {
    return reponseErreur("Certains champs sont incomplets ou invalides.");
  }
  const sujet = SUJETS_CONTACT[donnees.sujet as SujetContact];

  try {
    await envoyerEmail({
      sujet: `Contact site — ${sujet} — ${donnees.nom}`,
      texte: [
        `Nom : ${donnees.nom}`,
        `E-mail : ${donnees.email}`,
        `Téléphone : ${donnees.telephone || "non renseigné"}`,
        `Sujet : ${sujet}`,
        "",
        donnees.message,
      ].join("\n"),
      repondreA: donnees.email,
    });
  } catch (erreur) {
    console.error("[contact] échec de l'envoi :", erreur);
    return reponseErreur("Votre message n'a pas pu être envoyé. Réessayez ou appelez-nous.", 502);
  }

  return NextResponse.json({ ok: true });
}
