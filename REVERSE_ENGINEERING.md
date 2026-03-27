# REVERSE_ENGINEERING.md — lemonde.fr

> Audit réalisé le 27/03/2026 via Playwright MCP sur https://www.lemonde.fr
> Screenshots sauvegardés dans `references/`

---

## A. Inventaire des composants visuels (par page)

### Page : Accueil (https://www.lemonde.fr/)

```
Page: Accueil
├── Header (banner)
│   ├── Top bar : bouton Menu (hamburger + texte) à gauche, logo "Le Monde" centré (typographie serif), boutons "S'abonner" (CTA jaune/doré) + icône "Se connecter" à droite
│   └── Nav principale (navigation) :
│       ├── Bouton "En continu" (icône horloge + texte) à gauche
│       ├── Liens actualités du moment : "Guerres au Proche-Orient", "Guerre en Ukraine" (texte orange/rouge, distinctif)
│       └── Rubriques horizontales : International, Planète, Politique, Société, Économie, Idées, Culture, Le Goût du Monde, Sciences, Sport, Pixels (texte blanc sur fond sombre, scroll horizontal)
│
├── Bandeau cookies / consentement RGPD (modal plein écran)
│   ├── Titre "Soutenez un journalisme fiable"
│   ├── Texte explicatif sur l'utilisation des cookies (partenaires, publicités, géolocalisation)
│   ├── Bouton "Accepter et continuer" (plein, noir)
│   ├── Bouton "S'abonner" (outline)
│   └── Lien "Déjà abonné ? Se connecter"
│
├── Zone publicitaire (iframe Google Ads en haut de page)
│
├── Hero section (main)
│   ├── Article principal :
│   │   ├── Badge "Article réservé aux abonnés" (icône cadenas)
│   │   ├── Titre H1 (heading level=1, lien cliquable, serif bold ~30px)
│   │   ├── Crédit photo en bas d'image ("JULIEN MUGUET POUR « LE MONDE »")
│   │   └── Chapeau (paragraph, résumé de l'article, ~2 lignes)
│   ├── Sidebar droite (liste) :
│   │   └── 1 article secondaire (titre seul, lien, badge abonné)
│   └── Articles complémentaires en dessous :
│       ├── Article avec image + titre + chapeau (badge abonné)
│       ├── Article avec image + titre (sans chapeau)
│       └── Disposition en 2 colonnes
│
├── Section articles courants (grille)
│   ├── Articles avec badges : "Article réservé aux abonnés", "Live" (rouge), "Article se déroulant en direct"
│   ├── Articles avec image + titre + chapeau
│   ├── Articles titre seul (compact)
│   ├── Bloc podcast : badge "podcast", date épisode, titre, bouton "Écouter l'épisode"
│   ├── Bloc "Sélection" : article avec badge + durée de lecture ("13 min de lecture")
│   └── Bloc "Service Le Monde" : lien promotionnel interne
│
├── Section "Live" (articles en direct)
│   ├── Badge "Live" (rouge) + "Article se déroulant en direct"
│   └── Titre cliquable avec horodatage ("20:39")
│
├── Zone publicitaire intercalée ("Publicité" + "proposé par")
│
├── Carrousel partenaire "Le Monde en partenariat avec Magnum Photos"
│   ├── Titre H4 + lien "Tous les tirages"
│   ├── Boutons navigation (précédent/suivant)
│   └── Items : photo + nom photographe + légende
│
├── Section "Sélection de la rédaction" (heading H4)
│   ├── 3 articles éditoriaux :
│   │   ├── Badge type : "Témoignages", "Sélection", "Tribune"
│   │   ├── Nom auteur
│   │   ├── Badge abonné
│   │   ├── Titre + chapeau
│   │   └── Durée lecture ("5 min de lecture", "25 min", "8 min")
│
├── Section "Idées" (heading H4, lien vers /idées/)
│   ├── Article type "Éditorial" (badge + auteur "Le Monde")
│   ├── Article type "Chronique" (badge + auteur + rôle, badge "S'abonner")
│   └── Article type "Décryptage" (badge + auteur)
│
├── Section "Les plus lus" (heading H4)
│   ├── Liste numérotée (1-9) de titres d'articles
│   └── Titres seuls, cliquables, sans image
│
├── Section "Partenaires" (heading H4)
│   ├── Bloc partenaires visuels
│   └── Sous-section "Guides d'achat" : titre H3 + liste de liens
│
├── Footer (contentinfo)
│   ├── Colonne "Services Le Monde" : Unes du Monde, Ateliers, Culture générale, Mots croisés, Sudokus, Résultats élections, Éducation, Gastronomie, Réutiliser nos contenus, Annonces légales, Le carnet du Monde
│   ├── Colonne "Guides d'achat Le Monde" : liens produits
│   ├── Colonne "Le Monde à l'international" : Le Monde in English, pays (Algérie, Belgique, Canada, Côte d'Ivoire, Mali, Maroc, Sénégal, Suisse, Tunisie)
│   ├── Colonne "Services Partenaires" : jeux, hôtels, art
│   ├── Colonne "Sites du groupe" : Courrier International, Télérama, La Vie, Le HuffPost, Le Nouvel Obs, Le Monde diplomatique, etc.
│   ├── Bloc "Newsletters du monde" : lien inscription
│   ├── Bloc "Applications Mobiles" : liens iPhone / Android
│   ├── Bloc "Abonnement" : Archives, S'abonner/Se désabonner, Se connecter, Journal du jour, Événements abonnés, Jeux-concours, Contacter Le Monde
│   ├── Bloc "Informations légales" : Mentions légales, Charte du Groupe, Politique de confidentialité, Gestion des cookies, CGV, FAQ, Votre avis
│   └── Bloc "Suivez Le Monde" : Facebook, Youtube, Instagram, Snapchat, TikTok, Fils RSS
```

