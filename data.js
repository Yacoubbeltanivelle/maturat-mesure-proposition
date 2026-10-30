// Contenus et données de la maquette. Tous les textes sont des propositions et toutes
// les données produits, fournisseurs et demandes sont fictives.
// Les composants (js/) lisent ce module ; aucun contenu n'est dupliqué ailleurs.

export const BASE_ASSETS = {
  logo: 'assets/maturat-logo.png',
  atlas: 'assets/product-atlas.png',
  pdf: 'assets/documents/fiche-demonstration.pdf',
  photoPipes: 'assets/photos/industrial-pipes.jpg',
  photoBlue: 'assets/photos/industrial-blue.jpg',
};

// Atlas 4 colonnes x 3 lignes, lecture ligne par ligne. Produits fictifs.
export const ATLAS = [
  'Niveau magnétique',
  'Débitmètre ultrasonique',
  'Sonde de température',
  'Transmetteur de pression',
  'Convertisseur de signal',
  'Régulateur',
  'Séparateur air',
  'Vanne inox',
  'Sonde d’analyse liquide',
  'Téléphone industriel',
  'Raccords pneumatiques',
  'Bobine de tubing inox',
];

export const SITE = {
  name: 'Maturat Mesure',
  banner: 'Maquette · données fictives · aucun envoi ni conservation réelle',
  adminLink: 'Administration de démonstration',
  nav: [
    { route: '/catalogue', label: 'Catalogue' },
    { route: '/dropout', label: 'Dropout' },
    { route: '/fournisseurs', label: 'Fournisseurs', feature: 'showSuppliers' },
    { route: '/entreprise', label: 'Entreprise' },
    { route: '/faq', label: 'Questions' },
  ],
  cta: 'Décrire mon besoin',
  mobile: 'Cette maquette se consulte sur ordinateur. Ouvrez ce lien sur un écran plus large pour découvrir le site.',
};

export const HOME = {
  title: 'Mesurer. Contrôler. Maîtriser vos procédés.',
  intro: 'Instrumentation et solutions de contrôle pour vos procédés industriels. Définissons ensemble la solution adaptée à votre application.',
  primary: 'Explorer le catalogue',
  secondary: 'Décrire mon besoin',
  measuresLabel: 'Quatre grandeurs, un même savoir-faire',
  measures: [
    { id: 'niveau', unit: 'm', label: 'Niveau', cell: 0, text: 'Mesurer et détecter le niveau de liquides ou de solides, selon les contraintes du procédé.' },
    { id: 'debit', unit: 'm³/h', label: 'Débit', cell: 1, text: 'Suivre le débit d’un fluide avec une technologie cohérente avec le procédé.' },
    { id: 'temperature', unit: '°C', label: 'Température', cell: 2, text: 'Suivre la température de votre installation et choisir le principe de mesure adapté.' },
    { id: 'pression', unit: 'bar', label: 'Pression', cell: 3, text: 'Mesurer la pression de vos fluides, au plus près de votre application.' },
  ],
  measureNote: 'Visuels d’illustration de produits fictifs. Aucune référence n’est garantie.',
  domainsTitle: 'Sept domaines, un seul interlocuteur',
  domainsIntro: 'Du capteur au raccord, des signaux aux mesures de laboratoire : chaque domaine regroupe des familles et des exemples de fiches.',
  featuredTitle: 'Produits à la une',
  featuredIntro: 'Deux exemples de fiches mises en avant. Dans l’administration de démonstration, ce choix se règle fiche par fiche.',
  dropout: {
    kicker: 'Traitement d’air',
    title: 'Dropout : l’eau liquide hors de vos circuits d’air',
    text: 'Condensats et gouttes d’eau dans l’air comprimé fragilisent instruments, régulateurs et actionneurs. Un séparateur Dropout intervient là où l’eau liquide pose problème. Nous précisons ensemble si c’est la bonne réponse à votre installation.',
    points: ['Eau liquide et condensats : le problème traité', 'Humidité de vapeur : une autre réponse, à discuter', 'Dimensionnement et installation : à confirmer'],
    cta: 'Comprendre le principe',
  },
  applicationsTitle: 'Des instruments pour vos contextes d’application',
  applicationsIntro: 'Quelques situations fréquentes, données comme exemples de lecture et non comme références clients.',
  applications: [
    { id: 'eau', title: 'Eau et environnement', text: 'Niveau de cuves et bassins, débit en conduite, analyse pH, redox, chlore ou conductivité.', links: [['instrumentation', 'niveau'], ['analyse-liquide', null]] },
    { id: 'energie', title: 'Énergie et utilités', text: 'Pression, température, régulation, air comprimé et condensats.', links: [['instrumentation', 'pression'], ['traitement-air', null]] },
    { id: 'procede', title: 'Chimie et procédés', text: 'Raccords et vannes inox, échantillonnage, contrôle du signal entre le terrain et la salle de contrôle.', links: [['raccords-inox', null], ['controle-signal', null]] },
    { id: 'terrain', title: 'Maintenance et terrain', text: 'Outils de terrain en zone à risque, applications HART, calibration et vérification.', links: [['smart-connexion', null], ['controle-signal', 'calibrateurs']] },
  ],
  suppliersTitle: 'Un réseau de fournisseurs',
  suppliersIntro: 'Les fournisseurs ci-dessous sont des exemples fictifs de présentation. La vraie liste est à renseigner.',
  companyTitle: 'Distribution et conseil en instrumentation',
  companyText: 'Maturat Mesure sélectionne, distribue et conseille. L’objectif est de vous aider à choisir un instrument cohérent avec votre application, puis de vous accompagner dans le choix du bon interlocuteur chez le fournisseur.',
  faqTitle: 'Questions fréquentes',
  contactTitle: 'Parlons de votre application',
  contactText: 'Décrivez votre besoin en quelques mots, ou dites simplement que vous ne savez pas encore quoi choisir. Un conseiller reprendra le sujet avec vous.',
};

