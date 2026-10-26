/**
 * ============================================================
 *  CATALOGUE ART & STONE — LE SEUL FICHIER À MODIFIER
 * ============================================================
 *
 * Pour modifier un prix : changez `prix` (en euros TTC) et passez
 * `prixProvisoire` à `false` quand le prix est définitif.
 *
 * RÈGLE IMPORTANTE : ne jamais inventer une caractéristique technique.
 * Les champs `poidsKgParUnite`, `formats`, `epaisseur`, `origine`,
 * `antiderapant` et `resistantGel` restent à `null` tant qu'ils ne sont
 * pas confirmés. Un champ à `null` n'est jamais affiché sur le site.
 *
 * Images : passez `photoReelle` à `true` pour une vraie photo (badge
 * « Photo réelle ») et `generationIA` à `true` pour un visuel d'ambiance
 * généré par IA (mention « non contractuel » affichée dessous).
 */

/* ---------- Vocabulaire (filtres et libellés) ---------- */

export type Categorie = "sols" | "piscine" | "jardin" | "murs" | "entretien";
export type Usage = "interieur" | "terrasse" | "piscine" | "jardin" | "mur";
export type Teinte = "creme" | "greige" | "gris" | "fonce";
export type Finition = "vieillie" | "sablee-brossee" | "polie" | "eclatee" | "brossee";
export type Unite = "m2" | "ml" | "piece" | "bidon";

export type ImageProduit = {
  url: string;
  alt: string;
  photoReelle: boolean;
  generationIA: boolean;
};

export type Produit = {
  slug: string;
  nom: string;
  categorie: Categorie;
  usages: Usage[];
  /** null = teinte non renseignée (le produit n'apparaît pas dans le filtre teinte) */
  teinte: Teinte | null;
  /** null = finition non renseignée */
  finition: Finition | null;
  unite: Unite;
  /** Prix TTC en euros, dans l'unité du produit */
  prix: number;
  /** true = prix indicatif, affiché avec la mention « Prix indicatif » */
  prixProvisoire: boolean;
  poidsKgParUnite: number | null;
  formats: string | null;
  epaisseur: string | null;
  origine: string | null;
  antiderapant: boolean | null;
  resistantGel: boolean | null;
  /** 1 à 2 phrases, sans caractéristique technique */
  descriptionCourte: string;
  images: ImageProduit[];
  bestSeller: boolean;
  /** Margelles : le client doit choisir un profil de nez avant l'ajout au panier */
  profilNezObligatoire?: boolean;
  /** Produits d'entretien : contenance et rendement, pour calculer le nombre de bidons */
  entretien?: {
    contenanceL: number;
    rendementM2ParL: number;
    precisionRendement?: string;
  };
};

export const CATEGORIES: Record<
  Categorie,
  { nom: string; titre: string; intro: string; image: string; imageAlt: string }
> = {
  sols: {
    nom: "Sols",
    titre: "Sols intérieur & terrasse",
    intro:
      "Des dallages en pierre naturelle pour la maison et la terrasse : tons crème, greige ou gris, en finition vieillie pour l'esprit ancien ou sablée brossée pour l'extérieur.",
    image: "https://artandstone.fr/images/dallage_aurelia_greige_vieillie_cuisine.webp",
    imageAlt: "Dallage en pierre naturelle greige posé dans une cuisine",
  },
  piscine: {
    nom: "Piscine",
    titre: "Margelles de piscine",
    intro:
      "Des margelles en pierre naturelle pour border votre piscine. Choisissez la teinte, la finition et le profil de nez qui vous plaisent.",
    image: "https://artandstone.fr/images/villa_saint_tropez_piscine_aurelia_beige_1.webp",
    imageAlt: "Piscine bordée de margelles et dallage en pierre naturelle greige",
  },
  jardin: {
    nom: "Jardin",
    titre: "Pierres de jardin",
    intro:
      "Pas japonais pour tracer un chemin, couvertines pour coiffer vos murets : la pierre naturelle pour habiller le jardin.",
    image: "https://artandstone.fr/images/pas_japonais_xl_aurelia_greige_authentique_1.webp",
    imageAlt: "Pas japonais en pierre naturelle greige",
  },
  murs: {
    nom: "Murs",
    titre: "Parements muraux",
    intro:
      "Des parements en pierre naturelle à la surface éclatée pour donner du relief et du caractère à vos façades et à vos murs.",
    image: "https://artandstone.fr/images/parement_rock_face_provencale_facade.webp",
    imageAlt: "Façade habillée de parements en pierre naturelle éclatée",
  },
  entretien: {
    nom: "Entretien",
    titre: "Produits d'entretien",
    intro:
      "Protéger, nettoyer, rénover : les produits pour garder votre pierre naturelle belle longtemps, avec le calcul du nombre de bidons selon votre surface.",
    image: "https://artandstone.fr/images/protect_pierre_base_officiel.webp",
    imageAlt: "Bidon de Protect Pierre Base",
  },
};

