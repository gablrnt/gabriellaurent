# ART & STONE — boutique en ligne (particuliers)

Boutique B2C de pierre naturelle d'ART & STONE (Tarascon, 13).
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Aucune dépendance en dehors de Next.js et React : Stripe et Resend sont appelés directement via leurs API.

---

## 1. Installation et lancement

Prérequis : **Node.js 20.9 ou plus récent** (Node 22 recommandé).

```bash
cd art-and-stone
npm install
cp .env.example .env.local   # puis complétez les variables (facultatif en local)
npm run dev                  # http://localhost:3000
```

Autres commandes :

| Commande        | Rôle                                                  |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | serveur de développement                              |
| `npm run build` | build de production (vérifie aussi le TypeScript)     |
| `npm run start` | lance le build de production (`npm run build` avant)  |
| `npm run lint`  | vérification du code (ESLint)                         |

## 2. Variables d'environnement

Voir `.env.example`. Toutes sont facultatives pour tester en local.

| Variable               | Effet                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | adresse publique du site (ex. `https://boutique.artandstone.fr`) : sitemap, Open Graph, retour après paiement.                                   |
| `STRIPE_SECRET_KEY`    | active le paiement par carte (Stripe Checkout). **Sans cette clé**, la dernière étape affiche « Confirmer la commande » : la commande vous est envoyée et vous rappelez le client sous 24 h. |
| `RESEND_API_KEY`       | envoi des e-mails (commandes, contact, accusé de réception client). **Sans cette clé**, les demandes sont seulement écrites dans les journaux du serveur. |
| `ORDER_EMAIL_TO`       | adresse qui reçoit les commandes et les messages.                                                                                               |
| `RESEND_FROM`          | (facultatif) expéditeur, sur un domaine vérifié dans Resend.                                                                                    |

> ⚠️ Ces variables sont lues **au moment du build**. Après les avoir modifiées sur Vercel ou Netlify, **relancez un déploiement**.

Comment se décide le paiement en ligne : le bouton « Payer par carte » n'apparaît que si `STRIPE_SECRET_KEY` est définie **et** que les frais de livraison sont calculables (retrait à Tarascon, ou poids connu de tous les produits dans une zone tarifée). Sinon, la commande part par e-mail avec la mention « Frais de livraison confirmés sous 24 h » ou « Devis de livraison sous 24 h ».

Avec Stripe : vous recevez un e-mail « paiement Stripe en cours » avec l'adresse et le mode de livraison. **Vérifiez toujours dans le tableau de bord Stripe que le paiement est bien encaissé** (même référence `AS-…`) avant de préparer la commande.

## 3. Modifier le contenu

Tout le contenu modifiable est dans le dossier `data/` — inutile de toucher au reste du code.

| Fichier                | Contenu                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `data/produits.ts`     | **produits, prix**, kit d'échantillons (prix), marge de coupe, finitions et leurs explications, profils de nez |
| `data/livraison.ts`    | **tarifs de livraison** par mode, zone et tranche de poids ; envoi des échantillons          |
| `data/site.ts`         | téléphone, horaires, Instagram, lien avis Google, menu, bandeau du haut                      |
| `data/faq.ts`          | questions fréquentes de l'accueil                                                            |
| `data/realisations.ts` | chantiers de la page Réalisations                                                            |
| `data/avis.ts`         | avis clients (vide : à remplir uniquement avec de vrais avis)                                |

### Changer un prix