export const COMPANY = {
  roles: [
    { title: 'Distribuer', text: 'Mettre à disposition des instruments et des composants de fournisseurs sélectionnés, avec leurs documents.' },
    { title: 'Conseiller', text: 'Aider à passer d’un besoin parfois flou à une famille de solutions et aux bonnes questions à poser.' },
    { title: 'Accompagner', text: 'Rester l’interlocuteur entre votre installation et le fournisseur, de la demande à la mise en œuvre.' },
  ],
  method: [
    { title: 'Comprendre l’application', text: 'Fluide, environnement, contraintes de montage : le contexte avant la référence.' },
    { title: 'Proposer une direction', text: 'Une famille de produits et quelques options, avec leurs limites.' },
    { title: 'Confirmer avec le fournisseur', text: 'Les caractéristiques sont vérifiées avant toute décision.' },
    { title: 'Suivre la mise en œuvre', text: 'Un point de contact pour les questions qui suivent.' },
  ],
  intro: 'Maturat Mesure est un distributeur et un conseil en instrumentation. Cette page présente la manière de travailler, sans chiffres ni références clients tant qu’ils n’ont pas été fournis.',
};

export const SETTINGS = {
  contact: { email: 'contact@example.test', phone: '00 00 00 00 00', address: 'Adresse illustrative, à remplacer · 00000 Ville exemple', hours: 'Horaires à renseigner (exemple : du lundi au vendredi)' },
  seo: { title: 'Maturat Mesure · maquette', description: 'Maquette du site de Maturat Mesure, distribution et conseil en instrumentation.', ogTitle: 'Maturat Mesure · maquette' },
  features: { showSuppliers: true, showNews: true, showRecruitment: true, showPdf: true, requestForm: true, showFaqHome: true },
  social: { linkedin: '', youtube: '' },
  company: { legalName: 'Maturat Mesure', footerText: 'Distribution et conseil en instrumentation industrielle.', footerNote: 'Maquette de démonstration : textes et données à remplacer.' },
};

// Adresse interne : séparée des réglages publics, jamais affichée sur le site.
export const INTERNAL = { notifyEmail: 'reception-interne@example.test' };