export const USAGES: Record<Usage, { label: string }> = {
  interieur: { label: "Intérieur" },
  terrasse: { label: "Terrasse" },
  piscine: { label: "Tour de piscine" },
  jardin: { label: "Jardin" },
  mur: { label: "Mur" },
};

export const TEINTES: Record<Teinte, { label: string; pastille: string }> = {
  creme: { label: "Crème", pastille: "#ebdfc8" },
  greige: { label: "Greige", pastille: "#c9bba6" },
  gris: { label: "Gris", pastille: "#a19d96" },
  fonce: { label: "Foncé", pastille: "#5b544d" },
};

export const FINITIONS: Record<Finition, { label: string; explication: string }> = {
  vieillie: {
    label: "Vieillie",
    explication: "Bords adoucis et surface patinée, aspect pierre ancienne.",
  },
  "sablee-brossee": {
    label: "Sablée brossée",
    explication: "Surface légèrement texturée et douce au toucher, antidérapante, idéale en extérieur.",
  },
  polie: {
    label: "Polie",
    explication: "Surface lisse et brillante qui fait ressortir les nuances et les veines de la pierre.",
  },
  eclatee: {
    label: "Éclatée",
    explication: "Surface brute obtenue en fendant la pierre, avec un relief marqué et naturel.",
  },
  brossee: {
    label: "Brossée",
    explication: "Surface passée à la brosse, légèrement ondulée et satinée, douce au toucher.",
  },
};

export const UNITES: Record<Unite, { suffixe: string; libelle: string; quantite: string; saisie: string }> = {
  m2: { suffixe: "/m²", libelle: "le m²", quantite: "m²", saisie: "Surface à couvrir" },
  ml: {
    suffixe: "/ml",
    libelle: "le mètre linéaire",
    quantite: "ml",
    saisie: "Longueur à couvrir",
  },
  piece: { suffixe: "/pièce", libelle: "la pièce", quantite: "pièce(s)", saisie: "Nombre de pièces" },
  bidon: { suffixe: "/bidon", libelle: "le bidon", quantite: "bidon(s)", saisie: "Surface à traiter" },
};

/** Kit d'échantillons (page /echantillons) */
export const KIT_ECHANTILLONS = {
  prix: 9.9,
  nombre: 3,
  nom: "Kit de 3 échantillons",
  image: "https://artandstone.fr/images/dallage_aurelia_greige_vieillie_cuisine.webp",
} as const;

/** Marge de coupe proposée par défaut dans le calculateur (10 %) */
export const MARGE_COUPE = 0.1;

/* ---------- Valeurs par défaut des champs techniques (non renseignés) ---------- */

const NON_RENSEIGNE = {
  poidsKgParUnite: null,
  formats: null,
  epaisseur: null,
  origine: null,
  antiderapant: null,
  resistantGel: null,
} as const;

const img = (fichier: string, alt: string): ImageProduit => ({
  url: `https://artandstone.fr/images/${fichier}`,
  alt,
  // À renseigner : passer à true pour les vraies photos / pour les visuels IA.
  photoReelle: false,
  generationIA: false,
});

/* ---------- Catalogue ---------- */

