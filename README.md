# Maturat Mesure · proposition de page d'accueil

Maquette interactive pour explorer une proposition de page d'accueil. Les textes et les fiches sont des exemples à valider. Aucune demande n'est envoyée : les sélections et la saisie restent uniquement en mémoire de la page.

Voir la proposition : https://yacoubbeltanivelle.github.io/maturat-mesure-proposition/

Cette démonstration est distincte du site de Maturat Mesure et de la première maquette. Elle est publiquement accessible et contient une consigne de non-indexation. Les crédits des visuels et leurs limites d'utilisation sont accessibles dans le pied de page.

Lancement, depuis ce dossier :

    python -m http.server 8890 --bind 127.0.0.1

puis ouvrir http://127.0.0.1:8890/. Un serveur est nécessaire pour les modules ES (ouvrir index.html en file:// ne suffit pas).

- `index.html` : structure ; `styles.css` : mise en forme ; `data.js` : tous les contenus et le catalogue ; `app.js` : composants.
- `assets/` : visuels et police Instrument Sans (licence dans `assets/fonts/`). Crédits et limites : pied de page.
- Le bouton « Réinitialiser la démonstration » (pied de page) efface sélections et saisie.

La version UX/UI du 29 octobre 2026 comprend les six activités dans l'ouverture, l'exploration des familles, des fiches de démonstration, les questions facultatives adaptées au contexte et le récapitulatif simulé. Le rendu et les parcours principaux ont été vérifiés dans le navigateur sur ordinateur et mobile avant publication.

## Mises à jour

GitHub Pages publie automatiquement la branche `main`, à la racine du dépôt. Les prochains ajustements conservent la même adresse. Aucun outil de compilation ni dépendance externe n'est nécessaire.

Le fichier `.gitignore` limite le dépôt aux fichiers explicitement destinés à cette démonstration. Les rapports, documents de travail, aperçus et sauvegardes locales ne sont pas publiés.
