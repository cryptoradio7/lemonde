# Le Monde — Clone

Clone fidèle de lemonde.fr : site d'actualités avec design authentique, lecture d'articles, comptes utilisateurs et newsletter.

## Prérequis

- **Node.js** 20+ (testé avec Node 24)
- **npm** 10+
- **Git**

## Installation

```bash
git clone <URL_DU_REPO> lemonde
cd lemonde
npm install
```

> Le script `postinstall` crée automatiquement `.env` depuis `.env.example` et génère le client Prisma.

## Configuration

Le fichier `.env` est créé automatiquement à l'installation. Les valeurs par défaut fonctionnent pour le développement local.

Pour personnaliser (optionnel) :

```bash
# .env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="votre-secret-genere-avec-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

Générer un secret sécurisé :

```bash
openssl rand -base64 32
```

## Base de données

```bash
npm run db:migrate   # Créer/migrer la base SQLite
npm run db:seed      # Charger les données de démonstration
```

Données de démonstration incluses :
- 8 catégories (Politique, Économie, Culture, Sport…)
- 30 articles réalistes en français avec images Unsplash
- 1 utilisateur test : `lecteur@lemonde.fr` / `password123`

## Lancement

```bash
npm run dev          # Serveur de développement (Turbopack) → http://localhost:3000
```

## Setup complet en une commande

```bash
npm run setup        # Installe, migre et seed en une seule étape
npm run dev
```

## Build production

```bash
npm run build        # Build optimisé
npm run start        # Serveur de production → http://localhost:3000
```

## Tests

```bash
npm test             # Lance tous les tests Jest
npm test -- --watch     # Mode watch (développement)
npm test -- --coverage  # Avec rapport de couverture
```

Couverture : 29 fichiers de tests — API, pages, composants, librairies, accessibilité, responsive.

## Structure du projet

```
lemonde/
├── src/
│   ├── app/                    # Pages et routes (Next.js App Router)
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── article/[slug]/     # Lecteur d'article dynamique
│   │   ├── rubrique/[rubrique]/# Pages par catégorie
│   │   ├── auth/               # Connexion / inscription
│   │   ├── espace-perso/       # Tableau de bord utilisateur (protégé)
│   │   ├── recherche/          # Moteur de recherche
│   │   └── api/                # Routes API (auth, newsletter)
│   ├── components/             # Composants React réutilisables
│   │   ├── Header.tsx          # Navigation principale
│   │   ├── Footer.tsx          # Pied de page
│   │   ├── ArticleCard.tsx     # Carte article
│   │   ├── home/               # Sections de la page d'accueil
│   │   ├── articles/           # Composants lecteur d'article
│   │   ├── auth/               # Formulaires d'authentification
│   │   └── newsletter/         # Formulaire newsletter
│   ├── lib/                    # Logique métier
│   │   ├── auth.ts             # Configuration NextAuth
│   │   ├── prisma.ts           # Client Prisma (singleton)
│   │   ├── articles.ts         # Requêtes articles
│   │   ├── categories.ts       # Requêtes catégories
│   │   └── search.ts           # Logique de recherche
│   ├── utils/                  # Utilitaires
│   │   ├── formatDate.ts       # Formatage des dates
│   │   └── readingTime.ts      # Calcul temps de lecture
│   └── middleware.ts           # Protection routes (NextAuth)
├── prisma/
│   ├── schema.prisma           # Schéma de données (User, Article, Category…)
│   ├── seed.ts                 # Script de seed (idempotent)
│   └── seed-data.ts            # Données de démonstration (30 articles)
├── tests/                      # Tests unitaires (Jest + Testing Library)
├── references/                 # Captures d'écran design de référence
├── .env.example                # Template des variables d'environnement
└── CLAUDE.md                   # Conventions du projet
```

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.1 |
| Langage | TypeScript | 5.8 |
| Style | Tailwind CSS | 4.1 |
| ORM | Prisma | 6.9 |
| Base de données | SQLite | — |
| Authentification | Auth.js (NextAuth v5) | 5.0-beta |
| Validation | Zod | 3.24 |
| Tests | Jest + ts-jest | — |
| Runtime | Node.js | 24 |

## Authentification

- Provider : Credentials (email + mot de passe)
- Hachage : bcryptjs (12 rounds)
- Sessions : JWT (stateless)
- Route protégée : `/espace-perso` → redirige vers `/auth/signin` si non connecté

## Commandes disponibles

```bash
npm run dev          # Serveur dev (Turbopack)
npm run build        # Build production
npm run start        # Serveur production
npm run setup        # Setup complet (env + DB + seed)
npm run db:generate  # Régénérer le client Prisma
npm run db:migrate   # Lancer les migrations
npm run db:seed      # Remplir la DB avec les données de test
npm run db:studio    # Interface Prisma Studio (GUI base de données)
npm run test         # Lancer les tests
npm run lint         # ESLint
```

## Dépannage

**Erreur `DATABASE_URL` manquant après clone**
```bash
cp .env.example .env
npm run db:generate
```

**Erreur de migration Prisma**
```bash
rm -f prisma/dev.db
npm run db:migrate
npm run db:seed
```

**Port 3000 déjà utilisé**
```bash
npm run dev -- -p 3001
```

---

> Projet local uniquement — aucun déploiement externe prévu.