### Page : Article

```
Page: Article
├── Header (identique à l'accueil)
│   └── Rubrique active surlignée dans la nav ("Politique" en surbrillance)
│
├── Zone publicitaire (bannière pleine largeur)
│
├── Fil d'Ariane (breadcrumb)
│   ├── Rubrique ("POLITIQUE")
│   └── Sous-rubrique ("FINANCES PUBLIQUES") — séparées par "·"
│
├── Titre article
│   ├── Heading H1, police serif bold, ~30px
│   └── Titre complet avec ":" fréquent (format éditorial Le Monde)
│
├── Chapeau (lead/excerpt)
│   ├── Paragraphe italique, ~16px
│   └── Résumé factuel de l'article
│
├── Métadonnées
│   ├── "Par {Auteur}" (lien vers page auteur)
│   ├── "Publié aujourd'hui à 08h12" (date relative puis absolue)
│   └── "Lecture 4 min." (icône horloge + durée)
│
├── Barre d'actions
│   ├── Bouton "Lire plus tard" (icône bookmark)
│   └── Bouton "Partager" (icône share)
│
├── Badge "Article réservé aux abonnés" (icône cadenas + texte)
│
├── Image principale
│   ├── Photo pleine largeur (max ~760px)
│   └── Crédit photo ("JULIEN MUGUET POUR « LE MONDE »")
│
├── Contenu article (texte riche)
│   ├── Paragraphes avec liens internes
│   ├── Intertitres H2
│   └── Message paywall : "Il vous reste 82.23% de cet article à lire. La suite est réservée aux abonnés."
│
├── Sidebar droite (sur desktop)
│   ├── Articles "à la une" de la même rubrique
│   └── Publicité
│
├── Footer (identique à l'accueil)
```

---

## B. Inventaire des features visibles

