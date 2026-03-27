# ARCHITECTURE.md — lemonde

## 1. Vue d'ensemble

Clone fidèle de lemonde.fr — site d'actualités avec design éditorial, lecture d'articles, authentification utilisateurs et newsletter. Déploiement local uniquement.

## 2. Grille de décision — Stack

### Options évaluées

| Critère (Poids) | Next.js + Prisma + SQLite | Nuxt 3 + Drizzle + SQLite | Astro + tRPC + SQLite |
|---|---|---|---|
| Adéquation (Fort) | **9** — SSR/RSC natif, idéal pour site éditorial SEO-first | 8 — Bon SSR, écosystème auth moins mature | 7 — Excellent pour statique, moins naturel pour auth |
| Maturité (Fort) | **9** — Next.js 16 stable, Prisma 6 mature, communauté massive | 8 — Nuxt 3 stable, Drizzle en croissance | 7 — Astro mature pour le statique, intégrations dynamiques plus jeunes |
| Écosystème (Moyen) | **9** — Auth.js, Tailwind, Zod, ts-jest — tout existe et s'intègre | 7 — Nuxt Auth moins standardisé | 6 — Plus de plomberie pour auth + API |
| Performance (Moyen) | **8** — RSC + Turbopack, rendu serveur optimisé | 8 — Nitro performant | 9 — Rendu statique quasi instantané |
| Courbe apprentissage (Faible) | **7** — App Router complexe mais bien documenté | 7 — API similaire | 8 — Plus simple pour du contenu |
| Dispo locale (Fort) | **10** — Node 24 installé, npm 11 prêt | 10 — Même runtime | 10 — Même runtime |
| Compat env (Fort) | **10** — Aucune dépendance GUI, Wayland transparent | 10 | 10 |

### Scores pondérés

| Option | Score |
|---|---|
| **Next.js + Prisma + SQLite** | **9.0** |
| Nuxt 3 + Drizzle + SQLite | 8.1 |
| Astro + tRPC + SQLite | 7.6 |

### Décision

**Next.js 16 (App Router) + TypeScript 5.8 + Tailwind CSS 4 + Prisma 6 + SQLite + Auth.js v5**

Justification :
- **RSC (React Server Components)** — rendu serveur par défaut, idéal pour un site éditorial où le contenu vient de la DB. Pas de JavaScript inutile envoyé au client pour les pages de lecture.
- **Prisma + SQLite** — ORM typé qui génère les types TypeScript depuis le schéma. SQLite = zéro config, fichier unique, suffisant pour un MVP local. Migration vers PostgreSQL triviale (changer 1 ligne dans `schema.prisma`).
- **Auth.js v5** — standard de facto pour l'auth Next.js, adapter Prisma natif, session JWT sans état serveur.
- **Tailwind CSS 4** — utility-first, colocation des styles, purge automatique, pas de CSS mort.
- **Turbopack** — bundler dev Rust, démarrage et HMR quasi instantanés.

## 3. Stack technique

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| Framework | Next.js | 16.1 | App Router, RSC, API Routes, SSR |
| Langage | TypeScript | 5.8 | Typage statique, sécurité du code |
| Style | Tailwind CSS | 4.1 | Utility-first, responsive, thème custom |
| ORM | Prisma | 6.9 | Schéma déclaratif, client typé, migrations |
| Base de données | SQLite | fichier | `prisma/dev.db`, zéro config |
| Authentification | Auth.js (NextAuth v5) | 5.0-beta.25 | Credentials provider, JWT, Prisma adapter |
| Validation | Zod | 3.24 | Validation runtime des inputs API |
| Hash | bcryptjs | 3.0 | Hash mot de passe, 12 rounds |
| Tests | Jest + ts-jest | 29.7 | Tests unitaires TypeScript |
| Bundler dev | Turbopack | intégré | HMR rapide, compilation Rust |
| Runtime | Node.js | 24.14 | LTS, support ESM natif |

## 4. Architecture

### Pattern : App Router (Server-First MVC)