export const PRODUITS: Produit[] = [
  /* ===== SOLS — prix au m², provisoires ===== */
  {
    slug: "dallage-aurelia-greige-vieillie",
    nom: "Dallage Aurelia Greige Vieillie",
    categorie: "sols",
    usages: ["interieur", "terrasse"],
    teinte: "greige",
    finition: "vieillie",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Un dallage aux tons greige chaleureux, aux bords adoucis et à la surface patinée, qui donne au sol le charme d'une maison de famille provençale.",
    images: [
      img("dallage_aurelia_greige_vieillie_cuisine.webp", "Dallage Aurelia Greige Vieillie posé au sol d'une cuisine"),
    ],
    bestSeller: true,
  },
  {
    slug: "dallage-aurelia-greige-sablee-brossee",
    nom: "Dallage Aurelia Greige Sablée Brossée",
    categorie: "sols",
    usages: ["terrasse", "piscine"],
    teinte: "greige",
    finition: "sablee-brossee",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Le greige lumineux de l'Aurelia dans une finition sablée brossée, douce au toucher, pensée pour les terrasses et les abords de piscine.",
    images: [img("dallage_aurelia_beige_sablee_brossee_pose.webp", "Dallage Aurelia Greige Sablée Brossée posé")],
    bestSeller: true,
  },
  {
    slug: "dallage-aurelia-grise-vieillie",
    nom: "Dallage Aurelia Grise Vieillie",
    categorie: "sols",
    usages: ["interieur", "terrasse"],
    teinte: "gris",
    finition: "vieillie",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une pierre aux nuances grises, patinée et adoucie, pour un sol au caractère affirmé, à l'intérieur comme en terrasse.",
    images: [img("dallage_aurelia_grise_vieillie_1.webp", "Dallage Aurelia Grise Vieillie posé")],
    bestSeller: true,
  },
  {
    slug: "dallage-bastide-mix",
    nom: "Dallage Bastide Mix",
    categorie: "sols",
    usages: ["interieur", "terrasse"],
    teinte: "greige",
    // À préciser : finition non communiquée.
    finition: null,
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Un dallage d'esprit bastide aux nuances greige, pour un sol naturel et chaleureux, de la maison jusqu'à la terrasse.",
    images: [img("dallage_bastide_mix_pose.webp", "Dallage Bastide Mix posé")],
    bestSeller: true,
  },
  {
    slug: "dallage-pierre-de-solene-vieillie",
    nom: "Dallage Pierre de Solène Vieillie",
    categorie: "sols",
    usages: ["interieur"],
    teinte: "creme",
    finition: "vieillie",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une pierre claire aux tons crème, à l'aspect ancien, qui apporte douceur et lumière aux pièces de vie.",
    images: [img("dallage_pierre_solene_vieillie_pose.webp", "Dallage Pierre de Solène Vieillie posé")],
    bestSeller: false,
  },
  {
    slug: "dallage-cremo-perla-extra-sablee-brossee",
    nom: "Dallage Cremo Perla Extra Sablée Brossée",
    categorie: "sols",
    usages: ["terrasse", "piscine"],
    teinte: "creme",
    finition: "sablee-brossee",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une pierre crème très lumineuse, en finition sablée brossée, pour des terrasses et des plages de piscine claires et élégantes.",
    images: [
      img("dallage_perla_bianca_sablee_brossee_3.webp", "Dallage Cremo Perla Extra Sablée Brossée, teinte crème"),
    ],
    bestSeller: false,
  },
  {
    slug: "dallage-opus-incertum-aurelia-greige-brosse",
    nom: "Dallage Opus Incertum Aurelia Greige Brossé",
    categorie: "sols",
    usages: ["terrasse", "interieur"],
    teinte: "greige",
    finition: "brossee",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Des dalles aux formes irrégulières assemblées comme un puzzle : l'opus incertum donne un sol au rendu naturel et authentique.",
    images: [
      img(
        "dallage_opus_incertum_aurelia_greige_brosse_1.webp",
        "Dallage Opus Incertum Aurelia Greige Brossé aux formes irrégulières",
      ),
    ],
    bestSeller: false,
  },
  {
    slug: "dallage-tomette-3-couleurs-vieillie",
    nom: "Dallage Tomette 3 Couleurs Vieillie",
    categorie: "sols",
    usages: ["interieur"],
    teinte: "greige",
    finition: "vieillie",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "La tomette revisitée en pierre naturelle, en trois couleurs mélangées, pour un sol au charme provençal.",
    images: [
      img(
        "dallage_tomette_3_couleurs_vieillie_couloir.webp",
        "Dallage Tomette 3 Couleurs Vieillie posé dans un couloir",
      ),
    ],
    bestSeller: false,
  },
  {
    slug: "dallage-barrette-aurelia-greige",
    nom: "Dallage Barrette Aurelia Greige",
    categorie: "sols",
    usages: ["terrasse", "interieur"],
    teinte: "greige",
    // À préciser : finition non communiquée.
    finition: null,
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Des barrettes en Aurelia greige pour dessiner des poses à l'anglaise ou en chevrons, en terrasse comme à l'intérieur.",
    images: [
      img(
        "dallage_barrette_aurelia_greige_egypte_terrasse.webp",
        "Dallage Barrette Aurelia Greige posé sur une terrasse",
      ),
    ],
    bestSeller: false,
  },
  {
    slug: "dallage-chevrons-pierre-de-solene-vieillie",
    nom: "Dallage Chevrons Pierre de Solène Vieillie",
    categorie: "sols",
    usages: ["interieur"],
    teinte: "creme",
    finition: "vieillie",
    unite: "m2",
    prix: 79,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "La Pierre de Solène aux tons crème, posée en chevrons, pour un sol intérieur élégant et intemporel.",
    images: [
      img(
        "dallage_chevrons_pierre_de_solene_vieillie_interieur.webp",
        "Dallage Chevrons Pierre de Solène Vieillie posé en intérieur",
      ),
    ],
    bestSeller: false,
  },

  /* ===== PISCINE — prix au mètre linéaire, provisoires ===== */
  {
    slug: "margelle-aurelia-greige-sablee-brossee",
    nom: "Margelle Aurelia Greige Sablée Brossée",
    categorie: "piscine",
    usages: ["piscine"],
    teinte: "greige",
    finition: "sablee-brossee",
    unite: "ml",
    prix: 89,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une margelle greige douce au toucher, en finition sablée brossée, pour border la piscine avec élégance.",
    images: [
      img(
        "margelle_aurelia_beige_sablee_brossee_piscine.webp",
        "Margelle Aurelia Greige Sablée Brossée autour d'une piscine",
      ),
    ],
    bestSeller: true,
    profilNezObligatoire: true,
  },
  {
    slug: "margelle-aurelia-greige-vieillie",
    nom: "Margelle Aurelia Greige Vieillie",
    categorie: "piscine",
    usages: ["piscine"],
    teinte: "greige",
    finition: "vieillie",
    unite: "ml",
    prix: 89,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une margelle aux bords adoucis et à la surface patinée, pour un tour de piscine à l'esprit mas provençal.",
    images: [img("margelle-aurelia-greige-vieillie-1.webp", "Margelle Aurelia Greige Vieillie")],
    bestSeller: false,
    profilNezObligatoire: true,
  },
  {
    slug: "margelle-pierre-de-solene-vieillie",
    nom: "Margelle Pierre de Solène Finition Vieillie",
    categorie: "piscine",
    usages: ["piscine"],
    teinte: "creme",
    finition: "vieillie",
    unite: "ml",
    prix: 89,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une margelle claire aux tons crème, à l'aspect pierre ancienne, qui illumine le tour de la piscine.",
    images: [
      img(
        "margelle_pierre_de_solene_finition_vieillie_piscine_1.webp",
        "Margelle Pierre de Solène Vieillie autour d'une piscine",
      ),
    ],
    bestSeller: false,
    profilNezObligatoire: true,
  },

  /* ===== JARDIN — prix provisoires ===== */
  {
    slug: "pas-japonais-xl-aurelia-greige-authentique",
    nom: "Pas Japonais XL Aurelia Greige Authentique",
    categorie: "jardin",
    usages: ["jardin"],
    teinte: "greige",
    // À préciser : la finition « Authentique » ne correspond à aucune des 5 finitions du filtre.
    finition: null,
    unite: "piece",
    prix: 45,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "De grandes pierres de pas japonais à poser dans la pelouse ou le gravier, pour tracer un chemin naturel à travers le jardin.",
    images: [img("pas_japonais_xl_aurelia_greige_authentique_1.webp", "Pas japonais XL Aurelia Greige Authentique")],
    bestSeller: false,
  },
  {
    slug: "pas-japonais-aurelia-greige-vieillie",
    nom: "Pas Japonais Aurelia Greige Vieillie",
    categorie: "jardin",
    usages: ["jardin"],
    teinte: "greige",
    finition: "vieillie",
    unite: "piece",
    prix: 45,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte: "Des pas japonais patinés aux bords adoucis, pour créer une allée de jardin au charme ancien.",
    images: [img("img_pas_japonais_aurelia_beige_vieillie.webp", "Pas japonais Aurelia Greige Vieillie")],
    bestSeller: false,
  },
  {
    slug: "couvertine-aurelia-greige-vieillie",
    nom: "Couvertine Aurelia Greige Vieillie",
    categorie: "jardin",
    usages: ["jardin", "mur"],
    teinte: "greige",
    finition: "vieillie",
    unite: "ml",
    prix: 69,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Une couvertine en pierre pour coiffer murets et murs de clôture d'une belle finition naturelle.",
    images: [img("couvertine_aurelia_greige_vieillie_3.webp", "Couvertine Aurelia Greige Vieillie")],
    bestSeller: false,
  },

  /* ===== MURS — prix au m², provisoires ===== */
  {
    slug: "parements-rock-face-provencale",
    nom: "Parements Rock Face Provençale",
    categorie: "murs",
    usages: ["mur"],
    // À préciser : teinte non communiquée.
    teinte: null,
    finition: "eclatee",
    unite: "m2",
    prix: 75,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Un parement à la surface éclatée en relief, pour habiller façades et murs d'un caractère provençal.",
    images: [img("parement_rock_face_provencale_facade.webp", "Façade habillée de Parements Rock Face Provençale")],
    bestSeller: false,
  },
  {
    slug: "parements-aurelia-greige-grand-format-eclate",
    nom: "Parements Aurelia Greige Grand Format Éclaté",
    categorie: "murs",
    usages: ["mur"],
    teinte: "greige",
    finition: "eclatee",
    unite: "m2",
    prix: 75,
    prixProvisoire: true,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "De grands parements greige à la surface éclatée, pour des murs au relief naturel et contemporain.",
    images: [img("parement_aurelia_beige_grand_format_eclate_1.webp", "Parements Aurelia Greige Grand Format Éclaté")],
    bestSeller: false,
  },

  /* ===== ENTRETIEN — prix réels ===== */
  {
    slug: "protect-pierre-base",
    nom: "Protect Pierre Base",
    categorie: "entretien",
    usages: [],
    teinte: null,
    finition: null,
    unite: "bidon",
    prix: 99,
    prixProvisoire: false,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Minéralisant hydrofuge à appliquer en première couche, pour protéger la pierre contre l'eau. Bidon de 2 L.",
    images: [img("protect_pierre_base_officiel.webp", "Bidon de Protect Pierre Base, 2 litres")],
    bestSeller: true,
    entretien: { contenanceL: 2, rendementM2ParL: 12.5, precisionRendement: "par couche" },
  },
  {
    slug: "protect-pierre-finish",
    nom: "Protect Pierre Finish",
    categorie: "entretien",
    usages: [],
    teinte: null,
    finition: null,
    unite: "bidon",
    prix: 110,
    prixProvisoire: false,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Minéralisant oléofuge de finition, appliqué après Protect Pierre Base pour protéger la pierre des taches grasses. Bidon de 2 L.",
    images: [img("protect_pierre_finish_officiel.webp", "Bidon de Protect Pierre Finish, 2 litres")],
    bestSeller: false,
    entretien: { contenanceL: 2, rendementM2ParL: 12.5 },
  },
  {
    slug: "clean-pro",
    nom: "Clean Pro",
    categorie: "entretien",
    usages: [],
    teinte: null,
    finition: null,
    unite: "bidon",
    prix: 77,
    prixProvisoire: false,
    ...NON_RENSEIGNE,
    descriptionCourte:
      "Nettoyant antimousse pour débarrasser terrasses, allées et murs en pierre des mousses. Bidon de 5 L.",
    images: [img("clean_pro_officiel.webp", "Bidon de nettoyant antimousse Clean Pro, 5 litres")],
    bestSeller: false,
    entretien: { contenanceL: 5, rendementM2ParL: 10 },
  },
  {
    slug: "decap-pro",
    nom: "Decap Pro",
    categorie: "entretien",
    usages: [],
    teinte: null,
    finition: null,
    unite: "bidon",
    prix: 55,
    prixProvisoire: false,
    ...NON_RENSEIGNE,
    descriptionCourte: "Décapant pour un nettoyage intensif de la pierre, notamment après chantier. Bidon de 2 L.",
    images: [img("decap_pro_officiel.webp", "Bidon de décapant Decap Pro, 2 litres")],
    bestSeller: false,
    entretien: { contenanceL: 2, rendementM2ParL: 15 },
  },
];

/** Produits proposés en « produits associés » sur les fiches pierre */
export const SLUGS_PROTECTION = ["protect-pierre-base", "protect-pierre-finish"] as const;

/* ---------- Profils de nez des margelles ---------- */

export type ProfilNez = "N1" | "N2" | "N3" | "N4" | "N5";

export const PROFILS_NEZ: Record<ProfilNez, { nom: string; description: string }> = {
  N1: { nom: "Nez arrondi ½ boudin", description: "Bord entièrement arrondi en demi-cercle." },
  N2: { nom: "Arête légèrement arrondie", description: "Bord droit aux angles légèrement adoucis." },
  N3: { nom: "Léger chanfrein 45°", description: "Angle supérieur coupé en biais, à 45°." },
  N4: { nom: "Nez à talon", description: "Nez arrondi prolongé par un retombant sous la margelle." },
  N5: {
    nom: "Rainure goutte d'eau",
    description: "Rainure sous le nez : l'eau goutte au lieu de couler sous la margelle.",
  },
};