export const FAMILIES = [
  { id: 'instrumentation', title: 'Instrumentation', cell: 0, short: 'Niveau, débit, température, pression.', description: 'Les quatre grandeurs de base d’un procédé. Chaque sous-famille regroupe des principes de mesure à comparer selon le fluide, la plage et le montage.', groups: [
    { id: 'niveau', title: 'Niveau', text: 'Liquides et solides, mesure continue ou détection.' },
    { id: 'debit', title: 'Débit', text: 'Principes de mesure selon le fluide et la conduite.' },
    { id: 'temperature', title: 'Température', text: 'Sondes et capteurs pour installations de procédé.' },
    { id: 'pression', title: 'Pression', text: 'Transmetteurs et capteurs au plus près du procédé.' } ] },
  { id: 'controle-signal', title: 'Contrôle du signal', cell: 4, short: 'Indicateurs, convertisseurs, régulateurs, calibrateurs.', description: 'Tout ce qui traite, affiche, convertit ou vérifie un signal entre le terrain et la salle de contrôle.', groups: [
    { id: 'indicateurs', title: 'Indicateurs', text: 'Affichage local ou en face avant.' },
    { id: 'convertisseurs', title: 'Convertisseurs', text: 'Isolation et conversion de signaux.' },
    { id: 'regulateurs', title: 'Régulateurs', text: 'Boucles de régulation de procédé.' },
    { id: 'calibrateurs', title: 'Calibrateurs', text: 'Vérification et étalonnage.' },
    { id: 'divers', title: 'Divers', text: 'Autres équipements de signal.' } ] },
  { id: 'traitement-air', title: 'Traitement d’air', cell: 6, short: 'Séparation de l’eau liquide : Dropout.', description: 'Protéger instruments, régulateurs et actionneurs de l’eau liquide présente dans l’air de service.', groups: [
    { id: 'dropout', title: 'Dropout', text: 'Séparateurs d’eau liquide pour air comprimé.' } ] },
  { id: 'raccords-inox', title: 'Raccords inox & contrôle des fluides', cell: 7, short: 'Raccords à bagues, vannes, manifolds, clapets, détendeurs.', description: 'Composants inox pour raccorder, isoler et contrôler les fluides d’une installation.', groups: [
    { id: 'raccords-bagues', title: 'Raccords à bagues', text: 'Raccordement de tubes inox.' },
    { id: 'vannes', title: 'Vannes', text: 'Isolement et régulation manuelle.' },
    { id: 'manifolds', title: 'Manifolds', text: 'Ensembles de vannes pour instrumentation.' },
    { id: 'clapets', title: 'Clapets', text: 'Anti-retour et sécurité.' },
    { id: 'detendeurs', title: 'Détendeurs', text: 'Réduction et stabilisation de pression.' } ] },
  { id: 'analyse-liquide', title: 'Échantillonnage & analyse liquide', cell: 8, short: 'pH, redox, chlore, conductivité.', description: 'Mesures d’analyse en ligne ou prélevées pour suivre la qualité d’un liquide.', groups: [
    { id: 'ph', title: 'pH', text: 'Acidité et basicité.' },
    { id: 'redox', title: 'Redox', text: 'Potentiel d’oxydo-réduction.' },
    { id: 'chlore', title: 'Chlore', text: 'Suivi de désinfectant.' },
    { id: 'conductivite', title: 'Conductivité', text: 'Charge ionique d’un liquide.' } ] },
  { id: 'smart-connexion', title: 'Smart connexion', cell: 9, short: 'Tablettes et téléphones ATEX, applications HART et DATI.', description: 'Outils numériques de terrain, y compris pour les zones à atmosphère explosive, et applications de configuration.', groups: [
    { id: 'atex', title: 'Tablettes et téléphones ATEX', text: 'Terminaux conçus pour les zones à risque.' },
    { id: 'apps', title: 'Applications HART / DATI', text: 'Configuration et diagnostic des instruments.' } ] },
  { id: 'produits-associes', title: 'Produits associés', cell: 10, short: 'Électrovannes, raccords et vannes pneumatiques, tubing.', description: 'Compléments d’installation : commande pneumatique et tubes.', groups: [
    { id: 'electrovannes', title: 'Électrovannes', text: 'Commande de fluides à distance.' },
    { id: 'pneumatique', title: 'Raccords et vannes pneumatiques', text: 'Circuit d’air de commande.' },
    { id: 'tubing', title: 'Tubing', text: 'Tubes inox au mètre ou en bobine.' } ] },
];