```
┌──────────────────────────────────────────────────────────┐
│                      NAVIGATEUR                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Composants  │  │ Interactivité│  │   Navigation   │  │
│  │ "use client"│  │ (cookie,auth)│  │  (App Router)  │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼────────────────┼──────────────────┼────────────┘
          │                │                  │
          ▼                ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                        │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE                        │ │
│  │  src/middleware.ts — protection routes /espace-perso │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │              APP ROUTER (src/app/)                   │ │
│  │                                                      │ │
│  │  Pages (RSC)              API Routes                 │ │
│  │  ├── page.tsx (accueil)   ├── /api/auth/[...nextauth]│ │
│  │  ├── article/[slug]       ├── /api/auth/signup       │ │
│  │  ├── rubrique/[rubrique]  └── /api/newsletter        │ │
│  │  ├── recherche                                       │ │
│  │  ├── auth/signin                                     │ │
│  │  ├── auth/signup                                     │ │
│  │  ├── espace-perso                                    │ │
│  │  └── politique-confidentialite                       │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │                  COUCHE METIER                       │ │
│  │  src/lib/                                            │ │
│  │  ├── prisma.ts    — client DB singleton              │ │
│  │  ├── auth.ts      — config Auth.js + callbacks       │ │
│  │  ├── auth.config.ts — providers (Credentials)        │ │
│  │  └── utils.ts     — formatage dates, slugs           │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │                  PRISMA ORM                          │ │
│  │  prisma/schema.prisma — schéma déclaratif            │ │
│  │  prisma/seed.ts       — 8 catégories, 30 articles    │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │               SQLite (prisma/dev.db)                 │ │
│  │  Users, Accounts, Sessions, VerificationTokens       │ │
│  │  Categories, Articles, Newsletters                   │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Séparation des responsabilités

| Couche | Fichiers | Responsabilité |
|---|---|---|
| **Présentation** | `src/components/*.tsx` | Composants UI réutilisables (Header, Footer, ArticleCard, etc.) |
| **Pages** | `src/app/**/page.tsx` | Fetch des données côté serveur (RSC), composition des composants |
| **API** | `src/app/api/**` | Endpoints REST (signup, newsletter), validation Zod |
| **Métier** | `src/lib/*.ts` | Auth config, client Prisma, utilitaires |
| **Données** | `prisma/` | Schéma, migrations, seed |
| **Middleware** | `src/middleware.ts` | Protection des routes authentifiées |

### Composants — Server vs Client

| Composant | Type | Justification |
|---|---|---|
| Pages (accueil, article, rubrique) | **Server** | Fetch DB direct, SEO, pas d'interactivité |
| Header, Footer, Breadcrumb | **Server** | Contenu statique, navigation standard |
| SearchBar | **Client** | Input utilisateur, état local |
| CookieBanner | **Client** | Interaction cookies, localStorage |
| ShareButtons | **Client** | Événements click, clipboard API |
| Formulaires auth | **Client** | État formulaire, soumission, erreurs |

## 5. Modèle de données

```
┌─────────────┐       ┌──────────────┐
│   Category   │──1:N──│   Article    │
│─────────────│       │──────────────│
│ id (cuid)   │       │ id (cuid)    │
│ name        │       │ title        │
│ slug        │       │ slug (unique)│
│ description │       │ excerpt      │
│ order       │       │ content      │
└─────────────┘       │ imageUrl     │
                      │ author       │
                      │ categoryId   │
                      │ publishedAt  │
                      └──────────────┘

┌─────────────┐       ┌──────────────┐       ┌───────────────────┐
│    User      │──1:N──│   Account    │       │ VerificationToken │
│─────────────│       │──────────────│       │───────────────────│
│ id (cuid)   │       │ provider     │       │ identifier        │
│ name        │──1:N──│ type         │       │ token             │
│ email       │       └──────────────┘       │ expires           │
│ passwordHash│                               └───────────────────┘
│ createdAt   │       ┌──────────────┐
└─────────────┘──1:N──│   Session    │       ┌──────────────┐
                      │──────────────│       │  Newsletter   │
                      │ sessionToken │       │──────────────│
                      │ expires      │       │ email (unique)│
                      └──────────────┘       │ active        │
                                             │ subscribedAt  │
                                             └──────────────┘
```

## 6. Flux d'authentification

```
Inscription :
  POST /api/auth/signup → Zod validation → bcryptjs.hash → prisma.user.create → redirect /auth/signin

Connexion :
  POST /api/auth/[...nextauth] → Credentials provider → bcryptjs.compare → JWT signé → cookie httpOnly

Accès protégé :
  GET /espace-perso → middleware.ts vérifie JWT → OK : page serveur / KO : redirect /auth/signin
```

## 7. SEO & Performance

| Technique | Implémentation |
|---|---|
| SSR natif | RSC — HTML complet envoyé, indexable |
| Meta dynamiques | `generateMetadata()` par page |
| Sitemap | `src/app/sitemap.ts` — génération dynamique depuis DB |
| Robots.txt | `src/app/robots.ts` |
| Sémantique | Balises `<article>`, `<nav>`, `<header>`, `<footer>`, `<time>` |
| Images | `next/image` — optimisation, lazy loading, WebP |

## 8. Structure des fichiers

```
lemonde/
├── prisma/
│   ├── schema.prisma          # Schéma DB déclaratif
│   ├── seed.ts                # 8 catégories + 30 articles + 1 user test
│   └── dev.db                 # SQLite (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout racine (Georgia, Tailwind, metadata)
│   │   ├── page.tsx           # Accueil — hero + grille articles
│   │   ├── not-found.tsx      # Page 404
│   │   ├── globals.css        # Variables CSS Le Monde + Tailwind
│   │   ├── robots.ts          # Robots.txt dynamique
│   │   ├── sitemap.ts         # Sitemap dynamique
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts  # Auth.js handler
│   │   │   │   └── signup/route.ts         # Inscription (Zod + bcrypt)
│   │   │   └── newsletter/route.ts         # Inscription newsletter (Zod)
│   │   ├── article/[slug]/page.tsx         # Page article (RSC)
│   │   ├── rubrique/[rubrique]/page.tsx    # Page rubrique (RSC)
│   │   ├── recherche/page.tsx              # Recherche articles
│   │   ├── auth/
│   │   │   ├── signin/page.tsx             # Formulaire connexion
│   │   │   └── signup/page.tsx             # Formulaire inscription
│   │   ├── espace-perso/page.tsx           # Espace utilisateur (protégé)
│   │   └── politique-de-confidentialite/page.tsx
│   ├── components/
│   │   ├── Header.tsx         # Navigation principale + rubriques
│   │   ├── Footer.tsx         # Pied de page
│   │   ├── ArticleCard.tsx    # Carte article réutilisable
│   │   ├── Breadcrumb.tsx     # Fil d'Ariane
│   │   ├── CookieBanner.tsx   # Bandeau RGPD
│   │   ├── SearchBar.tsx      # Barre de recherche
│   │   ├── ShareButtons.tsx   # Boutons partage social
│   │   └── Pagination.tsx     # Pagination
│   ├── lib/
│   │   ├── prisma.ts          # Client Prisma singleton
│   │   ├── auth.ts            # Config Auth.js + handlers
│   │   ├── auth.config.ts     # Providers + callbacks
│   │   └── utils.ts           # Formatage dates, helpers
│   └── middleware.ts          # Protection routes /espace-perso
├── tests/                     # Tests unitaires Jest
├── .env.example               # Variables d'env (valeurs dev fonctionnelles)
├── setup.sh                   # Script setup automatique
├── next.config.ts             # Config Next.js (images remote)
├── tsconfig.json              # Config TypeScript (alias @/)
├── postcss.config.mjs         # PostCSS + Tailwind
├── jest.config.ts             # Config Jest + ts-jest
├── BRIEF.md                   # Brief fonctionnel
├── CLAUDE.md                  # Instructions techniques
└── ARCHITECTURE.md            # Ce document
```

## 9. Décisions d'architecture et compromis

| Décision | Justification | Compromis |
|---|---|---|
| **SQLite** au lieu de PostgreSQL | Zéro config, fichier unique, parfait pour MVP local | Pas de concurrence d'écriture, pas de full-text search avancé |
| **JWT** au lieu de sessions DB | Stateless, pas de lookup DB à chaque requête | Pas de révocation immédiate de session (expiration naturelle) |
| **Credentials provider** au lieu d'OAuth | Fidélité au clone (Le Monde utilise email/mdp), simplicité | Pas de SSO Google/GitHub, gestion mdp à notre charge |
| **RSC par défaut** | Performance, SEO, réduction du JS client | Composants interactifs nécessitent `"use client"` explicite |
| **Tailwind CSS 4** | Colocation styles/markup, purge automatique, pas de CSS mort | Classes verboses dans le JSX |
| **Prisma** au lieu de SQL brut | Client typé, migrations versionnées, schéma déclaratif | Overhead léger vs SQL direct |
| **Turbopack** (dev) | HMR quasi instantané, compilation Rust native | Encore en maturation, webpack en prod |
| **Zod** pour validation API | Inférence de types TS, messages d'erreur structurés | Lib supplémentaire vs validation manuelle |

## 10. Contraintes d'environnement

| Paramètre | Valeur | Impact |
|---|---|---|
| OS | Linux 6.17 (Ubuntu) | Aucun — stack 100% compatible |
| Display server | **Wayland** | Aucun impact — pas de GUI native, tout est web |
| Node.js | 24.14 (LTS) | Support ESM natif, performance V8 optimale |
| npm | 11.9 | Lockfile v3, installation rapide |
| Git | 2.43 | Standard |
| gh CLI | 2.45 | Kanban via `gh project` disponible |

## 11. Setup automatique

```bash
git clone <repo>
cd lemonde
npm install        # → postinstall copie .env.example → .env + prisma generate
npm run setup      # → migrations + seed (30 articles, 8 catégories, 1 user test)
npm run dev        # → http://localhost:3000
```

Utilisateur test : `lecteur@lemonde.fr` / `password123`

## 12. Anomalies détectées

1. **`src/data/articles.ts`** — fichier de données hardcodées dans le code source. Viole la règle "pas de données métier dans les fichiers de code". Toutes les données doivent venir de la DB via Prisma. Ce fichier doit être supprimé et remplacé par des requêtes `prisma.article.findMany()` dans les pages RSC.

2. **`package.json`** — contient un conflit de merge non résolu (marqueurs `<<<<<<< HEAD` / `=======` / `>>>>>>>`). Doit être résolu en conservant la version avec la stack complète (Next.js 16, Prisma, Auth.js).
