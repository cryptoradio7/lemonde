# SPECS FONCTIONNELLES — lemonde

> **Projet** : Clone de lemonde.fr
> **Version** : 1.0 — MVP
> **Date** : 2026-03-27
> **Auteur** : Business Analyst — AgileVizion
> **Référence visuelle** : https://www.lemonde.fr (captures dans `references/`)
> **Architecture** : Next.js 16 (App Router, RSC) + TypeScript 5.8 + Tailwind CSS 4 + Prisma 6 + SQLite + Auth.js v5

---

## Table des matières

1. [Contexte et périmètre](#1-contexte-et-périmètre)
2. [Utilisateurs et personas](#2-utilisateurs-et-personas)
3. [Anomalies bloquantes détectées](#3-anomalies-bloquantes-détectées)
4. [Reverse engineering — lemonde.fr](#4-reverse-engineering--lemondefr)
5. [Stories MVP](#5-stories-mvp)
6. [Stories complémentaires (détectées par reverse engineering)](#6-stories-complémentaires-détectées-par-reverse-engineering)
7. [Suggestions du BA](#7-suggestions-du-ba)
8. [Récapitulatif et priorisation](#8-récapitulatif-et-priorisation)
9. [Modèle de données](#9-modèle-de-données)
10. [Hors scope](#10-hors-scope)

---

## 1. Contexte et périmètre

### Objectif
Reproduire fidèlement l'apparence et les fonctionnalités principales de lemonde.fr dans un clone local. Le site doit permettre la navigation entre rubriques, la lecture d'articles, la création de compte, et l'inscription à une newsletter.

### Périmètre MVP (demandé dans le BRIEF)
1. Design clone fidèle de lemonde.fr (accueil, navigation, footer)
2. Pages articles (lecture complète)
3. Liens réseaux sociaux Le Monde
4. Création compte + espace personnalisé
5. Inscription newsletter
6. SEO (meta tags, sitemap, balises sémantiques)
7. Bandeau RGPD (consentement cookies)

### Déploiement
Local uniquement (`http://localhost:3000`).

---

## 2. Utilisateurs et personas

| Persona | Description | Besoins |
|---------|-------------|---------|
| **Visiteur anonyme** | Grand public, arrive depuis un moteur de recherche ou en direct | Lire des articles, naviguer par rubrique, s'inscrire à la newsletter |
| **Utilisateur inscrit** | Visiteur qui a créé un compte | Accéder à son espace personnel, se connecter/déconnecter |
| **Administrateur** | Hors scope MVP | Gestion des articles/catégories via Prisma Studio |

---

## 3. Anomalies bloquantes détectées

> **Ces anomalies doivent être résolues AVANT tout développement de stories.**

### Story #0 — Résolution des conflits de merge et nettoyage

**En tant que** développeur
**Je veux** un codebase propre et fonctionnel
**Pour** pouvoir implémenter les stories sans erreur de build

**Problèmes identifiés :**

| Fichier | Problème | Action requise |
|---------|----------|----------------|
| `src/app/page.tsx` | Conflit de merge (HEAD vs b8af92a) — deux implémentations divergentes | Résoudre en faveur de Prisma (RSC) + intégrer le layout Hero de HEAD |
| `src/app/article/[slug]/page.tsx` | Conflit de merge — version données hardcodées vs version Prisma | Résoudre en faveur de Prisma + conserver Breadcrumb, ShareButtons, articles liés |
| `src/app/globals.css` | Conflit de merge — Tailwind 4 @layer vs @import basique | Résoudre en faveur de la version Tailwind 4 complète (HEAD) |
| `src/app/layout.tsx` | Conflit de merge — layout complet (Header/Footer/CookieBanner) vs layout minimal | Résoudre en faveur du layout complet (HEAD) |
| `src/components/ArticleCard.tsx` | Import depuis `@/data/articles` (fichier de données hardcodées) | Refactorer pour accepter le type Prisma `Article & { category: Category }` |
| `src/data/articles.ts` | Données hardcodées — viole la règle "tout vient de la DB" | Supprimer après migration vers Prisma |

**Critères d'acceptation :**
- [ ] Aucun marqueur de conflit (`<<<<<<<`, `=======`, `>>>>>>>`) dans le code
- [ ] `npm run build` passe sans erreur
- [ ] `npm run dev` démarre et affiche la page d'accueil
- [ ] Toutes les pages utilisent Prisma pour les données (aucun import depuis `@/data/`)
- [ ] Le fichier `src/data/articles.ts` est supprimé

**Complexité :** M
**Priorité :** BLOQUANT — à traiter en premier

---

## 4. Reverse engineering — lemonde.fr

> Sources : Playwright snapshot + screenshots (27 mars 2026). Captures dans `references/`.

### A. Inventaire des composants visuels

#### Page Accueil (`https://www.lemonde.fr/`)

```
Page: Accueil
├── Header (banner)
│   ├── Top bar : bouton Menu (hamburger + texte) à gauche, logo "Le Monde" centré (SVG), S'abonner (bouton jaune/or) + Se connecter (icône) à droite
│   ├── Nav principale (fond noir #1D1D1B) :
│   │   ├── Zone gauche : liens contextuels ("Guerres au Proche-Orient", "Guerre en Ukraine") — fond rouge/sombre
│   │   └── Zone droite : rubriques fixes (International, Planète, Politique, Société, Économie, Idées, Culture, Le Goût du Monde)
│   └── Pas de date visible dans le header (contrairement à notre implémentation actuelle)
│
├── Hero section
│   ├── Article principal : titre très grand (serif bold), chapeau (italique), auteur + date
│   ├── Sidebar droite : 3-4 articles empilés (titre seul ou titre + petit résumé)
│   └── Séparateurs fins entre articles
│
├── Section "En continu" : fil d'actualités avec horodatage (HH:MM)
│
├── Sections par rubrique
│   ├── Titre rubrique : uppercase, petit, gras, tracking large, bleu
│   ├── Articles en grille (variable : 1 grand + 2-3 petits, ou grille uniforme)
│   └── Pas de "Voir tout →" visible — chaque titre de rubrique est un lien
│
├── Sections thématiques : "Le Monde Afrique", "Le Goût du Monde", etc.
│
├── Publicités (hors scope) : bannières horizontales entre sections
│
└── Footer
    ├── Navigation rubriques
    ├── Liens légaux / CGU / confidentialité
    ├── Liens réseaux sociaux (X, Facebook, Instagram, Snapchat, YouTube, LinkedIn)
    ├── Applications mobiles (liens App Store / Google Play)
    └── Copyright + mentions
```

#### Page Rubrique (`https://www.lemonde.fr/politique/`)

```
Page: Rubrique (ex: Politique)
├── Header (identique à l'accueil)
├── Titre rubrique : "POLITIQUE" en très grand, serif, uppercase
├── Tags contextuels : badges cliquables (ex: "Élections municipales 2026", "Budget 2026", "Assemblée nationale")
│   └── Bouton "Voir plus ▼" pour déplier d'autres tags
├── Séparateur horizontal
├── Liste d'articles (format vertical, pas de grille) :
│   ├── Article : titre (serif bold) + chapeau + image à droite (thumbnail ~200px)
│   ├── Métadonnées : "Publié aujourd'hui à 08h18, modifié à 08h22 · Le Monde avec AFP"
│   └── Séparateur fin entre chaque article
└── Footer (identique)
```

#### Page Article (structure déduite)

```
Page: Article
├── Header (identique)
├── Fil d'Ariane : Accueil > Rubrique > (titre tronqué)
├── Badge rubrique (uppercase, couleur)
├── Titre article : très grand (serif, 32-40px, bold)
├── Chapeau : texte introductif (serif, italique, gris)
├── Barre métadonnées : Auteur (lien) · Date · Temps de lecture
├── Boutons partage : X, Facebook, LinkedIn, Email, Copier le lien
├── Image principale (pleine largeur zone article) + crédit photo
├── Contenu article :
│   ├── Paragraphes (serif, ~18px, line-height 1.7)
│   ├── Intertitres (h2, bold)
│   ├── Citations (blockquote, style distinct)
│   └── Images inline avec légendes
├── Tags / mots-clés (bas d'article)
├── Section "Sur le même sujet" : articles liés (3 articles en grille)
└── Footer
```

### B. Inventaire des features visibles

| Feature | Présente sur lemonde.fr | Dans notre MVP | Notes |
|---------|------------------------|----------------|-------|
| Navigation par rubriques | Oui — barre noire avec 8+ rubriques | Oui | 8 rubriques définies |
| Menu hamburger | Oui — ouvre un panel latéral complet | Oui (simplifié) | Notre version : dropdown mobile |
| Bouton S'abonner | Oui — bouton or/jaune | Non | Hors scope (pas de paywall) |
| Se connecter / Espace perso | Oui — icône utilisateur | Oui | Credentials provider |
| Fil "En continu" | Oui — section avec horodatage | Non | Suggestion BA (story #14) |
| Recherche | Oui — icône loupe dans le header | Oui | Page recherche + filtre rubrique |
| Hero section (accueil) | Oui — 1 article principal + sidebar | Oui | Layout 2/3 + 1/3 |
| Sections par rubrique | Oui — grille variable | Oui | Grille articles par catégorie |
| Tags contextuels (rubrique) | Oui — badges cliquables sur page rubrique | Non | Suggestion BA (story #15) |
| Partage social | Oui — X, Facebook, LinkedIn, Email | Oui | Composant ShareButtons existant |
| Fil d'Ariane | Oui — breadcrumb hiérarchique | Oui | Composant Breadcrumb existant |
| Newsletter | Oui — formulaire dans le footer | Oui | Footer + API route |
| Articles liés | Oui — "Sur le même sujet" | Oui | Même catégorie |
| Bandeau cookies/RGPD | Oui — popup de consentement | Oui | Composant CookieBanner |
| Date dans le header | Non visible sur le site actuel | Oui (dans notre clone) | Peut être conservé comme distinction |
| Page 404 | Oui | Oui | Composant not-found.tsx |
| Politique de confidentialité | Oui | Oui | Page statique existante |
| Pagination | Oui — sur pages rubrique | Oui | Composant Pagination existant |
| Temps de lecture | Visible dans les métadonnées article | Oui | À calculer depuis le contenu |
| Mode sombre | Non | Non | Hors scope |
| Application mobile | Oui (liens App Store) | Non | Hors scope |

### C. Modèle de données implicite (déduit du site)

```
Article:
  - title          (string, ~120 chars max, serif bold)
  - slug           (string, unique, format kebab-case)
  - excerpt        (string, ~250 chars, italique)
  - content        (rich text / HTML, paragraphes multiples)
  - author         (string, avec possibilité de lien)
  - publishedAt    (datetime, format "27 mars 2026 à 08h18")
  - updatedAt      (datetime, "modifié à 08h22" — optionnel)
  - readingTime    (string, "5 min de lecture" — calculable)
  - category       (relation → Category)
  - imageUrl       (url, image principale)
  - imageAlt       (string, légende/crédit photo)
  - isPremium      (boolean — hors scope, pas de paywall)

Category (Rubrique):
  - name           (string : "International", "Politique", etc.)
  - slug           (string : "international", "politique")
  - description    (string, optionnel)
  - order          (int, ordre d'affichage dans la nav)

User:
  - name           (string)
  - email          (string, unique)
  - passwordHash   (string, bcrypt)
  - createdAt      (datetime)

Newsletter:
  - email          (string, unique)
  - active         (boolean)
  - subscribedAt   (datetime)
```

### D. Layout exact

#### Accueil — Hero section

```
┌──────────────────────────────────────────┬─────────────────────┐
│  Article principal                        │  Sidebar            │
│                                          │                     │
│  Titre (serif, 32-36px, bold)            │  Article 1          │
│  Chapeau (serif, 16px, gris)             │  (titre seul)       │
│  Auteur · Date                           │  ───────────────── │
│                                          │  Article 2          │
│  Largeur : ~65%                          │  (titre + résumé)   │
│                                          │  ───────────────── │
│                                          │  Article 3          │
│                                          │  Largeur : ~35%     │
└──────────────────────────────────────────┴─────────────────────┘
```

#### Accueil — Section rubrique

```
  RUBRIQUE (uppercase, 12px, bleu, tracking large, border-bottom)
┌────────────────┬────────────────┬────────────────┐
│  Article 1     │  Article 2     │  Article 3     │
│  Image         │  Image         │  Image         │
│  Titre         │  Titre         │  Titre         │
│  Chapeau       │  Chapeau       │  Chapeau       │
│  Auteur · Date │  Auteur · Date │  Auteur · Date │
└────────────────┴────────────────┴────────────────┘
```

#### Article — Lecture

```
Max-width : 760px, centré

  Accueil > Rubrique > Titre (fil d'Ariane)

  RUBRIQUE (badge uppercase)

  Titre article (32-40px, serif, bold)

  Chapeau (18px, serif, italique, gris)

  Par Auteur · 27 mars 2026 à 08h18 · 5 min de lecture
  ─────────────────────────────────────────────────────
  [X] [Facebook] [LinkedIn] [Email] [Copier]

  ┌─────────────────────────────────────────────────┐
  │  Image principale (pleine largeur 760px)         │
  │  aspect-ratio ~16:9                              │
  └─────────────────────────────────────────────────┘
  Crédit : Photographe / Agence

  Paragraphe 1 (serif, 18px, line-height 1.7)

  Paragraphe 2...

  Intertitres (h2, bold)

  Paragraphe 3...

  ─────────────────────────────────────────────────────
  Tags : [tag1] [tag2] [tag3]

  SUR LE MÊME SUJET
  ┌──────────┬──────────┬──────────┐
  │ Article  │ Article  │ Article  │
  │ lié 1    │ lié 2    │ lié 3    │
  └──────────┴──────────┴──────────┘
```

### E. Règles de gestion visibles

| Règle | Comportement observé |
|-------|---------------------|
| Ordre des articles | Éditorial sur l'accueil (hero = choix rédaction), chronologique dans les rubriques |
| Format des dates | Absolue : "27 mars 2026 à 08h18" / Relative dans le fil continu : "il y a 2h" |
| Troncature titres | 2-3 lignes max via `line-clamp`, dépend du variant (large = pas de clamp, small = 2 lignes) |
| Hover sur titre | Soulignement (text-decoration: underline) |
| Hover sur image | Pas de scale sur lemonde.fr (notre clone en ajoute un léger — acceptable) |
| Typographie titres | Georgia, serif — fidèle |
| Typographie corps | Georgia, serif pour le contenu article, sans-serif pour les métadonnées |
| Couleur liens rubrique | Bleu Le Monde (#005C9C ou variable --lemonde-blue) |
| Séparateurs | Lignes fines grises (#D5D5D5) entre sections et articles |
| Navigation active | Rubrique courante pas visuellement distinguée dans la barre de nav |
| Fond | Blanc pur, pas de gris de fond |

---

## 5. Stories MVP

### Story #1 — Header et navigation principale

**En tant que** visiteur
**Je veux** voir un header fidèle à lemonde.fr avec le logo, les rubriques et les boutons d'action
**Pour** naviguer facilement sur le site

**Critères d'acceptation :**
- [ ] Top bar : logo "Le Monde" centré (texte Georgia, serif, bold, 32px), icône recherche (loupe) à droite, bouton menu hamburger sur mobile
- [ ] Barre de navigation (fond noir #1D1D1B) : 8 rubriques en uppercase (Politique, International, Économie, Culture, Sport, Sciences, Idées, Société)
- [ ] Les rubriques sont des liens vers `/rubrique/{slug}`
- [ ] Lien "Se connecter" visible à droite du header quand l'utilisateur n'est pas connecté
- [ ] Quand connecté : afficher le nom de l'utilisateur avec lien vers `/espace-perso`
- [ ] Header sticky au scroll (se fixe en haut de la page avec une ombre)
- [ ] Mobile : hamburger ouvre un menu déroulant avec toutes les rubriques
- [ ] La date du jour est affichée à gauche en petit (format "jeudi 27 mars 2026")

**Edge cases :**
- Si le titre de rubrique est trop long sur mobile → troncature avec ellipsis
- Si le scroll est rapide → pas de clignotement lors de la transition sticky
- Si JavaScript désactivé → la navigation reste fonctionnelle (liens <a> standards)

**Assets visuels :** `references/lemonde-accueil.png`, `references/lemonde-rubrique-politique.png`
**Complexité :** M
**Dépendances :** Story #0

---

### Story #2 — Page d'accueil (Hero + sections par rubrique)

**En tant que** visiteur
**Je veux** voir la page d'accueil avec un article à la une et les articles organisés par rubrique
**Pour** avoir un aperçu rapide de l'actualité

**Critères d'acceptation :**
- [ ] Section "À la une" : layout 2 colonnes (65% article principal + 35% sidebar avec 3 articles)
- [ ] Article principal : titre (serif, 32px, bold, lien), chapeau (serif, gris), auteur + date
- [ ] Sidebar : 3 articles en format compact (titre + date, séparés par une ligne fine)
- [ ] L'article à la une est le plus récent de la DB (`orderBy: publishedAt desc`)
- [ ] Sections par rubrique : titre rubrique (uppercase, bleu, border-bottom) + grille 3 colonnes
- [ ] Chaque rubrique affiche 3 à 5 articles les plus récents
- [ ] Les rubriques sont affichées dans l'ordre défini par le champ `order` de la table Category
- [ ] Le lien "Voir tout →" pointe vers `/rubrique/{slug}`
- [ ] Toutes les données viennent de Prisma (RSC — Server Component, pas de `"use client"`)
- [ ] La page se charge en < 2s en dev

**Edge cases :**
- Si une rubrique n'a aucun article → ne pas afficher la section
- Si la DB est vide → afficher un message "Aucun article disponible"
- Si l'image d'un article est manquante → afficher un placeholder gris avec le titre de la rubrique

**Assets visuels :** `references/lemonde-accueil.png`
**Complexité :** L
**Dépendances :** Story #0

---

### Story #3 — Composant ArticleCard (multi-variants)

**En tant que** développeur
**Je veux** un composant ArticleCard réutilisable avec 3 variants
**Pour** afficher les articles de manière cohérente sur tout le site

**Critères d'acceptation :**
- [ ] Le composant accepte un article de type Prisma (`Article & { category: Category }`)
- [ ] Variant `large` : image pleine largeur (aspect 16:9), overlay gradient, titre blanc sur fond sombre, badge rubrique rouge, chapeau, auteur + date + temps de lecture
- [ ] Variant `medium` : carte avec image (aspect 16:10), titre (serif, bold), chapeau (2 lignes max), métadonnées (auteur + date) en bas séparées par une ligne fine
- [ ] Variant `small` : layout horizontal (texte à gauche, thumbnail 96x96px à droite), titre (2 lignes max), date + temps de lecture
- [ ] Hover sur le titre → underline
- [ ] Hover sur l'image (variant large et medium) → légère animation scale (1.05, transition 500ms)
- [ ] Le badge rubrique est affiché sur les variants `large` et `medium`
- [ ] Le lien couvre toute la carte (composant `<Link>` Next.js)
- [ ] Le temps de lecture est calculé : `Math.ceil(content.split(' ').length / 200)` + " min de lecture"

**Edge cases :**
- Si pas d'image → ne pas afficher la zone image, adapter le layout
- Si le titre fait plus de 3 lignes (variant medium) → `line-clamp-3`
- Si le chapeau est vide → ne pas afficher la zone chapeau

**Complexité :** M
**Dépendances :** Story #0

---

### Story #4 — Page article (lecture complète)

**En tant que** visiteur
**Je veux** lire un article complet avec une mise en page de qualité éditoriale
**Pour** avoir une expérience de lecture confortable

**Critères d'acceptation :**
- [ ] URL : `/article/{slug}` — page RSC (Server Component)
- [ ] Fil d'Ariane : Accueil > Rubrique > Titre tronqué (composant Breadcrumb)
- [ ] Badge rubrique (uppercase, rouge/bleu)
- [ ] Titre : serif, 32-40px, bold, `max-width: 760px`, centré
- [ ] Chapeau : serif, italique, gris, 18px
- [ ] Barre métadonnées : "Par {auteur} · {date format long} · {temps de lecture}"
- [ ] Boutons de partage social (X, Facebook, LinkedIn, Email) via composant ShareButtons
- [ ] Image principale pleine largeur (760px max), avec légende/crédit (`imageAlt`)
- [ ] Contenu rendu en HTML (`dangerouslySetInnerHTML`) avec styles prose (typographie éditoriale)
- [ ] Tags en bas d'article (liens vers `/recherche?q={tag}`) — si le modèle de données les supporte
- [ ] Section "Articles liés" : 3 articles de la même catégorie (grille 3 colonnes)
- [ ] SEO : `generateMetadata()` avec title, description, OpenGraph (type article, image, auteur)
- [ ] Si le slug n'existe pas → page 404 (`notFound()`)

**Edge cases :**
- Si l'article n'a pas d'image → ne pas afficher la zone figure/figcaption
- Si aucun article lié trouvé dans la même catégorie → ne pas afficher la section
- Si le contenu contient du HTML malformé → le sanitizer doit le gérer proprement

**Assets visuels :** Structure déduite du site (voir section D "Layout exact")
**Complexité :** L
**Dépendances :** Story #3

---

### Story #5 — Page rubrique (listing par catégorie)

**En tant que** visiteur
**Je veux** voir tous les articles d'une rubrique avec pagination
**Pour** explorer les articles d'un thème qui m'intéresse

**Critères d'acceptation :**
- [ ] URL : `/rubrique/{slug}` — page RSC
- [ ] Titre de la rubrique en grand : uppercase, serif, bold (comme sur lemonde.fr "POLITIQUE")
- [ ] Premier article en variant `large`, les suivants en grille 3 colonnes (variant `medium`)
- [ ] Pagination : 12 articles par page, composant Pagination avec numéros + précédent/suivant
- [ ] Les articles sont triés par date de publication décroissante
- [ ] SEO : `generateMetadata()` avec titre de la rubrique
- [ ] Si la rubrique n'existe pas → page 404

**Edge cases :**
- Si la rubrique n'a qu'un seul article → l'afficher en large, pas de grille
- Si la page demandée dépasse le nombre total → rediriger vers la dernière page
- Si le slug contient des caractères accentués → normalisation (société → societe)

**Assets visuels :** `references/lemonde-rubrique-politique.png`
**Complexité :** M
**Dépendances :** Story #3

---

### Story #6 — Footer

**En tant que** visiteur
**Je veux** un footer complet fidèle au style Le Monde
**Pour** accéder aux liens utiles, aux réseaux sociaux et à la newsletter

**Critères d'acceptation :**
- [ ] Fond noir (#1D1D1B), texte blanc/gris
- [ ] Section newsletter intégrée : titre (serif), description courte, champ email + bouton "S'inscrire" (rouge #E9322D)
- [ ] Le formulaire newsletter soumet vers `/api/newsletter` (POST)
- [ ] 4 colonnes de liens : Logo + description + réseaux sociaux | Rubriques | À propos | Légal
- [ ] Réseaux sociaux : icônes SVG cliquables (X/Twitter, Facebook, LinkedIn, Instagram) avec liens `target="_blank"` vers les comptes officiels Le Monde
- [ ] Copyright dynamique : "© {année} Le Monde. Tous droits réservés."
- [ ] Responsive : 4 colonnes → 2 colonnes tablette → 1 colonne mobile

**Edge cases :**
- Si l'email est déjà inscrit → afficher "Cette adresse est déjà inscrite"
- Si l'email est invalide → validation Zod côté API + message d'erreur
- Si l'API est en erreur → afficher "Une erreur est survenue, réessayez"

**Complexité :** M
**Dépendances :** Aucune

---

### Story #7 — Inscription (création de compte)

**En tant que** visiteur
**Je veux** créer un compte avec mon nom, email et mot de passe
**Pour** accéder à mon espace personnel

**Critères d'acceptation :**
- [ ] URL : `/auth/signup` — page client (`"use client"`)
- [ ] Formulaire : nom (min 2 caractères), email (valide), mot de passe (min 6 caractères)
- [ ] Soumission POST vers `/api/auth/signup`
- [ ] Validation Zod côté API (name min 2, email format, password min 6)
- [ ] Hash du mot de passe avec bcryptjs (12 rounds)
- [ ] Si succès → redirect vers `/auth/signin` avec message "Compte créé, connectez-vous"
- [ ] Si email déjà utilisé → message "Un compte existe déjà avec cet email"
- [ ] Lien vers la page de connexion en bas : "Déjà un compte ? Se connecter"
- [ ] Mise en page centrée, max-width 400px

**Edge cases :**
- Si le nom contient uniquement des espaces → refuser (trim + vérification)
- Si le mot de passe fait exactement 6 caractères → accepter (borne inclusive)
- Si la requête POST échoue (erreur réseau) → afficher un message générique

**Complexité :** M
**Dépendances :** Aucune

---

### Story #8 — Connexion (authentification)

**En tant que** utilisateur inscrit
**Je veux** me connecter avec mon email et mot de passe
**Pour** accéder à mon espace personnel

**Critères d'acceptation :**
- [ ] URL : `/auth/signin` — page client
- [ ] Formulaire : email + mot de passe
- [ ] Soumission via `signIn("credentials", { ... })` de NextAuth
- [ ] Si succès → redirect vers `/espace-perso`
- [ ] Si erreur → message "Email ou mot de passe incorrect" (pas de distinction email/mdp pour la sécurité)
- [ ] Bouton désactivé pendant le chargement (état `loading`)
- [ ] Lien vers l'inscription : "Pas encore de compte ? Créer un compte"
- [ ] Session stockée en JWT (cookie httpOnly)

**Edge cases :**
- Si l'utilisateur est déjà connecté et visite `/auth/signin` → rediriger vers `/espace-perso`
- Si le cookie JWT est expiré → la session est perdue, l'utilisateur doit se reconnecter
- Si l'email n'existe pas → même message d'erreur que mot de passe incorrect

**Complexité :** M
**Dépendances :** Story #7

---

### Story #9 — Espace personnel

**En tant que** utilisateur connecté
**Je veux** accéder à mon espace personnel
**Pour** voir mes informations et me déconnecter

**Critères d'acceptation :**
- [ ] URL : `/espace-perso` — page RSC protégée par middleware
- [ ] Affiche : "Bonjour, {nom}" + email de l'utilisateur
- [ ] Bouton "Se déconnecter" (server action `signOut()`) → redirect vers `/`
- [ ] Si non connecté → redirect automatique vers `/auth/signin` (middleware)
- [ ] Mise en page centrée, max-width 600px

**Edge cases :**
- Si le nom de l'utilisateur est null → afficher "Bonjour" sans nom
- Si la session expire pendant la visite → le prochain chargement redirige vers signin

**Complexité :** S
**Dépendances :** Story #8

---

### Story #10 — Inscription newsletter

**En tant que** visiteur
**Je veux** m'inscrire à la newsletter depuis le footer
**Pour** recevoir les actualités par email

**Critères d'acceptation :**
- [ ] Formulaire dans le footer : champ email + bouton "S'inscrire"
- [ ] Le formulaire est un composant client (`"use client"`)
- [ ] POST vers `/api/newsletter` avec l'email
- [ ] Validation Zod côté API : email requis et format valide
- [ ] Succès → message de confirmation "Inscription confirmée !"
- [ ] Email déjà inscrit → message "Cette adresse est déjà inscrite"
- [ ] Erreur → message "Une erreur est survenue"
- [ ] Le champ email se vide après inscription réussie
- [ ] L'inscription est stockée en DB (table Newsletter)

**Edge cases :**
- Si l'email contient des espaces → trim avant validation
- Si l'utilisateur soumet le formulaire vide → validation HTML5 `required`
- Si la DB est inaccessible → retourner HTTP 500 avec message d'erreur

**Complexité :** S
**Dépendances :** Story #6

---

### Story #11 — Recherche d'articles

**En tant que** visiteur
**Je veux** rechercher des articles par mots-clés et filtrer par rubrique
**Pour** trouver rapidement un article sur un sujet précis

**Critères d'acceptation :**
- [ ] URL : `/recherche?q={query}&rubrique={slug}&page={n}` — page RSC
- [ ] Barre de recherche en haut de page (composant SearchBar, client)
- [ ] La recherche porte sur le titre et le chapeau (excerpt) des articles (`LIKE %query%`)
- [ ] Filtre par rubrique : dropdown ou boutons pour filtrer par catégorie
- [ ] Résultats en grille 3 colonnes (variant medium)
- [ ] Pagination : 12 résultats par page
- [ ] Affichage du nombre de résultats : "{n} résultats pour "{query}""
- [ ] Si aucun résultat → message "Aucun article trouvé pour "{query}""
- [ ] L'icône loupe dans le header redirige vers `/recherche`

**Edge cases :**
- Si la query est vide → afficher tous les articles (derniers en date)
- Si la query contient des caractères spéciaux → échapper pour éviter l'injection SQL (Prisma le gère)
- Si la query fait plus de 200 caractères → tronquer

**Complexité :** M
**Dépendances :** Story #3

---

### Story #12 — SEO (meta tags, sitemap, robots.txt)

**En tant que** moteur de recherche
**Je veux** des meta tags, un sitemap et un robots.txt bien configurés
**Pour** indexer correctement les pages du site

**Critères d'acceptation :**
- [ ] Meta tags dynamiques via `generateMetadata()` sur chaque page :
  - Accueil : title "Le Monde.fr — Actualités et Infos en France et dans le monde"
  - Article : title "{titre} — Le Monde", description = excerpt, OpenGraph type article
  - Rubrique : title "{Rubrique} — Le Monde", description
  - Recherche : title "Recherche — Le Monde"
- [ ] Sitemap dynamique (`src/app/sitemap.ts`) : liste toutes les pages statiques + tous les articles + toutes les rubriques depuis la DB
- [ ] Robots.txt (`src/app/robots.ts`) : autoriser tous les crawlers, pointer vers le sitemap
- [ ] Balises sémantiques : `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<time>`, `<figure>`, `<figcaption>`
- [ ] Images avec `alt` descriptif
- [ ] Liens avec texte descriptif (pas de "cliquez ici")

**Edge cases :**
- Si un article n'a pas de chapeau → utiliser les 160 premiers caractères du contenu comme description
- Si le sitemap est très long (> 1000 articles) → pas de problème avec la génération dynamique

**Complexité :** M
**Dépendances :** Stories #2, #4, #5

---

### Story #13 — Bandeau RGPD (cookies)

**En tant que** visiteur
**Je veux** être informé de l'utilisation des cookies et pouvoir accepter ou refuser
**Pour** exercer mon droit au consentement (RGPD)

**Critères d'acceptation :**
- [ ] Bandeau en bas de page, fixe (position sticky), fond blanc avec bordure supérieure
- [ ] Texte : "Ce site utilise des cookies pour améliorer votre expérience." + lien vers la politique de confidentialité
- [ ] Deux boutons : "Accepter" (fond noir) et "Refuser" (bordure)
- [ ] Le choix est stocké dans `localStorage` (`cookie_consent`)
- [ ] Le bandeau ne réapparaît pas si le choix a été fait
- [ ] Page `/politique-de-confidentialite` accessible depuis le bandeau et le footer
- [ ] La page de confidentialité détaille : données collectées, cookies, droits RGPD, contact

**Edge cases :**
- Si localStorage est indisponible (navigation privée sur certains navigateurs) → afficher le bandeau à chaque visite
- Si l'utilisateur efface son localStorage → le bandeau réapparaît

**Complexité :** S
**Dépendances :** Aucune

---

## 6. Stories complémentaires (détectées par reverse engineering)

### Story #14 — Section "En continu" (fil d'actualités)

**En tant que** visiteur
**Je veux** voir un fil d'actualités chronologique sur la page d'accueil
**Pour** suivre les dernières publications en temps réel

**Critères d'acceptation :**
- [ ] Section distincte sur la page d'accueil, entre le Hero et les rubriques
- [ ] Affichage vertical : horodatage (HH:MM) à gauche + titre article à droite
- [ ] Les 10 derniers articles par ordre chronologique inverse
- [ ] Chaque entrée est un lien vers `/article/{slug}`
- [ ] Badge rubrique discret (texte coloré, pas de fond)
- [ ] Séparateur fin entre chaque entrée

**Edge cases :**
- Si deux articles ont la même heure → les afficher dans l'ordre de création
- Si le fil est vide → ne pas afficher la section

**Assets visuels :** Observé sur lemonde.fr (section "En continu" avec bouton dédié dans la nav)
**Complexité :** S
**Dépendances :** Story #2

---

### Story #15 — Tags contextuels sur page rubrique

**En tant que** visiteur
**Je veux** voir des tags thématiques sur la page rubrique
**Pour** filtrer les articles par sous-thème (ex: "Budget 2026", "Assemblée nationale")

**Critères d'acceptation :**
- [ ] Badges cliquables sous le titre de la rubrique
- [ ] Les tags sont extraits des articles de la rubrique (mots-clés les plus fréquents)
- [ ] Clic sur un tag → filtre les articles affichés (via query parameter `?tag={tag}`)
- [ ] Bouton "Voir plus ▼" si plus de 5 tags

**Edge cases :**
- Si aucun article n'a de tags → ne pas afficher la section tags
- Si le tag sélectionné ne correspond à aucun article visible → message "Aucun article pour ce tag"

**Complexité :** M
**Dépendances :** Story #5
**Prérequis données :** Ajouter un champ `tags` au modèle Article (array de strings ou table dédiée)

---

### Story #16 — Bouton "Copier le lien" (partage)

**En tant que** visiteur
**Je veux** copier le lien d'un article en un clic
**Pour** le partager facilement par message ou autre canal

**Critères d'acceptation :**
- [ ] Bouton supplémentaire dans la barre de partage (page article)
- [ ] Icône chaîne/lien
- [ ] Clic → copie l'URL complète dans le presse-papiers (`navigator.clipboard.writeText`)
- [ ] Feedback visuel : le texte du bouton change temporairement en "Lien copié !" (2 secondes)

**Edge cases :**
- Si le navigateur ne supporte pas l'API Clipboard → fallback avec `document.execCommand('copy')` ou masquer le bouton
- Si la copie échoue → afficher "Erreur, copiez manuellement"

**Complexité :** S
**Dépendances :** Story #4

---

## 7. Suggestions du BA

> Features non demandées dans le BRIEF mais recommandées pour la qualité du clone.

### Story #17 — Temps de lecture calculé automatiquement

**En tant que** visiteur
**Je veux** voir le temps de lecture estimé sur chaque article
**Pour** savoir combien de temps la lecture va me prendre

**Critères d'acceptation :**
- [ ] Calcul automatique : nombre de mots / 200 (vitesse de lecture moyenne en français), arrondi au supérieur
- [ ] Affiché dans les métadonnées article : "{n} min de lecture"
- [ ] Affiché dans les ArticleCard (variant small et large)
- [ ] Calculé au moment du rendu (pas stocké en DB — dérivé du contenu)

**Edge cases :**
- Si le contenu est très court (< 200 mots) → "1 min de lecture"
- Si le contenu est vide → ne pas afficher le temps de lecture

**Complexité :** S
**Dépendances :** Story #3

---

### Story #18 — Date relative vs absolue

**En tant que** visiteur
**Je veux** voir les dates en format relatif pour les articles récents
**Pour** savoir rapidement si un article est d'actualité

**Critères d'acceptation :**
- [ ] Articles de moins de 24h : "Il y a {n}h" ou "Il y a {n} min"
- [ ] Articles de moins de 7 jours : "Il y a {n} jours"
- [ ] Articles de plus de 7 jours : date absolue "27 mars 2026"
- [ ] Page article : toujours date absolue complète (avec heure)
- [ ] Fonction utilitaire `formatRelativeDate(date: Date): string` dans `src/lib/utils.ts`

**Edge cases :**
- Si la date est dans le futur (erreur de seed) → afficher la date absolue
- Si la date est de moins de 1 minute → "À l'instant"

**Complexité :** S
**Dépendances :** Aucune

---

### Story #19 — Accessibilité (a11y)

**En tant que** utilisateur en situation de handicap
**Je veux** un site accessible conforme aux standards WCAG 2.1 AA
**Pour** naviguer et lire les articles avec des technologies d'assistance

**Critères d'acceptation :**
- [ ] Tous les liens et boutons ont un `aria-label` si le texte n'est pas explicite
- [ ] Ordre de tabulation logique (focus visible sur tous les éléments interactifs)
- [ ] Skip-to-content link en haut de page (invisible sauf au focus)
- [ ] Images avec `alt` descriptif (pas d'alt vide sauf décoratif)
- [ ] Contraste des couleurs ≥ 4.5:1 pour le texte, ≥ 3:1 pour les grands textes
- [ ] Formulaires : labels associés aux inputs, messages d'erreur liés via `aria-describedby`
- [ ] Structure de headings logique (h1 → h2 → h3, pas de saut)
- [ ] Les rôles ARIA sont utilisés correctement (`role="navigation"`, `role="banner"`, etc.)

**Edge cases :**
- Si un composant interactif est ajouté dynamiquement → s'assurer que le focus est géré
- Si le bandeau cookies apparaît → il doit être annoncé par les lecteurs d'écran

**Complexité :** M
**Dépendances :** Toutes les stories UI

---

### Story #20 — Responsive design complet

**En tant que** visiteur mobile
**Je veux** un site parfaitement lisible et navigable sur smartphone et tablette
**Pour** lire les articles dans de bonnes conditions sur tout support

**Critères d'acceptation :**
- [ ] Breakpoints : mobile (< 640px), tablette (640-1024px), desktop (> 1024px)
- [ ] Accueil mobile : Hero en pleine largeur (pas de sidebar), sections en 1 colonne
- [ ] Accueil tablette : Hero en 2 colonnes, sections en 2 colonnes
- [ ] Accueil desktop : layout complet (Hero 65/35, sections en 3-4 colonnes)
- [ ] Article mobile : image pleine largeur, texte 16px, partage en bas (pas de barre latérale)
- [ ] Header mobile : logo centré, hamburger, pas de rubriques visibles
- [ ] Footer mobile : colonnes empilées verticalement
- [ ] Pagination mobile : numéros masqués, seuls "Précédent"/"Suivant" visibles
- [ ] Touch targets ≥ 44px pour les boutons et liens

**Edge cases :**
- Si l'écran est très étroit (< 320px, ex: Galaxy Fold plié) → le contenu ne doit pas déborder
- Si l'orientation change (portrait ↔ paysage) → le layout s'adapte sans rechargement

**Complexité :** M
**Dépendances :** Toutes les stories UI

---

### Story #21 — Page 404 personnalisée

**En tant que** visiteur
**Je veux** une page 404 cohérente avec le design du site
**Pour** comprendre que la page n'existe pas et revenir à la navigation

**Critères d'acceptation :**
- [ ] Message clair : "Page introuvable" avec description
- [ ] Bouton "Retour à l'accueil" (lien vers `/`)
- [ ] Suggestions : afficher les 3 derniers articles (optionnel)
- [ ] Le layout (Header + Footer) est conservé
- [ ] SEO : meta `<title>` "Page introuvable — Le Monde"

**Edge cases :**
- Si l'URL contient des caractères Unicode → la page 404 doit s'afficher correctement

**Complexité :** S
**Dépendances :** Story #1

---

### Story #22 — Données de seed enrichies

**En tant que** développeur
**Je veux** des données de seed réalistes et complètes
**Pour** tester et présenter le site de manière crédible

**Critères d'acceptation :**
- [ ] 8 catégories (existantes) : International, Politique, Économie, Société, Culture, Sport, Sciences, Planète
- [ ] 30+ articles réalistes en français avec :
  - Titres accrocheurs de style éditorial
  - Chapeaux de 1-2 phrases
  - Contenu HTML de 3-5 paragraphes (pas juste du Lorem Ipsum)
  - Auteurs variés (5-8 noms différents)
  - Dates échelonnées sur les 30 derniers jours
  - Images via URLs Unsplash (thématiques)
- [ ] 1 utilisateur test : `lecteur@lemonde.fr` / `password123`
- [ ] Le seed est idempotent (`upsert` — peut être exécuté plusieurs fois)
- [ ] `npm run db:seed` fonctionne sans erreur

**Edge cases :**
- Si la DB existe déjà → le seed met à jour sans dupliquer
- Si une image Unsplash est inaccessible → le site doit fonctionner (pas de crash)

**Complexité :** M
**Dépendances :** Aucune

---

## 8. Récapitulatif et priorisation

### Ordre d'implémentation recommandé

| Phase | Stories | Description | Priorité |
|-------|---------|-------------|----------|
| **Phase 0 — Nettoyage** | #0 | Résolution conflits merge, migration Prisma | BLOQUANT |
| **Phase 1 — Squelette** | #1, #6, #22 | Header, Footer, Seed données | Haute |
| **Phase 2 — Contenu** | #3, #2, #4, #5 | ArticleCard, Accueil, Article, Rubrique | Haute |
| **Phase 3 — Utilisateurs** | #7, #8, #9, #10 | Inscription, Connexion, Espace perso, Newsletter | Haute |
| **Phase 4 — Navigation** | #11, #12, #13, #21 | Recherche, SEO, RGPD, 404 | Moyenne |
| **Phase 5 — Enrichissement** | #14, #17, #18, #16 | En continu, Temps lecture, Date relative, Copier lien | Basse |
| **Phase 6 — Qualité** | #15, #19, #20 | Tags rubrique, Accessibilité, Responsive | Basse |

### Estimation globale

| Taille | Nombre de stories | Stories |
|--------|-------------------|---------|
| **S** (simple) | 8 | #9, #10, #13, #14, #16, #17, #18, #21 |
| **M** (moyen) | 11 | #0, #1, #3, #5, #6, #7, #8, #11, #12, #15, #19, #20, #22 |
| **L** (large) | 2 | #2, #4 |
| **XL** | 0 | — |

---

## 9. Modèle de données

Le schéma Prisma existant (`prisma/schema.prisma`) couvre les besoins du MVP :

```
┌─────────────┐       ┌──────────────┐
│   Category   │──1:N──│   Article    │
│─────────────│       │──────────────│
│ id (cuid)   │       │ id (cuid)    │
│ name        │       │ title        │
│ slug        │       │ slug (unique)│
│ description │       │ excerpt      │
│ order       │       │ content      │
│             │       │ imageUrl     │
│             │       │ imageAlt     │
│             │       │ author       │
│             │       │ categoryId   │
│             │       │ publishedAt  │
│             │       │ createdAt    │
│             │       │ updatedAt    │
└─────────────┘       └──────────────┘

┌─────────────┐       ┌──────────────┐
│    User      │──1:N──│   Session    │
│─────────────│       │──────────────│
│ id (cuid)   │       │ sessionToken │
│ name        │       │ expires      │
│ email       │──1:N──│              │
│ passwordHash│       └──────────────┘
│ createdAt   │
│ updatedAt   │       ┌──────────────┐
│             │──1:N──│   Account    │
└─────────────┘       └──────────────┘

┌──────────────┐
│  Newsletter   │
│──────────────│
│ id (cuid)    │
│ email (unique)│
│ active       │
│ subscribedAt │
└──────────────┘
```

### Évolutions suggérées (Phase 5+)

| Champ / Table | Story | Justification |
|---------------|-------|---------------|
| `Article.tags` (String, JSON array) | #15 | Tags contextuels pour filtrage sur page rubrique |
| `Article.readingTime` (computed) | #17 | Calculé à la volée, pas besoin de colonne |

---

## 10. Hors scope

Les features suivantes sont présentes sur lemonde.fr mais **exclues** du MVP :

| Feature | Raison d'exclusion |
|---------|-------------------|
| Paywall / Abonnement | Complexité monétisation, pas dans le BRIEF |
| Commentaires | Modération nécessaire, complexité |
| LIVE / Alertes en temps réel | WebSockets, infrastructure |
| Application mobile | Hors scope (web only) |
| Mode sombre | Non demandé, pas sur lemonde.fr |
| Multi-langue (FR/EN) | Non demandé |
| Notifications push | Non demandé |
| Analytics (Plausible/GA) | Le composant existe mais hors scope fonctionnel |
| Vidéos embarquées | Complexité lecteur vidéo |
| Podcasts | Non demandé |
| Espace abonné (archives, PDF) | Lié au paywall |
| Publicités | Non demandé |
| API publique | Non demandé |

---

## Annexe — Captures de référence

| Fichier | Page | Date |
|---------|------|------|
| `references/lemonde-accueil.png` | Page d'accueil lemonde.fr (full page) | 2026-03-27 |
| `references/lemonde-rubrique-politique.png` | Page rubrique Politique | 2026-03-27 |