export const SUPPLIERS = [
  { id: 'exemple-instruments', name: 'Exemple Instruments', published: true, specialty: 'Mesure de niveau, débit et pression', text: 'Fournisseur fictif présenté pour illustrer une fiche fournisseur. Son contenu sera remplacé par les fournisseurs réels.' },
  { id: 'demo-fluides', name: 'Démo Fluides', published: true, specialty: 'Raccords, vannes et traitement d’air', text: 'Fournisseur fictif. Sert à montrer le lien entre un fournisseur et ses fiches.' },
  { id: 'modele-analyse', name: 'Modèle Analyse', published: true, specialty: 'Analyse de liquides', text: 'Fournisseur fictif pour les mesures pH, redox, chlore et conductivité.' },
  { id: 'studio-signal', name: 'Studio Signal', published: true, specialty: 'Signal, terrain et connectivité', text: 'Fournisseur fictif pour les convertisseurs, régulateurs et outils de terrain.' },
];

const SPECS_NOTE = 'Valeurs et caractéristiques d’exemple, fictives : à remplacer par la fiche réelle du fournisseur.';
export const PRODUCT_NOTE = SPECS_NOTE;

export const PRODUCTS = [
  { id: 'niveau-magnetique', title: 'Indicateur de niveau magnétique', ref: 'DEMO-NIV-100', supplier: 'exemple-instruments', family: 'instrumentation', group: 'niveau', status: 'publie', featured: true, cell: 0, document: true,
    summary: 'Lecture directe du niveau sur une cuve, sans énergie à l’affichage.',
    usage: 'Cuves et réservoirs où une lecture visuelle fiable est utile à l’opérateur.',
    description: 'Fiche d’exemple. Un flotteur aimanté entraîne un indicateur visuel placé le long d’une chambre. Le choix des matériaux, de la plage et du raccordement dépend du liquide et du montage.',
    specs: [['Principe', 'Flotteur aimanté et indicateur'], ['Lecture', 'Visuelle, directe'], ['Matériaux', 'À confirmer selon le fluide'], ['Raccordement', 'Selon l’installation']],
    applications: ['Cuves de stockage', 'Réservoirs intermédiaires', 'Bacs de procédé'], models: [] },
  { id: 'debitmetre-ultrasonique', title: 'Débitmètre ultrasonique', ref: 'DEMO-DEB-200', supplier: 'exemple-instruments', family: 'instrumentation', group: 'debit', status: 'publie', featured: true, cell: 1, document: false,
    summary: 'Gamme de débitmètres sans pièce mobile dans la conduite.',
    usage: 'Mesure du débit de liquides propres en conduite, selon la gamme retenue.',
    description: 'Fiche de gamme d’exemple : elle présente trois modèles fictifs pour comprendre comment une famille se décline, sans configurer de variantes. Le choix dépend du diamètre de la conduite et du fluide.',
    specs: [['Principe', 'Temps de transit ultrasonique'], ['Pièces mobiles', 'Aucune dans la conduite'], ['Fluides', 'Liquides, à confirmer'], ['Sortie', 'Selon le modèle']],
    applications: ['Eau de procédé', 'Boucles de circulation', 'Bilan de consommation'],
    models: [['Modèle S', 'Pour petites conduites. Exemple fictif.'], ['Modèle M', 'Pour conduites intermédiaires. Exemple fictif.'], ['Modèle C', 'À pince, pour mesure sans coupure du circuit. Exemple fictif.']] },
  { id: 'sonde-temperature', title: 'Sonde de température à tête de raccordement', ref: 'DEMO-TEM-300', supplier: 'exemple-instruments', family: 'instrumentation', group: 'temperature', status: 'publie', featured: false, cell: 2, document: false,
    summary: 'Sonde de procédé avec tête de raccordement.',
    usage: 'Suivi de température de fluides en conduite ou en cuve.',
    description: 'Fiche d’exemple. La longueur de plongée, la gaine et le principe de capteur sont à définir avec vous selon le fluide et la plage de température.',
    specs: [['Montage', 'Plongeante, avec tête'], ['Longueur', 'À définir'], ['Signal', 'À définir selon l’installation']],
    applications: ['Conduites de procédé', 'Cuves', 'Échangeurs'], models: [] },
  { id: 'transmetteur-pression', title: 'Transmetteur de pression', ref: 'DEMO-PRE-400', supplier: 'exemple-instruments', family: 'instrumentation', group: 'pression', status: 'publie', featured: false, cell: 3, document: false,
    summary: 'Gamme de transmetteurs avec affichage local selon le modèle.',
    usage: 'Mesure de pression relative ou différentielle dans un procédé.',
    description: 'Fiche de gamme d’exemple, avec deux familles fictives de transmetteurs. Plage, précision et raccords ne sont pas indiqués : ils dépendent du projet.',
    specs: [['Principe', 'Capteur et électronique de transmission'], ['Affichage', 'Local, selon le modèle'], ['Plage', 'À définir']],
    applications: ['Réseaux de fluide', 'Réservoirs sous pression', 'Contrôle de filtres'],
    models: [['Série relative', 'Pression relative. Exemple fictif.'], ['Série différentielle', 'Écart de pression entre deux points. Exemple fictif.']] },
  { id: 'convertisseur-signal', title: 'Convertisseur de signal isolé', ref: 'DEMO-SIG-500', supplier: 'studio-signal', family: 'controle-signal', group: 'convertisseurs', status: 'publie', featured: false, cell: 4, document: false,
    summary: 'Isolation et conversion d’un signal de mesure.',
    usage: 'Adapter ou isoler un signal entre un capteur et un automate.',
    description: 'Fiche d’exemple. Type de signal d’entrée et de sortie, alimentation et montage à préciser selon l’installation.',
    specs: [['Fonction', 'Conversion et isolation'], ['Montage', 'Rail, à confirmer'], ['Signaux', 'À définir']],
    applications: ['Armoires de contrôle', 'Remplacement d’un équipement', 'Mise en conformité d’un signal'], models: [] },
  { id: 'dropout-separateur', title: 'Séparateur d’eau liquide Dropout', ref: 'DEMO-AIR-600', supplier: 'demo-fluides', family: 'traitement-air', group: 'dropout', status: 'publie', featured: false, cell: 6, document: false,
    summary: 'Sépare l’eau liquide d’un circuit d’air comprimé.',
    usage: 'Protéger des instruments et régulateurs pneumatiques de l’eau liquide et des condensats.',
    description: 'Fiche d’exemple. Un séparateur traite l’eau liquide ; il ne remplace pas une solution de séchage si l’humidité de la vapeur d’eau est le problème. Dimensionnement, entretien et installation à confirmer avec le fournisseur.',
    specs: [['Fonction', 'Séparation de l’eau liquide'], ['Fluide', 'Air comprimé'], ['Entretien', 'À préciser'], ['Dimensionnement', 'Selon débit et pression']],
    applications: ['Air d’instrumentation', 'Alimentation de régulateurs', 'Lignes pneumatiques'], models: [] },
  { id: 'vanne-inox', title: 'Vanne inox à boisseau', ref: 'DEMO-VAN-700', supplier: 'demo-fluides', family: 'raccords-inox', group: 'vannes', status: 'publie', featured: false, cell: 7, document: false,
    summary: 'Vanne d’isolement en inox.',
    usage: 'Isoler une ligne d’instrumentation ou un point de prélèvement.',
    description: 'Fiche d’exemple. Matériaux d’étanchéité, pression de service et raccordements à confirmer pour votre fluide.',
    specs: [['Fonction', 'Isolement'], ['Matériau', 'Inox, à confirmer'], ['Raccords', 'À définir']],
    applications: ['Isolement d’instruments', 'Points de prélèvement', 'Lignes de procédé'], models: [] },
  { id: 'sonde-ph', title: 'Sonde de pH et redox pour ligne', ref: 'DEMO-ANA-800', supplier: 'modele-analyse', family: 'analyse-liquide', group: 'ph', status: 'publie', featured: false, cell: 8, document: false,
    summary: 'Sonde d’analyse liquide pour suivi en ligne.',
    usage: 'Suivre le pH d’un liquide, avec une variante redox possible selon le besoin.',
    description: 'Fiche d’exemple. Le choix de la sonde dépend du liquide, de sa température et de la fréquence de maintenance souhaitée.',
    specs: [['Mesure', 'pH, redox selon la version'], ['Montage', 'En ligne ou par immersion'], ['Maintenance', 'À préciser']],
    applications: ['Traitement d’eau', 'Procédés de lavage', 'Contrôle qualité'], models: [] },
  { id: 'telephone-atex', title: 'Téléphone industriel ATEX', ref: 'DEMO-SMA-900', supplier: 'studio-signal', family: 'smart-connexion', group: 'atex', status: 'publie', featured: false, cell: 9, document: false,
    summary: 'Terminal de terrain pour zones à atmosphère explosive.',
    usage: 'Accompagner les interventions et la configuration d’instruments sur site.',
    description: 'Fiche d’exemple. Les zones d’usage et les marquages exacts ne sont pas indiqués ici : ils sont à confirmer sur la fiche du fournisseur.',
    specs: [['Usage', 'Terrain, zones à risque'], ['Marquage', 'À confirmer'], ['Applications', 'HART et DATI selon configuration']],
    applications: ['Mise en service', 'Maintenance', 'Tournées de contrôle'], models: [] },
  { id: 'raccords-pneumatiques', title: 'Raccords pneumatiques', ref: 'DEMO-ASS-1000', supplier: 'demo-fluides', family: 'produits-associes', group: 'pneumatique', status: 'publie', featured: false, cell: 10, document: false,
    summary: 'Raccords pour circuits d’air de commande.',
    usage: 'Raccorder des vannes et actionneurs pneumatiques.',
    description: 'Fiche d’exemple. Diamètres, filetages et matériaux sont à définir selon votre circuit.',
    specs: [['Fonction', 'Raccordement pneumatique'], ['Diamètres', 'À définir'], ['Matériau', 'À confirmer']],
    applications: ['Actionneurs', 'Armoires pneumatiques', 'Maintenance'], models: [] },
];

