# Architecture — Le Monde Clone

## Stack technique

| Couche | Technologie | Justification |
|--------|------------|---------------|
| Framework | Next.js 14 (App Router) | SSG/SSR, SEO natif, routing fichier |
| Langage | TypeScript | Typage statique, DX |
| Styles | Tailwind CSS 3.4 | Utility-first, responsive, thème custom |
| Hébergement | Vercel | Edge network, déploiement zero-config |
| Analytics | Plausible | RGPD-friendly, léger, sans cookies |

## Structure du projet

```
src/
├── app/                        # App Router (pages + layouts)
│   ├── layout.tsx              # Layout racine (Header, Footer, Cookie, Analytics)
│   ├── page.tsx                # Page d'accueil
│   ├── article/[slug]/page.tsx # Détail article (SSG)
│   ├── rubrique/[rubrique]/    # Pages par rubrique (SSG)
│   ├── recherche/page.tsx      # Recherche (SSR dynamique)
│   ├── politique-de-confidentialite/
│   ├── sitemap.ts              # Sitemap dynamique
│   ├── robots.ts               # robots.txt
│   └── not-found.tsx           # Page 404
├── components/                 # Composants React
│   ├── Header.tsx              # Navigation + logo + recherche + mobile
│   ├── Footer.tsx              # Footer multi-colonnes + newsletter
│   ├── ArticleCard.tsx         # Carte article (3 variantes: large/medium/small)
│   ├── SearchBar.tsx           # Barre de recherche
│   ├── CookieBanner.tsx        # Bannière RGPD cookies
│   ├── PlausibleAnalytics.tsx  # Script analytics conditionnel
│   ├── ShareButtons.tsx        # Partage réseaux sociaux
│   ├── Breadcrumb.tsx          # Fil d'Ariane
│   └── Pagination.tsx          # Pagination
├── data/
│   └── articles.ts             # 32 articles de démo + helpers
└── lib/
    └── utils.ts                # Utilitaires (slugify)
```

## Patterns architecturaux

- **Server Components par défaut** : Toutes les pages et composants statiques
- **Client Components** : Header (scroll), Footer (form), CookieBanner, SearchBar, ShareButtons, PlausibleAnalytics
- **Static Site Generation (SSG)** : Articles et rubriques pré-rendus via `generateStaticParams`
- **Dynamic rendering** : Page recherche uniquement (searchParams)

## Design System

- **Palette** : #1D1D1B (dark), #E9322D (rouge accent), #F5F5F5 (gris clair), #6B6B6B (texte secondaire), #D5D5D5 (bordures)
- **Typographie** : Georgia (titres + corps articles), Helvetica Neue/Arial (navigation + UI)
- **Responsive** : Mobile-first, breakpoints sm/md/lg

## Sécurité

- Headers HTTP : X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection
- Pas de secrets dans le code source
- .env.local dans .gitignore
- Analytics conditionnel au consentement RGPD

## SEO

- `generateMetadata` par page avec Open Graph
- Sitemap XML dynamique
- robots.txt
- Balises sémantiques HTML5