Dans `data/produits.ts`, modifiez `prix` (en euros **TTC**, dans l'unité du produit). Quand le prix est définitif, passez `prixProvisoire: false` : la mention « Prix indicatif » disparaît. Quand **plus aucun** produit n'a `prixProvisoire: true`, le bandeau « Site en préparation — prix indicatifs » disparaît tout seul.

### Renseigner les caractéristiques techniques

Les champs `poidsKgParUnite`, `formats`, `epaisseur`, `origine`, `antiderapant` et `resistantGel` sont à `null` : ils ne s'affichent pas. Renseignez-les uniquement avec des valeurs confirmées. Exemple :

```ts
poidsKgParUnite: 55,          // kg par m², par ml ou par pièce selon l'unité
formats: "40 × 60 cm, 60 × 60 cm",
epaisseur: "2 cm",
origine: "Turquie",
antiderapant: true,
resistantGel: true,
```

Dès que **tous** les produits d'un panier ont un poids, le site calcule les frais de livraison et affiche le poids total.

### Photos

Chaque image a deux cases à cocher :

- `photoReelle: true` → badge « Photo réelle » sur l'image ;
- `generationIA: true` → mention « Visuel d'ambiance généré par IA, non contractuel » sous l'image.

Elles sont **toutes à `false` pour l'instant** : à renseigner photo par photo. Pour ajouter une photo, ajoutez une ligne dans `images` (la première image sert de vignette). Les images doivent venir de `artandstone.fr/images/…` (autorisé dans `next.config.ts`).

### Ajouter un produit

Copiez un bloc existant dans `PRODUITS`, changez le `slug` (unique, sans accent ni espace : il devient l'adresse `/produit/mon-slug`), le nom, la catégorie, etc. Pour une margelle, gardez `profilNezObligatoire: true`. La page, le sitemap et les filtres se mettent à jour au prochain build.

### Tarifs de livraison

Dans `data/livraison.ts`, la grille `TARIFS` donne, pour chaque mode (hayon, grue) et chaque zone (France, Corse, Suisse), des tranches `{ jusquaKg, prix }`. **Toutes les valeurs actuelles sont des exemples provisoires** à remplacer. Au-delà de la dernière tranche, le site affiche « Frais de livraison confirmés sous 24 h ».

## 4. Déploiement

Le site se trouve dans le sous-dossier `art-and-stone/` du dépôt.

### Vercel

1. « Add New… → Project », importez le dépôt GitHub.
2. **Root Directory : `art-and-stone`** (Framework : Next.js, détecté automatiquement).
3. Ajoutez les variables d'environnement, puis « Deploy ».

### Netlify

Le fichier `netlify.toml` à la racine du dépôt indique déjà le dossier (`base = "art-and-stone"`), la commande (`npm run build`) et le dossier publié (`.next`). Importez le dépôt, ajoutez les variables d'environnement (portée « Builds » et « Functions »), déployez.

### Après la mise en ligne

- Renseignez `NEXT_PUBLIC_SITE_URL` avec l'adresse définitive et redéployez.
- Vérifiez l'expéditeur Resend (domaine vérifié) et faites une commande test.
- Passez Stripe en mode live (`sk_live_…`) après un test en mode test (`sk_test_…`, carte `4242 4242 4242 4242`).

## 5. À compléter avant l'ouverture

- [ ] Prix définitifs (`prixProvisoire: false`).
- [ ] Caractéristiques techniques réelles (poids, formats, épaisseurs, origine, antidérapant, gel).
- [ ] Finitions non renseignées : Dallage Bastide Mix, Dallage Barrette Aurelia Greige, Pas Japonais XL « Authentique » ; teinte des Parements Rock Face Provençale.
- [ ] `photoReelle` / `generationIA` sur chaque photo.
- [ ] Tarifs de livraison réels et tarif d'envoi des échantillons.
- [ ] CGV, mentions légales et politique de confidentialité : compléter les [crochets] **et faire valider par un professionnel**.
- [ ] Avis clients réels dans `data/avis.ts` (facultatif).

## 6. Organisation du code

```
app/                    pages (App Router) et routes API
  [categorie]/          Sols, Piscine, Jardin, Murs, Entretien
  produit/[slug]/       fiche produit (générée statiquement)
  api/commande          commande sans paiement → e-mail
  api/checkout          paiement Stripe Checkout
  api/contact           formulaire de contact → e-mail
components/             composants réutilisables (layout, produit, panier, commande, sections, ui)
data/                   contenu modifiable (voir ci-dessus)
lib/                    calculs, validation, panier, e-mail, Stripe
```

Choix techniques : panier en React context + `localStorage` (fonctionne aussi si le stockage est bloqué, le temps de la visite) ; prix toujours recalculés côté serveur ; validation des formulaires partagée navigateur/serveur ; champ piège anti-robots ; animations désactivées si l'utilisateur a demandé à réduire les animations.
