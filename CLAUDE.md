# CLAUDE.md — lemonde

## Projet
Clone de lemonde.fr — site d'actualités avec design fidèle, lecture d'articles, comptes utilisateurs et newsletter.

## Stack
- **Framework** : Next.js 16 (App Router, React Server Components, Turbopack)
- **Langage** : TypeScript 5.8
- **Style** : Tailwind CSS 4
- **ORM** : Prisma 6 + SQLite
- **Auth** : Auth.js v5 (NextAuth) avec Credentials provider + Prisma adapter
- **Validation** : Zod
- **Tests** : Jest + ts-jest
- **Runtime** : Node.js 24

## Structure
```
src/
├── app/              # Pages et routes (App Router)
│   ├── api/          # Routes API (auth, newsletter)
│   ├── article/      # Page article dynamique [slug]
│   ├── auth/         # Pages signin/signup
│   └── espace-perso/ # Espace utilisateur (protégé)
├── components/       # Composants React
│   ├── layout/       # Header, Footer, Navigation
│   ├── articles/     # Composants articles
│   ├── auth/         # Formulaires auth
│   ├── newsletter/   # Formulaire newsletter
│   └── rgpd/         # Bandeau cookies
├── lib/              # Logique métier (prisma, auth)
└── utils/            # Utilitaires
prisma/
├── schema.prisma     # Schéma de données
└── seed.ts           # Données de seed (30 articles)
tests/                # Tests unitaires
```

## Conventions
- Nommage composants : PascalCase (`ArticleCard.tsx`)
- Nommage fichiers utilitaires : camelCase (`prisma.ts`)
- Imports : alias `@/` → `src/`
- Pages serveur par défaut, `"use client"` seulement si interactivité nécessaire
- Validation des entrées utilisateur avec Zod sur toutes les routes API
- Pas de données hardcodées dans le code — tout vient de la DB

## Commandes
```bash
npm run dev          # Lancer en dev (Turbopack)
npm run build        # Build production
npm run start        # Serveur production
npm run setup        # Setup complet (env + DB + seed)
npm run db:generate  # Régénérer le client Prisma
npm run db:migrate   # Lancer les migrations
npm run db:seed      # Remplir la DB avec les données de test
npm run db:studio    # Interface Prisma Studio
npm run test         # Lancer les tests
npm run lint         # ESLint
```

## Base de données
- SQLite (fichier `prisma/dev.db`)
- Modèles : User, Account, Session, VerificationToken (Auth.js) + Category, Article, Newsletter (métier)
- Seed : 8 catégories, 30 articles réalistes en français, 1 utilisateur test
- Utilisateur test : `lecteur@lemonde.fr` / `password123`

## Auth
- Provider : Credentials (email + mot de passe)
- Hash : bcryptjs (12 rounds)
- Session : JWT
- Route protégée : `/espace-perso`
- Middleware : protection automatique via `src/middleware.ts`

## Design
- Typographie : Georgia, serif (fidèle au Monde)
- Couleurs CSS variables : `--lemonde-black`, `--lemonde-blue`, `--lemonde-border`, etc.
- Layout max 1200px centré
- Articles max 760px (lecture confortable)

## Règles
- Ne jamais stocker de données métier dans des fichiers de code
- Toujours valider les inputs avec Zod côté API
- Composants serveur par défaut
- Commits en français
- Tests obligatoires pour toute logique métier