export const REQUESTS = [
  { id: 'DEM-DEMO-001', date: '2026-10-28', status: 'Nouvelle', name: 'Camille Exemple', email: 'camille@example.test', phone: '', company: 'Entreprise fictive', rubrique: 'instrumentation', productId: 'debitmetre-ultrasonique', need: 'Besoin fictif : suivre un débit d’eau de procédé.', unknown: false, sector: 'Eau et environnement', fluid: 'Liquide', context: '', note: '' },
  { id: 'DEM-DEMO-002', date: '2026-10-27', status: 'En cours', name: 'Alex Démo', email: 'alex@example.test', phone: '00 00 00 00 00', company: '', rubrique: 'traitement-air', productId: '', need: 'Besoin fictif : de l’eau arrive dans un circuit d’air.', unknown: false, sector: 'Je ne sais pas', fluid: 'Gaz', context: 'Exemple de contexte.', note: 'Note interne fictive : rappeler pour préciser le circuit.' },
  { id: 'DEM-DEMO-003', date: '2026-10-25', status: 'Traitée', name: 'Sam Maquette', email: 'sam@example.test', phone: '', company: 'Société d’exemple', rubrique: '', productId: '', need: '', unknown: true, sector: '', fluid: '', context: '', note: '' },
];

export const REQUEST_STATUSES = ['Nouvelle', 'En cours', 'Traitée', 'Archivée'];

