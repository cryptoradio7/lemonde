/**
 * @jest-environment jsdom
 *
 * Tests — app/article/[slug]/page.tsx (React Server Component)
 * Couvre : rendu complet, notFound, SEO, image optionnelle, articles liés,
 *          sanitisation HTML, métadonnées OpenGraph
 *
 * Pattern : on appelle le composant comme une fonction async, on render le JSX résultant.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks infrastructure ─────────────────────────────────────────────────────

jest.mock('@/lib/articles', () => ({
  getArticleBySlug:   jest.fn(),
  getRelatedArticles: jest.fn(),
  getAllArticleSlugs:  jest.fn(),
}));

const mockNotFound = jest.fn(() => { throw new Error('NEXT_NOT_FOUND'); });
jest.mock('next/navigation', () => ({
  notFound: mockNotFound,
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

jest.mock('@/components/Breadcrumb', () => {
  const MockBreadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>{item.label}</span>
      ))}
    </nav>
  );
  MockBreadcrumb.displayName = 'MockBreadcrumb';
  return MockBreadcrumb;
});

jest.mock('@/components/ShareButtons', () => {
  const MockShareButtons = ({ title, url }: { title: string; url: string }) => (
    <div data-testid="share-buttons" data-title={title} data-url={url}>Partager</div>
  );
  MockShareButtons.displayName = 'MockShareButtons';
  return MockShareButtons;
});

jest.mock('@/components/ArticleCard', () => {
  const MockArticleCard = ({ article }: { article: { title: string } }) => (
    <div data-testid="article-card">{article.title}</div>
  );
  MockArticleCard.displayName = 'MockArticleCard';
  return MockArticleCard;
});

// ─── Imports après mocks ──────────────────────────────────────────────────────

import { getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import ArticlePage, { generateMetadata } from '@/app/article/[slug]/page';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id:          'cat-1',
  name:        'International',
  slug:        'international',
  description: null,
  order:       1,
};

function makeArticle(overrides: Record<string, unknown> = {}) {
  return {
    id:          'art-1',
    title:       'La réforme de l\'éducation nationale',
    slug:        'reforme-education',
    excerpt:     'Le gouvernement annonce une réforme majeure.',
    content:     '<p>' + 'mot '.repeat(300) + '</p>',
    imageUrl:    'https://img.test/photo.jpg',
    imageAlt:    'Photo de la réforme',
    author:      'Marie Dupont',
    categoryId:  'cat-1',
    publishedAt: new Date('2026-03-27T09:00:00Z'),
    createdAt:   new Date('2026-03-27T09:00:00Z'),
    updatedAt:   new Date('2026-03-27T09:00:00Z'),
    readingTime: 2,
    category:    mockCategory,
    ...overrides,
  };
}

function makeRelated(n = 3) {
  return Array.from({ length: n }, (_, i) => ({
    ...makeArticle({
      id:    `art-related-${i}`,
      title: `Article lié ${i + 1}`,
      slug:  `article-lie-${i + 1}`,
    }),
  }));
}

const getArticleBySlugMock   = getArticleBySlug   as jest.Mock;
const getRelatedArticlesMock = getRelatedArticles as jest.Mock;

async function renderPage(slug = 'reforme-education') {
  const jsx = await ArticlePage({ params: Promise.resolve({ slug }) });
  return render(jsx as React.ReactElement);
}

beforeEach(() => {
  jest.clearAllMocks();
  getRelatedArticlesMock.mockResolvedValue([]);
});

// ─── Cas 404 ──────────────────────────────────────────────────────────────────

describe('ArticlePage — 404', () => {
  it('appelle notFound() si le slug n\'existe pas', async () => {
    getArticleBySlugMock.mockResolvedValue(null);
    await expect(renderPage('slug-inconnu')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});

// ─── Fil d'Ariane ─────────────────────────────────────────────────────────────

describe('ArticlePage — Breadcrumb', () => {
  it('affiche le breadcrumb avec Accueil > Rubrique > Titre', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const crumb = screen.getByTestId('breadcrumb');
    expect(crumb).toHaveTextContent('Accueil');
    expect(crumb).toHaveTextContent('International');
    expect(crumb).toHaveTextContent('La réforme de l\'éducation nationale');
  });
});

// ─── Badge rubrique ───────────────────────────────────────────────────────────

describe('ArticlePage — Badge rubrique', () => {
  it('affiche le badge rubrique en uppercase', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    // Le badge est un lien qui affiche le nom de la rubrique en uppercase (via CSS)
    const badge = screen.getByRole('link', { name: 'International' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('href', '/rubrique/international');
  });
});

// ─── Titre ────────────────────────────────────────────────────────────────────

describe('ArticlePage — Titre', () => {
  it('affiche le titre de l\'article en h1', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('La réforme de l\'éducation nationale');
  });

  it('le titre a le style serif Georgia', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });
});

// ─── Chapeau ──────────────────────────────────────────────────────────────────

describe('ArticlePage — Chapeau', () => {
  it('affiche le chapeau (excerpt)', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    expect(screen.getByText('Le gouvernement annonce une réforme majeure.')).toBeInTheDocument();
  });

  it('le chapeau a le style italic', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const excerpt = screen.getByText('Le gouvernement annonce une réforme majeure.');
    expect(excerpt.className).toContain('italic');
  });
});

// ─── Barre métadonnées ────────────────────────────────────────────────────────

describe('ArticlePage — Barre métadonnées', () => {
  it('affiche "Par {auteur}"', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    expect(screen.getByText(/Par Marie Dupont/)).toBeInTheDocument();
  });

  it('affiche la date dans une balise <time>', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const time = document.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute('dateTime', '2026-03-27T09:00:00.000Z');
  });

  it('affiche le temps de lecture', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    expect(screen.getByText(/\d+ min de lecture/)).toBeInTheDocument();
  });
});

// ─── Boutons de partage ───────────────────────────────────────────────────────

describe('ArticlePage — ShareButtons', () => {
  it('affiche le composant ShareButtons', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    expect(screen.getByTestId('share-buttons')).toBeInTheDocument();
  });

  it('passe le titre correct à ShareButtons', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const shareButtons = screen.getByTestId('share-buttons');
    expect(shareButtons).toHaveAttribute('data-title', 'La réforme de l\'éducation nationale');
  });

  it('passe l\'URL de l\'article à ShareButtons', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage('reforme-education');
    const shareButtons = screen.getByTestId('share-buttons');
    const url = shareButtons.getAttribute('data-url') ?? '';
    expect(url).toContain('/article/reforme-education');
  });
});

// ─── Image principale ─────────────────────────────────────────────────────────

describe('ArticlePage — Image principale', () => {
  it('affiche l\'image si imageUrl est défini', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://img.test/photo.jpg');
  });

  it('l\'image a l\'alt correct', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const img = document.querySelector('img');
    expect(img).toHaveAttribute('alt', 'Photo de la réforme');
  });

  it('affiche la légende (figcaption) avec imageAlt', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const figcaption = document.querySelector('figcaption');
    expect(figcaption).toBeInTheDocument();
    expect(figcaption).toHaveTextContent('Photo de la réforme');
  });

  it('N\'affiche PAS de figure si imageUrl est null', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle({ imageUrl: null }));
    await renderPage();
    expect(document.querySelector('figure')).not.toBeInTheDocument();
    expect(document.querySelector('img')).not.toBeInTheDocument();
  });

  it('affiche image sans figcaption si imageAlt est null', async () => {
    getArticleBySlugMock.mockResolvedValue(
      makeArticle({ imageAlt: null })
    );
    await renderPage();
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(document.querySelector('figcaption')).not.toBeInTheDocument();
  });
});

// ─── Contenu HTML ─────────────────────────────────────────────────────────────

describe('ArticlePage — Contenu éditorial', () => {
  it('le contenu est rendu via dangerouslySetInnerHTML', async () => {
    getArticleBySlugMock.mockResolvedValue(
      makeArticle({ content: '<p>Paragraphe de test.</p>' })
    );
    await renderPage();
    expect(screen.getByText('Paragraphe de test.')).toBeInTheDocument();
  });

  it('le conteneur du contenu a la classe article-prose', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    await renderPage();
    const prose = document.querySelector('.article-prose');
    expect(prose).toBeInTheDocument();
  });

  it('le contenu HTML malveillant est sanitisé par DOMPurify', async () => {
    const malicious = '<p>Texte</p><script>alert("xss")</script>';
    getArticleBySlugMock.mockResolvedValue(makeArticle({ content: malicious }));
    await renderPage();
    // La balise script ne doit pas être dans le DOM
    expect(document.querySelector('script')).not.toBeInTheDocument();
    // Mais le texte légitime est conservé
    expect(screen.getByText('Texte')).toBeInTheDocument();
  });

  it('les attributs onerror dans les images sont supprimés par DOMPurify', async () => {
    const malicious = '<img src="x" onerror="alert(1)" />';
    getArticleBySlugMock.mockResolvedValue(makeArticle({ content: malicious }));
    await renderPage();
    // L'attribut onerror ne doit pas subsister
    const imgs = document.querySelectorAll('.article-prose img');
    imgs.forEach((img) => {
      expect(img).not.toHaveAttribute('onerror');
    });
  });
});

// ─── Articles liés ────────────────────────────────────────────────────────────

describe('ArticlePage — Articles liés', () => {
  it('affiche la section "À lire aussi" si des articles liés existent', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    getRelatedArticlesMock.mockResolvedValue(makeRelated(3));
    await renderPage();
    expect(screen.getByText('À lire aussi')).toBeInTheDocument();
  });

  it('affiche 3 ArticleCard dans les articles liés', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    getRelatedArticlesMock.mockResolvedValue(makeRelated(3));
    await renderPage();
    const cards = screen.getAllByTestId('article-card');
    expect(cards).toHaveLength(3);
  });

  it('N\'affiche PAS la section si aucun article lié', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    getRelatedArticlesMock.mockResolvedValue([]);
    await renderPage();
    expect(screen.queryByText('À lire aussi')).not.toBeInTheDocument();
  });

  it('appelle getRelatedArticles avec le bon categoryId et le slug à exclure', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    getRelatedArticlesMock.mockResolvedValue([]);
    await renderPage('reforme-education');
    expect(getRelatedArticlesMock).toHaveBeenCalledWith('cat-1', 'reforme-education');
  });
});

// ─── SEO — generateMetadata ───────────────────────────────────────────────────

describe('generateMetadata', () => {
  it('retourne un objet vide si article introuvable', async () => {
    getArticleBySlugMock.mockResolvedValue(null);
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'inexistant' }) });
    expect(meta).toEqual({});
  });

  it('retourne le title formaté', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    expect(meta.title).toContain('La réforme de l\'éducation nationale');
    expect(meta.title).toContain('Le Monde');
  });

  it('retourne la description = excerpt', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    expect(meta.description).toBe('Le gouvernement annonce une réforme majeure.');
  });

  it('retourne openGraph.type = "article"', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    expect((meta.openGraph as Record<string, unknown>)?.type).toBe('article');
  });

  it('retourne openGraph.images avec l\'imageUrl', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    const og = meta.openGraph as Record<string, unknown>;
    const images = og?.images as Array<Record<string, string>>;
    expect(images?.[0]?.url).toBe('https://img.test/photo.jpg');
  });

  it('openGraph.images est vide si imageUrl est null', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle({ imageUrl: null }));
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    const og = meta.openGraph as Record<string, unknown>;
    expect((og?.images as unknown[])?.length ?? 0).toBe(0);
  });

  it('retourne openGraph.authors avec le nom de l\'auteur', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.authors).toContain('Marie Dupont');
  });

  it('retourne openGraph.section avec le nom de la catégorie', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'reforme-education' }) });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.section).toBe('International');
  });
});
