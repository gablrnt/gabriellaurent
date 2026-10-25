import "server-only";

/**
 * Envoi d'e-mails via l'API Resend (https://resend.com).
 * Sans RESEND_API_KEY, la demande est simplement journalisée dans la console
 * du serveur (pratique en développement, à ne pas laisser en production).
 */

type Email = {
  sujet: string;
  texte: string;
  /** Destinataire ; par défaut ORDER_EMAIL_TO (la boutique) */
  a?: string;
  repondreA?: string;
};

export type ResultatEnvoi = { mode: "resend" | "console" };

export async function envoyerEmail({ sujet, texte, a, repondreA }: Email): Promise<ResultatEnvoi> {
  const cle = process.env.RESEND_API_KEY;
  const destinataire = a ?? process.env.ORDER_EMAIL_TO;

  if (!cle || !destinataire) {
    if (cle && !destinataire) console.warn("[e-mail] ORDER_EMAIL_TO n'est pas défini : demande journalisée.");
    console.info(
      `\n[e-mail non envoyé — journalisé]\nÀ : ${destinataire ?? "(boutique)"}\nSujet : ${sujet}\n\n${texte}\n`,
    );
    return { mode: "console" };
  }

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "ART & STONE <onboarding@resend.dev>",
      to: [destinataire],
      subject: sujet,
      text: texte,
      ...(repondreA ? { reply_to: repondreA } : {}),
    }),
  });

  if (!reponse.ok) {
    const detail = await reponse.text().catch(() => "");
    throw new Error(`Resend a refusé l'envoi (${reponse.status}) : ${detail.slice(0, 300)}`);
  }
  return { mode: "resend" };
}