export const FAQ = [
  { id: 'faq-1', group: 'Choisir un produit', q: 'Je ne sais pas quel instrument choisir. Que faire ?', a: 'Décrivez votre application avec vos mots, ou indiquez simplement que vous ne savez pas. Le formulaire ne demande aucun champ technique obligatoire.', published: true },
  { id: 'faq-2', group: 'Choisir un produit', q: 'Les fiches contiennent-elles toutes les caractéristiques ?', a: 'Les fiches de la maquette sont des exemples fictifs. Sur le vrai site, les caractéristiques seront confirmées avec le fournisseur avant toute décision.', published: true },
  { id: 'faq-3', group: 'Choisir un produit', q: 'Qu’est-ce qu’une fiche de gamme ?', a: 'Une fiche qui présente plusieurs modèles voisins pour comprendre comment ils se distinguent, sans configurer de variantes.', published: true },
  { id: 'faq-4', group: 'Votre demande', q: 'Que devient ma demande ?', a: 'Dans cette maquette, rien n’est envoyé ni conservé : la confirmation est simulée et la demande apparaît seulement dans l’administration de démonstration, dans cet onglet.', published: true },
  { id: 'faq-5', group: 'Votre demande', q: 'Puis-je demander plusieurs produits à la fois ?', a: 'La demande se concentre sur un besoin. Vous pouvez décrire plusieurs produits dans le champ de besoin.', published: true },
  { id: 'faq-6', group: 'Votre demande', q: 'Puis-je joindre un document ?', a: 'Pas dans cette version : décrivez votre besoin et un conseiller vous indiquera comment transmettre un document si nécessaire.', published: true },
  { id: 'faq-7', group: 'À propos de la maquette', q: 'Les prix sont-ils affichés ?', a: 'Non. Aucun prix n’est affiché : les offres se construisent à partir de la demande.', published: true },
  { id: 'faq-8', group: 'À propos de la maquette', q: 'Que se passe-t-il quand je recharge la page ?', a: 'La démonstration revient à son état initial : les modifications faites dans l’administration sont perdues.', published: true },
];

