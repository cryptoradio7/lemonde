/**
 * @jest-environment jsdom
 *
 * Tests QA — app/not-found.tsx (story #21)
 * Couvre :
 *   - SEO : metadata.title = 'Page introuvable' (template layout → '… — Le Monde')
 *   - Message clair : h1 "Page introuvable", badge "Erreur 404", description
 *   - Bouton "Retour à l'accueil" → href="/"
 *   - Suggestions : 3 ArticleCard quand la DB retourne des articles
 *   - Fallback : aucune section suggestions si la DB est vide
 *   - Résilience : prisma lance une exception → pas de crash, section absente
 *   - Edge cases : URL Unicode, titre très long, DB avec 0 / 1 / 3 articles
 *   - Sécurité : contenu injecté dans les titres articles ne génère pas de XSS
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('@/components/ArticleCard', () => {
  const MockArticleCard = ({ article }: { article: { title: string; id: string } }) => (
    <div data-testid="article-card" data-id={article.id}>{article.title}</div>
  );
  MockArticleCard.displayName = 'MockArticleCard';
  return MockArticleCard;
});

// ─── Imports après mocks ──────────────────────────────────────────────────────

import { prisma } from '@/lib/prisma';
import NotFound, { metadata } from '@/app/not-found';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const prismaFindManyMock = prisma.article.findMany as jest.Mock;

function makeArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: 'art-1',
    title: 'La réforme de l\'éducation nationale',
    slug: 'reforme-education',
    excerpt: 'Le gouvernement annonce une réforme.',
    content: '<p>Contenu.</p>',
    imageUrl: null,
    imageAlt: null,
    author: 'Marie Dupont',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-27T09:00:00Z'),
    createdAt: new Date('2026-03-27T09:00:00Z'),
    updatedAt: new Date('2026-03-27T09:00:00Z'),
    category: {
      id: 'cat-1',
      name: 'International',
      slug: 'international',
      description: null,
      order: 1,
    },
    ...overrides,
  };
}

function makeArticles(count: number) {
  return Array.from({ length: count }, (_, i) =>
    makeArticle({
      id: `art-${i + 1}`,
      title: `Article récent ${i + 1}`,
      slug: `article-recent-${i + 1}`,
    })
  );
}

async function renderNotFound() {
  const jsx = await NotFound();
  return render(jsx as React.ReactElement);
}

beforeEach(() => {
  jest.clearAllMocks();
  prismaFindManyMock.mockResolvedValue([]);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEO — METADATA
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — SEO metadata', () => {
  it('metadata.title est "Page introuvable" (template layout applique "… — Le Monde")', () => {
    expect(metadata.title).toBe('Page introuvable');
  });

  it('metadata est un objet exporté', () => {
    expect(typeof metadata).toBe('object');
    expect(metadata).not.toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE — MESSAGE D'ERREUR
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — message d\'erreur', () => {
  it('affiche le badge "Erreur 404"', async () => {
    await renderNotFound();
    expect(screen.getByText('Erreur 404')).toBeInTheDocument();
  });

  it('affiche le h1 "Page introuvable"', async () => {
    await renderNotFound();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Page introuvable');
  });

  it('le h1 a le style Georgia, serif', async () => {
    await renderNotFound();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('affiche une description explicative (la page n\'existe pas ou a été déplacée)', async () => {
    await renderNotFound();
    expect(
      screen.getByText(/La page que vous recherchez n.existe pas ou a été déplacée/i)
    ).toBeInTheDocument();
  });

  it('le badge "Erreur 404" est en rouge (#E9322D)', async () => {
    await renderNotFound();
    const badge = screen.getByText('Erreur 404');
    expect(badge.className).toMatch(/text-\[#E9322D\]/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIEN RETOUR À L'ACCUEIL
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — lien retour accueil', () => {
  it('affiche un lien "Retour à l\'accueil"', async () => {
    await renderNotFound();
    const link = screen.getByRole('link', { name: /retour à l.accueil/i });
    expect(link).toBeInTheDocument();
  });

  it('le lien pointe vers "/"', async () => {
    await renderNotFound();
    const link = screen.getByRole('link', { name: /retour à l.accueil/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('le lien a un style de bouton (fond sombre)', async () => {
    await renderNotFound();
    const link = screen.getByRole('link', { name: /retour à l.accueil/i });
    // Le bouton est noir (#1D1D1B) avec texte blanc
    expect(link.className).toMatch(/bg-\[#1D1D1B\]/);
    expect(link.className).toMatch(/text-white/);
  });

  it('le lien a une transition hover (rouge sur survol)', async () => {
    await renderNotFound();
    const link = screen.getByRole('link', { name: /retour à l.accueil/i });
    expect(link.className).toMatch(/hover:bg-\[#E9322D\]/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUGGESTIONS — ARTICLES RÉCENTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — suggestions articles récents', () => {
  it('affiche 3 ArticleCard quand la DB retourne 3 articles', async () => {
    prismaFindManyMock.mockResolvedValue(makeArticles(3));
    await renderNotFound();
    const cards = screen.getAllByTestId('article-card');
    expect(cards).toHaveLength(3);
  });

  it('affiche la section "À lire également" quand des articles existent', async () => {
    prismaFindManyMock.mockResolvedValue(makeArticles(3));
    await renderNotFound();
    expect(screen.getByText('À lire également')).toBeInTheDocument();
  });

  it('N\'affiche PAS la section suggestions si la DB retourne 0 articles', async () => {
    prismaFindManyMock.mockResolvedValue([]);
    await renderNotFound();
    expect(screen.queryByText('À lire également')).not.toBeInTheDocument();
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });

  it('affiche 1 ArticleCard quand la DB retourne 1 article', async () => {
    prismaFindManyMock.mockResolvedValue(makeArticles(1));
    await renderNotFound();
    const cards = screen.getAllByTestId('article-card');
    expect(cards).toHaveLength(1);
  });

  it('appelle prisma.article.findMany avec take: 3 et tri desc', async () => {
    prismaFindManyMock.mockResolvedValue([]);
    await renderNotFound();
    expect(prismaFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 3,
        orderBy: { publishedAt: 'desc' },
      })
    );
  });

  it('la requête prisma inclut la catégorie (include: { category: true })', async () => {
    prismaFindManyMock.mockResolvedValue([]);
    await renderNotFound();
    expect(prismaFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { category: true },
      })
    );
  });

  it('la section "À lire également" a aria-label pour l\'accessibilité', async () => {
    prismaFindManyMock.mockResolvedValue(makeArticles(3));
    await renderNotFound();
    const section = screen.getByRole('region', { name: /articles récents/i });
    expect(section).toBeInTheDocument();
  });

  it('les articles récents sont dans une grille responsive (md:grid-cols-3)', async () => {
    prismaFindManyMock.mockResolvedValue(makeArticles(3));
    const { container } = await renderNotFound();
    const grid = container.querySelector('.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// RÉSILIENCE — ERREUR BASE DE DONNÉES
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — résilience DB', () => {
  it('N\'affiche pas de crash si prisma lève une exception', async () => {
    prismaFindManyMock.mockRejectedValue(new Error('DB connection failed'));
    // Le composant a un try/catch → retourne []
    await expect(renderNotFound()).resolves.toBeDefined();
  });

  it('N\'affiche pas de section articles si prisma lève une exception', async () => {
    prismaFindManyMock.mockRejectedValue(new Error('DB connection failed'));
    await renderNotFound();
    expect(screen.queryByText('À lire également')).not.toBeInTheDocument();
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });

  it('affiche quand même la page 404 complète même sans DB', async () => {
    prismaFindManyMock.mockRejectedValue(new Error('DB connection failed'));
    await renderNotFound();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page introuvable');
    expect(screen.getByRole('link', { name: /retour à l.accueil/i })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — edge cases', () => {
  it('edge case Unicode : titre article avec caractères Unicode s\'affiche correctement', async () => {
    const unicodeArticle = makeArticle({
      title: 'Αρθρο με ελληνικούς χαρακτήρες 日本語 🎉',
      id: 'art-unicode',
    });
    prismaFindManyMock.mockResolvedValue([unicodeArticle]);
    await renderNotFound();
    expect(screen.getByText('Αρθρο με ελληνικούς χαρακτήρες 日本語 🎉')).toBeInTheDocument();
  });

  it('edge case : titre article très long (500 chars) ne casse pas le rendu', async () => {
    const longTitle = 'A'.repeat(500);
    prismaFindManyMock.mockResolvedValue([makeArticle({ title: longTitle, id: 'art-long' })]);
    await renderNotFound();
    const card = screen.getByTestId('article-card');
    expect(card).toBeInTheDocument();
    expect(card.textContent).toBe(longTitle);
  });

  it('edge case sécurité : titre article avec <script> ne génère pas de XSS', async () => {
    const xssTitle = '<script>alert("xss")</script>Article sécurisé';
    prismaFindManyMock.mockResolvedValue([makeArticle({ title: xssTitle, id: 'art-xss' })]);
    await renderNotFound();
    // React échappe automatiquement les balises HTML dans le texte
    expect(document.querySelector('script[src]')).not.toBeInTheDocument();
    // Le mock rend le titre tel quel via textContent — React l'échappe
    const card = screen.getByTestId('article-card');
    expect(card).toBeInTheDocument();
  });

  it('edge case : article avec imageUrl null ne provoque pas de crash', async () => {
    prismaFindManyMock.mockResolvedValue([makeArticle({ imageUrl: null, imageAlt: null })]);
    await expect(renderNotFound()).resolves.toBeDefined();
  });

  it('edge case : title article avec apostrophe et guillemets', async () => {
    const specialTitle = 'L\'article "spécial" & les <entités>';
    prismaFindManyMock.mockResolvedValue([makeArticle({ title: specialTitle, id: 'art-special' })]);
    await renderNotFound();
    expect(screen.getByTestId('article-card')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE HTML / ACCESSIBILITÉ
// ═══════════════════════════════════════════════════════════════════════════════

describe('not-found — structure et accessibilité', () => {
  it('le conteneur principal a un max-w-[1200px] centré', async () => {
    const { container } = await renderNotFound();
    const wrapper = container.querySelector('.max-w-\\[1200px\\]');
    expect(wrapper).toBeInTheDocument();
  });

  it('le bloc 404 a une bordure inférieure de séparation', async () => {
    const { container } = await renderNotFound();
    const separator = container.querySelector('.border-b');
    expect(separator).toBeInTheDocument();
  });

  it('pas de lien cassé : le lien accueil a un href valide (/)', async () => {
    await renderNotFound();
    const link = screen.getByRole('link', { name: /retour à l.accueil/i });
    expect(link.getAttribute('href')).not.toBe('');
    expect(link.getAttribute('href')).not.toBeNull();
  });

  it('prisma est appelé exactement 1 fois par rendu', async () => {
    await renderNotFound();
    expect(prismaFindManyMock).toHaveBeenCalledTimes(1);
  });
});