| # | Feature | Détails observés | Scope MVP |
|---|---------|-----------------|-----------|
| 1 | **Navigation par rubriques** | 12 rubriques dans la nav horizontale (International, Planète, Politique, Société, Économie, Idées, Culture, Le Goût du Monde, Sciences, Sport, Pixels) + liens actualités du moment | OUI |
| 2 | **Menu hamburger** | Bouton "Menu" à gauche du header, ouvre navigation complète | OUI |
| 3 | **Bouton "En continu"** | Accès au flux d'articles en temps réel | NON (V2) |
| 4 | **Fil d'actualités du moment** | 2 liens thématiques mis en avant (orange) dans la nav | OUI (statique) |
| 5 | **Authentification** | "Se connecter" (header), formulaire connexion/inscription | OUI |
| 6 | **Abonnement** | Bouton "S'abonner" CTA jaune, paywall sur articles | HORS SCOPE (pas de paiement) |
| 7 | **Hero section éditoriale** | Article principal large + sidebar + articles secondaires | OUI |
| 8 | **Badges articles** | "Article réservé aux abonnés" (cadenas), "Live" (rouge), types (Éditorial, Chronique, Décryptage, Tribune, Témoignages, Sélection) | OUI (simplifiés) |
| 9 | **Durée de lecture** | "X min de lecture" affiché sur certains articles | OUI |
| 10 | **Podcast intégré** | Lecteur audio avec bouton "Écouter l'épisode" | NON (V2) |
| 11 | **Articles en direct (Live)** | Badge rouge, horodatage, mise à jour en temps réel | NON (V2) |
| 12 | **Sélection de la rédaction** | Section éditoriale avec articles recommandés | OUI |
| 13 | **Section "Les plus lus"** | Top 9 articles, liste numérotée, titres seuls | OUI |
| 14 | **Section "Idées"** | Bloc éditorial avec types d'articles (éditorial, chronique, décryptage) | OUI |
| 15 | **Carrousel partenaires** | Slider avec navigation (Magnum Photos) | NON (hors scope) |
| 16 | **Guides d'achat** | Section avec liens vers guides | NON (hors scope) |
| 17 | **Page article complète** | Breadcrumb, titre H1, chapeau, auteur, date, durée lecture, image créditée, contenu texte riche | OUI |
| 18 | **Bouton "Lire plus tard"** | Bookmark d'article (icône signet) | OUI |
| 19 | **Bouton "Partager"** | Partage social (icône share) | OUI |
| 20 | **Paywall** | Message "Il vous reste X% de cet article à lire" | HORS SCOPE |
| 21 | **Newsletter** | Formulaire inscription dans le footer | OUI |
| 22 | **Réseaux sociaux** | Liens footer : Facebook, Youtube, Instagram, Snapchat, TikTok, RSS | OUI |
| 23 | **Bandeau RGPD** | Modal consentement cookies (Accepter / S'abonner / Se connecter) | OUI |
| 24 | **Recherche** | Non visible directement (dans le menu hamburger) | OUI |
| 25 | **Footer multi-colonnes** | Services, Guides, International, Partenaires, Sites du groupe, Infos légales, Réseaux sociaux | OUI |
| 26 | **Applications mobiles** | Liens iPhone / Android dans le footer | NON (hors scope) |
| 27 | **Publicités** | Bannières iframe (Google Ads) | HORS SCOPE |
| 28 | **Politique de confidentialité** | Page dédiée (lien footer) | OUI |
| 29 | **SEO** | Meta tags, title dynamique, sémantique HTML | OUI |
| 30 | **Responsive** | Navigation adaptative (non testé mobile mais structure responsive) | OUI |

---

## C. Modèle de données implicite

```
Category (Rubrique):
  - id (cuid)
  - name (string) : "Politique", "International", "Économie"...
  - slug (string) : "politique", "international"
  - description (string, optionnel)
  - order (int) : ordre d'affichage dans la nav

Article:
  - id (cuid)
  - title (string, ~100-150 chars) : titre complet avec ":"
  - slug (string, unique) : généré depuis le titre
  - excerpt (string, ~200 chars) : chapeau/résumé italique
  - content (text, rich text) : paragraphes multiples, liens internes, intertitres H2
  - imageUrl (string) : URL image principale
  - imageCredit (string) : "JULIEN MUGUET POUR « LE MONDE »"
  - author (string) : "Denis Cosnard" (avec lien potentiel)
  - readingTime (int) : durée en minutes (4 min)
  - categoryId (FK → Category)
  - tags (string[]) : sous-rubriques ("Finances publiques")
  - articleType (enum) : normal | editorial | chronique | decryptage | tribune | temoignage | selection | reportage
  - isPremium (boolean) : article réservé aux abonnés
  - isLive (boolean) : article en direct (badge Live rouge)
  - publishedAt (datetime) : "Publié aujourd'hui à 08h12"
  - updatedAt (datetime, optionnel)

User:
  - id (cuid)
  - name (string)
  - email (string, unique)
  - passwordHash (string) : bcrypt 12 rounds
  - createdAt (datetime)

Newsletter:
  - id (cuid)
  - email (string, unique)
  - active (boolean)
  - subscribedAt (datetime)

ReadLater (suggestion BA — marque-pages):
  - userId (FK → User)
  - articleId (FK → Article)
  - savedAt (datetime)
```

---

## D. Layout exact par page

### Accueil — Header

```
┌────────────────────────────────────────────────────────────┐
│ [≡ Menu]          Le Monde (logo serif)    [S'abonner] [👤]│
├────────────────────────────────────────────────────────────┤
│ [⟳ En continu] | Guerres au PO | Guerre Ukraine | Inter │
│                 | national | Planète | Politique | Société│
│                 | Économie | Idées | Culture | ...        │
└────────────────────────────────────────────────────────────┘
Fond : noir/très foncé (#2A2A2A)
Texte nav : blanc
Liens actualités du moment : orange (#E8A33D)
CTA S'abonner : fond jaune/doré, texte noir
```

### Accueil — Hero section

```
┌──────────────────────────────────────────┬───────────────────┐
│  [Banner pub pleine largeur iframe]       │                   │
├──────────────────────────────────────────┼───────────────────┤
│  🔒 Article réservé aux abonnés          │                   │
│  TITRE PRINCIPAL H1                      │  Titre article 2  │
│  (serif bold, ~30px, lien)               │  (compact, lien)  │
│  Crédit photo                            │                   │
│  Chapeau (paragraphe résumé)             │                   │
│                                          │                   │
│  Largeur : ~65%                          │  Largeur : ~35%   │
├──────────────────────────────────────────┴───────────────────┤
│                                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐   │
│  │ 🔒 Article 3        │  │ Image + Titre article 4      │   │
│  │ Titre + chapeau     │  │ (sans badge abonné)          │   │
│  │                     │  │                              │   │
│  └─────────────────────┘  └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│  Grille articles 3 colonnes :                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Article  │  │ Article  │  │ Article  │                   │
│  │ + image  │  │ + chapeau│  │ badge    │                   │
│  │ + badges │  │          │  │ Live 🔴  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

### Accueil — Sections basses

```
┌──────────────────────────────────────────────────────────────┐
│  SÉLECTION DE LA RÉDACTION (H4)                              │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐  │
│  │ Badge: Témoignage│ │ Badge: Sélection │ │Badge: Tribune│  │
│  │ Auteur           │ │ Auteur           │ │ Auteur       │  │
│  │ 🔒 Titre         │ │ 🔒 Titre         │ │ 🔒 Titre     │  │
│  │ Chapeau          │ │ Chapeau          │ │ Chapeau      │  │
│  │ 5 min de lecture │ │ 25 min de lecture│ │ 8 min lecture│  │
│  └──────────────────┘ └──────────────────┘ └──────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  IDÉES (H4, lien → /idées/)                                 │
│  Éditorial | Chronique | Décryptage                          │
├──────────────────────────────────────────────────────────────┤
│  LES PLUS LUS (H4)                                          │
│  1. Titre article...                                         │
│  2. Titre article...                                         │
│  ...                                                         │
│  9. Titre article...                                         │
└──────────────────────────────────────────────────────────────┘
```

### Article — Layout

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (identique)                                          │
├──────────────────────────────────────────────────────────────┤
│  [Banner publicitaire]                                       │
├──────────────────────────────────────────────────────────────┤
│  POLITIQUE · FINANCES PUBLIQUES (breadcrumb, uppercase, gris)│
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐  ┌───────────┐  │
│  │                                         │  │ Sidebar   │  │
│  │  TITRE H1 (serif bold, ~30px)           │  │ Articles  │  │
│  │                                         │  │ à la une  │  │
│  │  Chapeau (serif, ~16px, italique)       │  │           │  │
│  │                                         │  │           │  │
│  │  Par {Auteur}                           │  │           │  │
│  │  Publié {date} · ⏱ Lecture X min.       │  │           │  │
│  │                                         │  │           │  │
│  │  [🔖 Lire plus tard]  [↗ Partager]      │  │           │  │
│  │                                         │  │           │  │
│  │  🔒 Article réservé aux abonnés         │  │           │  │
│  │                                         │  │           │  │
│  │  ┌─────────────────────────────────┐    │  │           │  │
│  │  │ IMAGE (pleine largeur ~760px)   │    │  │           │  │
│  │  │                                 │    │  │           │  │
│  │  └─────────────────────────────────┘    │  │           │  │
│  │  Crédit photo (petite police, gris)     │  │           │  │
│  │                                         │  │           │  │
│  │  Paragraphe 1...                        │  │           │  │
│  │  Paragraphe 2...                        │  │           │  │
│  │  Intertitre H2                          │  │           │  │
│  │  Paragraphe 3...                        │  │           │  │
│  │                                         │  │           │  │
│  │  Largeur contenu : ~760px               │  │ ~300px    │  │
│  └─────────────────────────────────────────┘  └───────────┘  │
├──────────────────────────────────────────────────────────────┤
│  FOOTER (identique)                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## E. Règles de gestion visibles

| Règle | Détail |
|-------|--------|
| **Ordre des articles accueil** | Éditorial (manuel), pas strictement chronologique. L'article principal est choisi par la rédaction. |
| **Badge "réservé aux abonnés"** | Icône cadenas + texte. Présent sur la majorité des articles. Le contenu est tronqué avec message paywall ("Il vous reste X% de cet article à lire"). |
| **Badge "Live"** | Fond rouge, texte blanc. Indique un article en direct avec mises à jour. Accompagné de "Article se déroulant en direct". |
| **Types d'articles** | Éditorial (signé "Le Monde"), Chronique (auteur + rôle), Décryptage, Tribune, Témoignages, Sélection, Reportage. Chaque type a un badge distinct. |
| **Format dates** | Relative : "Publié aujourd'hui à 08h12". Articles plus anciens : date absolue. |
| **Durée de lecture** | Format "X min de lecture" ou "Lecture X min." Affiché quand > 0. |
| **Crédit photo** | Toujours en majuscules, petite police grise, sous l'image : "NOM POUR « LE MONDE »". |
| **Troncature titres** | Pas de troncature visible — les titres sont complets (souvent longs, 100+ caractères). |
| **Hover** | Titres soulignés au hover (cursor pointer sur tous les liens). |
| **Navigation active** | La rubrique active est visuellement distinguée dans la nav (la rubrique "Politique" change de style sur la page article Politique). |
| **Breadcrumb** | Format : "RUBRIQUE · SOUS-RUBRIQUE" en uppercase, police petite, liens cliquables. |
| **Auteur** | Affiché avec "Par " devant. Lien vers la page de l'auteur. |

---

## F. Features à implémenter vs hors scope

### MVP (à implémenter)

1. Header complet (logo, menu hamburger, nav rubriques, CTA S'abonner factice, bouton Se connecter)
2. Page accueil avec hero section (article principal + sidebar + grille)
3. Section "Sélection de la rédaction"
4. Section "Les plus lus"
5. Section "Idées" avec badges de types d'articles
6. Page article complète (breadcrumb, titre, chapeau, auteur, date, durée, image créditée, contenu)
7. Boutons "Lire plus tard" et "Partager"
8. Pages rubrique (listing articles par catégorie)
9. Recherche d'articles
10. Authentification (inscription + connexion + espace perso)
11. Newsletter (formulaire inscription)
12. Bandeau RGPD (consentement cookies)
13. Footer multi-colonnes avec réseaux sociaux
14. SEO (meta tags, sitemap, sémantique HTML)
15. Responsive design
16. Page politique de confidentialité

### Hors scope (clone fidèle mais non implémenté)

1. **Paywall / abonnement payant** — pas de système de paiement
2. **Articles en direct (Live)** — pas de WebSocket / temps réel
3. **Podcast intégré** — pas de lecteur audio
4. **Flux "En continu"** — pas de mise à jour temps réel
5. **Carrousel partenaires** — contenu commercial
6. **Guides d'achat** — section commerciale
7. **Publicités** — pas de régie publicitaire
8. **Applications mobiles** — uniquement web
9. **Sites du groupe** — liens externes informatifs uniquement
10. **Commentaires** — non visibles sur le site (réservés abonnés, non affiché dans notre audit)