export const PAGES = [
  { id: 'accueil', route: '/', label: 'Accueil', model: 'Accueil', status: 'publie', title: HOME.title, intro: HOME.intro },
  { id: 'catalogue', route: '/catalogue', label: 'Catalogue', model: 'Liste filtrable', status: 'publie', title: 'Catalogue', intro: 'Dix fiches d’exemple pour explorer la présentation. Cherchez par nom ou référence, ou filtrez par rubrique, sous-famille et fournisseur.' },
  { id: 'dropout', route: '/dropout', label: 'Dropout', model: 'Éditorial', status: 'publie', title: 'Dropout, séparer l’eau liquide de l’air', intro: 'Quand de l’eau liquide circule dans un circuit d’air, instruments et actionneurs en subissent les effets. Voici le problème, le principe et ses limites.' },
  { id: 'fournisseurs', route: '/fournisseurs', label: 'Fournisseurs', model: 'Liste', status: 'publie', title: 'Fournisseurs', intro: 'Exemples fictifs de présentation de fournisseurs et des fiches qui leur sont rattachées.' },
  { id: 'entreprise', route: '/entreprise', label: 'Entreprise', model: 'Éditorial', status: 'publie', title: 'Un distributeur qui conseille', intro: COMPANY.intro },
  { id: 'faq', route: '/faq', label: 'Questions', model: 'FAQ', status: 'publie', title: 'Questions fréquentes', intro: 'Les réponses aux questions les plus courantes avant de décrire votre besoin.' },
  { id: 'demande', route: '/demande', label: 'Demande / contact', model: 'Formulaire guidé', status: 'publie', title: 'Décrire mon besoin', intro: 'Quelques étapes courtes. Rien n’est obligatoire sur le plan technique : dites ce que vous savez.' },
  { id: 'actualites', route: '/actualites', label: 'Actualités', model: 'Bientôt', status: 'publie', title: 'Actualités', intro: 'Cette rubrique est en préparation. Les actualités de Maturat Mesure seront publiées ici.' },
  { id: 'recrutement', route: '/recrutement', label: 'Recrutement', model: 'Bientôt', status: 'publie', title: 'Recrutement', intro: 'Cette page est en préparation. Aucune offre n’est publiée pour le moment.' },
  { id: 'mentions-legales', route: '/mentions-legales', label: 'Mentions légales', model: 'Texte légal', status: 'publie', title: 'Mentions légales', intro: 'Texte de démonstration à remplacer par les mentions légales réelles.' },
  { id: 'confidentialite', route: '/confidentialite', label: 'Confidentialité', model: 'Texte légal', status: 'publie', title: 'Confidentialité', intro: 'Texte de démonstration à remplacer par la politique de confidentialité réelle.' },
  { id: 'credits', route: '/credits', label: 'Crédits et limites', model: 'Texte légal', status: 'publie', title: 'Crédits et limites', intro: 'Origine des visuels et limites de cette maquette.' },
];

