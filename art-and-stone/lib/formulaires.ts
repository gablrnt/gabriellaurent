/**
 * Envoi des formulaires via Netlify Forms (aucun serveur nécessaire).
 *
 * Les formulaires sont déclarés dans public/__forms.html : Netlify les
 * détecte au déploiement (activer « Form detection » dans Netlify, onglet
 * Forms). Les demandes arrivent dans l'onglet Forms du projet et peuvent
 * être envoyées par e-mail (Forms → Form notifications).
 */

export type NomFormulaire = "contact" | "commande";

export async function envoyerFormulaire(nom: NomFormulaire, champs: Record<string, string>): Promise<void> {
  const corps = new URLSearchParams({ "form-name": nom, ...champs });

  // En développement local, Netlify Forms n'existe pas : on affiche la demande dans la console.
  if (process.env.NODE_ENV === "development") {
    console.info(`[formulaire « ${nom} » — non envoyé en local]`, Object.fromEntries(corps));
    return;
  }

  const reponse = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: corps.toString(),
  });
  if (!reponse.ok) {
    throw new Error("L'envoi n'a pas abouti. Réessayez dans un instant ou appelez-nous au 06 24 27 03 28.");
  }
}
