/**
 * FAQ de la page d'accueil.
 * Les réponses ne doivent contenir que des informations confirmées.
 */

export type QuestionReponse = { question: string; reponse: string };

export const FAQ: QuestionReponse[] = [
  {
    question: "Quels sont les délais de livraison ?",
    reponse:
      "Nos pierres sont en stock à Tarascon. Le délai dépend de votre zone et du mode de livraison choisi : nous vous le confirmons sous 24 h après votre commande, avant toute expédition.",
  },
  {
    question: "Comment se passe la livraison ?",
    reponse:
      "Nous livrons en camion partout en France continentale, en Corse et en Suisse : camion avec hayon (dépose au pied du camion) ou camion grue (dépose au plus près du chantier, selon l'accès). Vous pouvez aussi retirer gratuitement votre commande à notre stock de Tarascon. Pour les autres pays européens, nous vous envoyons un devis de livraison sous 24 h.",
  },
  {
    question: "Puis-je voir la pierre avant d'acheter ?",
    reponse:
      "Oui, et nous le recommandons : commandez un kit de 3 échantillons au choix pour 9,90 €. Ce montant vous est remboursé en bon d'achat sur votre commande.",
  },
  {
    question: "Quelle quantité commander ?",
    reponse:
      "Mesurez votre surface en m² (ou votre longueur en mètres linéaires pour les margelles et couvertines) et saisissez-la dans le calculateur de la fiche produit. Il ajoute par défaut 10 % de marge pour les coupes et la casse, et arrondit à l'unité supérieure. En cas de doute, appelez-nous.",
  },
  {
    question: "Puis-je retourner ma commande ?",
    reponse:
      "Vous disposez d'un délai de rétractation de 14 jours après réception. La pierre étant lourde, le retour se fait par transporteur et reste à votre charge. À la livraison, vérifiez bien la marchandise et notez toute réserve sur le bon du transporteur.",
  },
  {
    question: "Comment entretenir ma pierre naturelle ?",
    reponse:
      "Au quotidien, un savon doux au pH neutre suffit ; évitez les produits acides. Pour la protéger, appliquez Protect Pierre Base puis Protect Pierre Finish. Clean Pro élimine les mousses en extérieur et Decap Pro nettoie en profondeur après le chantier.",
  },
];
