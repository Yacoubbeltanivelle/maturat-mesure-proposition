# Maturat Mesure · maquette navigable

Maquette statique du site de Maturat Mesure et de son administration de démonstration. Les textes, fiches, fournisseurs, coordonnées et demandes sont fictifs : adresses en `example.test`, téléphone `00 00 00 00 00`, adresse illustrative. Aucune donnée n'est envoyée ni conservée.

Adresse publiée : https://yacoubbeltanivelle.github.io/maturat-mesure-proposition/

La maquette se consulte sur ordinateur (écran de 1024 px ou plus). En dessous, un message simple remplace le site et l'administration. Elle est publique et contient une consigne de non-indexation.

## Lancer en local

Depuis ce dossier :

    python -m http.server 8890 --bind 127.0.0.1

puis ouvrir http://127.0.0.1:8890/. Un serveur est nécessaire pour les modules ES. Aucun outil de compilation ni dépendance.

## Vues

Le routage se fait par hash (`#/…`), avec des chemins de ressources relatifs : liens directs et rechargements fonctionnent sous n'importe quelle base.

| Route | Vue |
| --- | --- |
| `#/` | Accueil : quatre mesures, sept domaines, produits à la une, Dropout, applications, fournisseurs, entreprise, FAQ, contact |
| `#/catalogue` | Catalogue : recherche nom ou référence, filtres rubrique, sous-famille, fournisseur |
| `#/rubrique/:id` | Rubrique et sous-familles, fiches filtrées |
| `#/produit/:id` | Fiche produit, gamme, produits proches, demande contextualisée |
| `#/dropout` | Problème de l'eau liquide, principe, limites |
| `#/fournisseurs`, `#/fournisseur/:id` | Fournisseurs d'exemple et leurs fiches |
| `#/entreprise`, `#/faq` | Éditorial et questions |
| `#/demande` | Demande guidée en quatre étapes, confirmation simulée |
| `#/actualites`, `#/recrutement` | Pages « Bientôt » |
| `#/mentions-legales`, `#/confidentialite`, `#/credits` | Textes de démonstration à remplacer, crédits et limites |
| `#/admin` | Administration de démonstration : tableau de bord, catalogue, demandes, familles, fournisseurs, pages, FAQ, médias, paramètres |

## État de démonstration

Tout l'état vit en mémoire dans l'onglet, partagé entre le site et l'administration. Aucun `localStorage`, `sessionStorage`, cookie, IndexedDB, envoi ou appel distant. Le rechargement, le bouton « Réinitialiser » et le retour par le cache de navigation (bfcache) remettent la démonstration à zéro ; le changement d'onglet ne la touche pas.

Fonctionne réellement en mémoire : création, modification, duplication, masquage et mise à la une des fiches ; statut et note interne des demandes (dont celles saisies dans le formulaire) ; ordre et contenu des familles ; fournisseurs ; textes et statut des pages ; FAQ ; réglages (contact, horaires, titre du site, fonctionnalités actives, réseaux, pied de page). L'adresse interne de notification est stockée à part et jamais affichée côté public.

Non simulé, et signalé comme tel : envoi d'e-mail, notifications, téléversement de médias, publication de balises SEO.

## Organisation

- `data.js` : tous les contenus et données d'exemple ; `app.js` : routes et rendu.
- `js/` : `state.js` (état mémoire), `router.js`, `dom.js` (utilitaires et formulaires), `layout.js` (en-tête, pied de page, composants), `pages.js` (vues publiques), `request.js` (demande), `admin.js`.
- `styles.css` (site), `admin.css` (administration).
- `assets/` : logo, fonds, police Instrument Sans (licence dans `assets/fonts/`), atlas de produits fictifs `product-atlas.png` (grille 4 x 3), photos industrielles, PDF d'exemple, crédits dans `assets/CREDITS-MEDIA.md`.
- `scripts/check.mjs` : vérification statique sans dépendance (`node scripts/check.mjs --strict`). Le workflow `.github/workflows/verification.yml` l'exécute sur les pull requests et les pushes de branche ; il ne déploie rien.

Le fichier `.gitignore` limite le dépôt aux fichiers explicitement listés.