export const MEDIA = [
  { id: 'logo', file: 'assets/maturat-logo.png', name: 'Logo Maturat Mesure', usage: 'En-tête, message ordinateur', rights: 'Logo existant de la marque.' },
  { id: 'hero', file: 'assets/hero-blue-grain.png', name: 'Fond bleu grainé', usage: 'Ouverture de l’accueil et bandeaux de pages', rights: 'Fond graphique existant de la maquette.' },
  { id: 'grain', file: 'assets/surface-grain.svg', name: 'Grain de surface', usage: 'Sections pâles', rights: 'Motif graphique existant de la maquette.' },
  { id: 'atlas', file: 'assets/product-atlas.png', name: 'Atlas de produits (12 visuels)', usage: 'Fiches, rubriques, accueil', rights: 'Illustrations originales de produits fictifs, sans lien avec un fabricant.' },
  { id: 'pipes', file: 'assets/photos/industrial-pipes.jpg', name: 'Photo de canalisations industrielles', usage: 'Applications, entreprise', rights: 'Photo Unsplash : crédit exact dans assets/CREDITS-MEDIA.md.' },
  { id: 'blue', file: 'assets/photos/industrial-blue.jpg', name: 'Photo industrielle bleue', usage: 'Dropout, entreprise', rights: 'Photo Unsplash : crédit exact dans assets/CREDITS-MEDIA.md.' },
  { id: 'pdf', file: 'assets/documents/fiche-demonstration.pdf', name: 'Fiche de démonstration (PDF)', usage: 'Téléchargement depuis les fiches qui en disposent', rights: 'Document d’exemple, sans information réelle.', pdf: true },
];

export const LEGAL = {
  'mentions-legales': [
    ['Éditeur', 'Maturat Mesure. Forme juridique, numéro d’immatriculation et adresse : à renseigner. Rien n’est affirmé dans cette maquette.'],
    ['Hébergement', 'Maquette hébergée à titre de démonstration. Informations d’hébergeur à renseigner pour le site réel.'],
    ['Contact', 'Les coordonnées affichées sont fictives (example.test, 00 00 00 00 00).'],
  ],
  confidentialite: [
    ['Données', 'Dans cette maquette, rien n’est envoyé ni enregistré durablement : les saisies existent seulement en mémoire de l’onglet et disparaissent au rechargement.'],
    ['Site réel', 'La politique réelle (finalités, durée de conservation, droits) est à rédiger avec Maturat Mesure avant toute mise en ligne. Aucune durée n’est annoncée ici.'],
    ['Cookies', 'La maquette n’utilise ni cookie ni stockage du navigateur.'],
  ],
  credits: [
    ['Typographie', 'Instrument Sans, police sous licence SIL Open Font License (fichiers et licence dans assets/fonts/).'],
    ['Produits', 'Les visuels de produits sont des illustrations originales de produits fictifs. Ils ne représentent aucun appareil d’un fabricant précis.'],
    ['Fournisseurs et références', 'Les fournisseurs, références, caractéristiques et demandes sont fictifs.'],
    ['Document PDF', 'La fiche de démonstration téléchargeable est un exemple sans information réelle.'],
    ['Limites', 'La maquette est destinée à être consultée sur ordinateur. Aucune donnée n’est transmise ni conservée.'],
  ],
};

export const CREDITS_MEDIA_FILE = 'assets/CREDITS-MEDIA.md';
