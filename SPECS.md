# Spécifications fonctionnelles — Le Monde Clone

## Vue d'ensemble

Reproduction fidèle du site d'information lemonde.fr, sans module de paiement ni accès abonnés. Contenu 100% public, accessible à tous.

## User Stories

### US-1 : Header + Navigation
**En tant qu'** utilisateur, **je veux** naviguer facilement entre les rubriques **afin de** trouver l'actualité qui m'intéresse.

**Critères d'acceptation :**
- [x] Logo "Le Monde" centré cliquable vers l'accueil
- [x] Date du jour affichée
- [x] Barre de navigation avec 8 rubriques : Politique, International, Économie, Culture, Sport, Sciences, Idées, Société
- [x] Icône recherche menant à /recherche
- [x] Menu hamburger responsive sur mobile
- [x] Header sticky au scroll

### US-2 : Page d'accueil
**En tant qu'** utilisateur, **je veux** voir les dernières actualités dès mon arrivée **afin de** rester informé.

**Critères d'acceptation :**
- [x] Section "À la une" avec article principal en grand format
- [x] Grille d'articles récents (3 colonnes desktop, 1 mobile)
- [x] Sections par rubrique (4 articles par rubrique)
- [x] Liens "Voir tout" vers les pages rubriques
- [x] Photos Unsplash réalistes

### US-3 : Page détail article
**En tant qu'** lecteur, **je veux** lire un article complet **afin de** m'informer en profondeur.

**Critères d'acceptation :**
- [x] Titre, chapeau, auteur, date, temps de lecture
- [x] Photo principale pleine largeur
- [x] Corps de l'article bien formaté en Georgia
- [x] Label rubrique cliquable
- [x] Tags cliquables menant à la recherche
- [x] Boutons de partage (Twitter, Facebook, LinkedIn, Email)
- [x] Breadcrumb navigation
- [x] Articles liés en bas de page

### US-4 : Recherche
**En tant qu'** utilisateur, **je veux** rechercher des articles **afin de** trouver un sujet précis.

**Critères d'acceptation :**
- [x] Barre de recherche fonctionnelle
- [x] Filtres par rubrique
- [x] Compteur de résultats
- [x] État vide avec message d'aide
- [x] État sans résultat
- [x] Pagination

### US-5 : Pages rubriques
**En tant qu'** lecteur, **je veux** consulter tous les articles d'une rubrique **afin de** suivre un domaine en particulier.

**Critères d'acceptation :**
- [x] Article principal en grand format
- [x] Grille d'articles avec pagination
- [x] Breadcrumb navigation
- [x] 8 rubriques fonctionnelles

### US-6 : SEO + Performance
**En tant que** moteur de recherche, **je veux** indexer correctement le site **afin de** remonter dans les résultats.

**Critères d'acceptation :**
- [x] generateMetadata Next.js sur chaque page
- [x] Open Graph tags par article
- [x] sitemap.xml dynamique
- [x] robots.txt
- [x] Images optimisées via next/image
- [x] Pre-rendering SSG pour articles et rubriques

### US-7 : RGPD + Analytics
**En tant qu'** utilisateur européen, **je veux** contrôler mes données **afin de** protéger ma vie privée.

**Critères d'acceptation :**
- [x] Bannière cookies avec boutons Accepter/Refuser
- [x] Consentement mémorisé en localStorage
- [x] Script Plausible chargé uniquement si consentement
- [x] Page politique de confidentialité complète
- [x] Lien vers politique depuis la bannière

### US-8 : Footer
**En tant qu'** utilisateur, **je veux** accéder aux informations complémentaires **afin de** naviguer vers les pages secondaires.

**Critères d'acceptation :**
- [x] Logo Le Monde
- [x] Colonnes : Rubriques, À propos, Légal
- [x] Icônes réseaux sociaux (Twitter, Facebook, LinkedIn, Instagram)
- [x] Formulaire newsletter (UI)
- [x] Copyright
- [x] Liens vers politique de confidentialité

## Données de démo

- 32 articles réalistes en français
- 8 rubriques : Politique, International, Économie, Culture, Sport, Sciences, Idées, Société
- Contenu rédactionnel réaliste (pas de Lorem ipsum)
- Photos Unsplash thématiques
- Auteurs, dates et tags variés
