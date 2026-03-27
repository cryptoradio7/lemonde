/**
 * @jest-environment jsdom
 *
 * Tests — app/rubrique/[rubrique]/page.tsx (React Server Component)
 * Couvre : 404, normalisation slug, redirect page overflow,
 *          layout (large + grille), pagination, SEO, cas article unique, rubrique vide
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks infrastructure ─────────────────────────────────────────────────────

jest.mock('@/lib/categories', () => ({
  getCategoryBySlug:          jest.fn(),
  countCategoryArticles:      jest.fn(),
  getCategoryArticles:        jest.fn(),
  getAllCategorySlugs:         jest.fn(),
  getCategoryArticleTagsData: jest.fn(),
  ARTICLES_PER_PAGE:          12,
}));

const mockNotFound  = jest.fn(() => { throw new Error('NEXT_NOT_FOUND'); });
const mockRedirect  = jest.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`); });

jest.mock('next/navigation', () => ({
  notFound:  mockNotFound,
  redirect:  mockRedirect,
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
      {items.map((item, i) => <span key={i}>{item.label}</span>)}
    </nav>
  );
  MockBreadcrumb.displayName = 'MockBreadcrumb';
  return MockBreadcrumb;
});

jest.mock('@/components/ArticleCard', () => {
  const MockArticleCard = ({
    article,
    variant,
  }: { article: { title: string; id: string }; variant?: string }) => (
    <div data-testid="article-card" data-variant={variant}>{article.title}</div>
  );
  MockArticleCard.displayName = 'MockArticleCard';
  return MockArticleCard;
});

jest.mock('@/components/Pagination', () => {
  const MockPagination = ({
    currentPage,
    totalPages,
    baseUrl,
  }: { currentPage: number; totalPages: number; baseUrl: string }) =>
    totalPages > 1 ? (
      <nav
        data-testid="pagination"
        data-current={currentPage}
        data-total={totalPages}
        data-base={baseUrl}
      >
        Pagination
      </nav>
    ) : null;
  MockPagination.displayName = 'MockPagination';
  return MockPagination;
});

jest.mock('@/components/TagFilter', () => {
  const MockTagFilter = ({
    tags,
    activeTag,
  }: { tags: string[]; activeTag?: string }) => (
    <div data-testid="tag-filter" data-active={activeTag ?? ''}>
      {tags.map((tag) => (
        <span key={tag} data-testid="tag-badge">{tag}</span>
      ))}
    </div>
  );
  MockTagFilter.displayName = 'MockTagFilter';
  return MockTagFilter;
});

// ─── Imports après mocks ──────────────────────────────────────────────────────

import {
  getCategoryBySlug,
  countCategoryArticles,
  getCategoryArticles,
  getCategoryArticleTagsData,
} from '@/lib/categories';
import RubriquePage, { generateMetadata } from '@/app/rubrique/[rubrique]/page';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id:          'cat-pol',
  name:        'Politique',
  slug:        'politique',
  description: 'Actualité politique',
  order:       3,
};

function makeArticle(index: number, overrides: Record<string, unknown> = {}) {
  return {
    id:          `art-${index}`,
    title:       `Article politique ${index}`,
    slug:        `article-politique-${index}`,
    excerpt:     `Résumé de l'article ${index}`,
    content:     '<p>' + 'mot '.repeat(200) + '</p>',
    imageUrl:    `https://img.test/photo-${index}.jpg`,
    imageAlt:    `Photo ${index}`,
    author:      'Auteur Test',
    categoryId:  'cat-pol',
    publishedAt: new Date(`2026-03-${String(27 - index).padStart(2, '0')}T09:00:00Z`),
    createdAt:   new Date('2026-03-01T00:00:00Z'),
    updatedAt:   new Date('2026-03-01T00:00:00Z'),
    category:    mockCategory,
    ...overrides,
  };
}

function makeArticles(n: number) {
  return Array.from({ length: n }, (_, i) => makeArticle(i + 1));
}

const getCategoryBySlugMock          = getCategoryBySlug          as jest.Mock;
const countCategoryArticlesMock      = countCategoryArticles      as jest.Mock;
const getCategoryArticlesMock        = getCategoryArticles        as jest.Mock;
const getCategoryArticleTagsDataMock = getCategoryArticleTagsData as jest.Mock;

async function renderPage(
  rubrique = 'politique',
  page?: string,
  tag?: string
): Promise<ReturnType<typeof render>> {
  const jsx = await RubriquePage({
    params:       Promise.resolve({ rubrique }),
    searchParams: Promise.resolve({ page, tag }),
  });
  return render(jsx as React.ReactElement);
}

beforeEach(() => {
  jest.clearAllMocks();
  getCategoryBySlugMock.mockResolvedValue(mockCategory);
  countCategoryArticlesMock.mockResolvedValue(5);
  getCategoryArticlesMock.mockResolvedValue(makeArticles(5));
  getCategoryArticleTagsDataMock.mockResolvedValue([]);
});

// ─── 404 ──────────────────────────────────────────────────────────────────────

describe('RubriquePage — 404', () => {
  it('appelle notFound() si la rubrique n\'existe pas', async () => {
    getCategoryBySlugMock.mockResolvedValue(null);
    await expect(renderPage('inexistant')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});

// ─── Normalisation slug ───────────────────────────────────────────────────────

describe('RubriquePage — normalisation slug', () => {
  it('redirige vers le slug normalisé si le slug contient des accents', async () => {
    await expect(renderPage('soci%C3%A9t%C3%A9')).rejects.toThrow(/NEXT_REDIRECT/);
  });

  it('redirige société → societe', async () => {
    // On simule un slug déjà décodé par Next.js : "société"
    await expect(renderPage('société')).rejects.toThrow('NEXT_REDIRECT:/rubrique/societe');
    expect(mockRedirect).toHaveBeenCalledWith('/rubrique/societe');
  });

  it('ne redirige pas pour un slug déjà normalisé', async () => {
    await renderPage('politique');
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

// ─── Redirect page overflow ───────────────────────────────────────────────────

describe('RubriquePage — redirect page overflow', () => {
  it('redirige vers la dernière page si page > totalPages', async () => {
    countCategoryArticlesMock.mockResolvedValue(12); // 1 page de 12
    await expect(renderPage('politique', '5')).rejects.toThrow(
      'NEXT_REDIRECT:/rubrique/politique?page=1'
    );
    expect(mockRedirect).toHaveBeenCalledWith('/rubrique/politique?page=1');
  });

  it('ne redirige pas si page === totalPages', async () => {
    countCategoryArticlesMock.mockResolvedValue(24); // 2 pages
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', '2');
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('redirige vers dernière page pour page NaN', async () => {
    // NaN → currentPage = 1, totalPages = 1 → pas de redirect pour page=1
    countCategoryArticlesMock.mockResolvedValue(12);
    await renderPage('politique', 'abc');
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

// ─── Titre ────────────────────────────────────────────────────────────────────

describe('RubriquePage — Titre', () => {
  it('affiche le nom de la rubrique en h1', async () => {
    await renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Politique');
  });

  it('le h1 a le style serif Georgia', async () => {
    await renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('le h1 a la classe uppercase', async () => {
    await renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.className).toContain('uppercase');
  });
});

// ─── Fil d'Ariane ─────────────────────────────────────────────────────────────

describe('RubriquePage — Breadcrumb', () => {
  it('affiche Accueil et le nom de la rubrique', async () => {
    await renderPage();
    const crumb = screen.getByTestId('breadcrumb');
    expect(crumb).toHaveTextContent('Accueil');
    expect(crumb).toHaveTextContent('Politique');
  });
});

// ─── Layout articles ──────────────────────────────────────────────────────────

describe('RubriquePage — Layout articles (page 1)', () => {
  it('affiche le premier article en variant large', async () => {
    getCategoryArticlesMock.mockResolvedValue(makeArticles(5));
    await renderPage();
    const cards = screen.getAllByTestId('article-card');
    expect(cards[0]).toHaveAttribute('data-variant', 'large');
  });

  it('affiche les articles suivants en variant medium', async () => {
    getCategoryArticlesMock.mockResolvedValue(makeArticles(5));
    await renderPage();
    const cards = screen.getAllByTestId('article-card');
    // 1 large + 4 medium
    const mediumCards = cards.filter((c) => c.getAttribute('data-variant') === 'medium');
    expect(mediumCards).toHaveLength(4);
  });

  it('affiche 5 cartes au total pour 5 articles', async () => {
    getCategoryArticlesMock.mockResolvedValue(makeArticles(5));
    await renderPage();
    expect(screen.getAllByTestId('article-card')).toHaveLength(5);
  });
});

describe('RubriquePage — Layout articles (page 2)', () => {
  it('n\'affiche pas de variant large sur les pages suivantes', async () => {
    countCategoryArticlesMock.mockResolvedValue(24);
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', '2');
    const cards = screen.getAllByTestId('article-card');
    const largeCards = cards.filter((c) => c.getAttribute('data-variant') === 'large');
    expect(largeCards).toHaveLength(0);
  });

  it('affiche tous les articles en medium sur page 2', async () => {
    countCategoryArticlesMock.mockResolvedValue(24);
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', '2');
    const cards = screen.getAllByTestId('article-card');
    cards.forEach((c) => expect(c).toHaveAttribute('data-variant', 'medium'));
  });
});

// ─── Article unique ───────────────────────────────────────────────────────────

describe('RubriquePage — Article unique', () => {
  it('affiche le seul article en large, pas de grille medium', async () => {
    getCategoryArticlesMock.mockResolvedValue([makeArticle(1)]);
    await renderPage();
    const cards = screen.getAllByTestId('article-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveAttribute('data-variant', 'large');
  });
});

// ─── Rubrique vide ────────────────────────────────────────────────────────────

describe('RubriquePage — Rubrique vide', () => {
  it('affiche un message si aucun article', async () => {
    countCategoryArticlesMock.mockResolvedValue(0);
    getCategoryArticlesMock.mockResolvedValue([]);
    await renderPage();
    expect(screen.getByText(/Aucun article dans cette rubrique/)).toBeInTheDocument();
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('RubriquePage — Pagination', () => {
  it('affiche le composant Pagination si totalPages > 1', async () => {
    countCategoryArticlesMock.mockResolvedValue(24); // 2 pages
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage();
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();
    expect(pagination).toHaveAttribute('data-total', '2');
    expect(pagination).toHaveAttribute('data-base', '/rubrique/politique');
  });

  it('N\'affiche PAS la pagination si totalPages <= 1', async () => {
    countCategoryArticlesMock.mockResolvedValue(5); // < 12 → 1 page
    await renderPage();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('passe currentPage correct à Pagination', async () => {
    countCategoryArticlesMock.mockResolvedValue(36); // 3 pages
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', '2');
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-current', '2');
  });
});

// ─── Tags — Story #15 ─────────────────────────────────────────────────────────

describe('RubriquePage — Tags : section visible', () => {
  beforeEach(() => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: '["Retraites","Syndicats","Gouvernement"]' },
      { tags: '["Retraites","Élections"]' },
      { tags: '["Syndicats"]' },
    ]);
  });

  it('affiche le composant TagFilter si des tags existent', async () => {
    await renderPage();
    expect(screen.getByTestId('tag-filter')).toBeInTheDocument();
  });

  it('passe les tags triés par fréquence à TagFilter', async () => {
    await renderPage();
    const badges = screen.getAllByTestId('tag-badge');
    // Retraites (×2) et Syndicats (×2) en premier, puis Gouvernement et Élections (×1 chacun)
    expect(badges[0]).toHaveTextContent('Retraites');
    expect(badges[1]).toHaveTextContent('Syndicats');
  });

  it('ne passe pas activeTag si aucun tag n\'est sélectionné', async () => {
    await renderPage();
    const filter = screen.getByTestId('tag-filter');
    expect(filter).toHaveAttribute('data-active', '');
  });
});

describe('RubriquePage — Tags : section absente', () => {
  it('n\'affiche pas TagFilter si aucun article n\'a de tags', async () => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: '[]' },
      { tags: '[]' },
    ]);
    await renderPage();
    expect(screen.queryByTestId('tag-filter')).not.toBeInTheDocument();
  });

  it('n\'affiche pas TagFilter si la rubrique est vide', async () => {
    getCategoryArticleTagsDataMock.mockResolvedValue([]);
    countCategoryArticlesMock.mockResolvedValue(0);
    getCategoryArticlesMock.mockResolvedValue([]);
    await renderPage();
    expect(screen.queryByTestId('tag-filter')).not.toBeInTheDocument();
  });

  it('n\'affiche pas TagFilter si les tags JSON sont invalides', async () => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: 'invalid-json' },
    ]);
    await renderPage();
    expect(screen.queryByTestId('tag-filter')).not.toBeInTheDocument();
  });
});

describe('RubriquePage — Tags : filtrage actif', () => {
  beforeEach(() => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: '["Retraites","Syndicats"]' },
      { tags: '["Retraites"]' },
    ]);
  });

  it('passe l\'activeTag à TagFilter si le tag est valide', async () => {
    await renderPage('politique', undefined, 'Retraites');
    const filter = screen.getByTestId('tag-filter');
    expect(filter).toHaveAttribute('data-active', 'Retraites');
  });

  it('inclut le tag dans la baseUrl de pagination', async () => {
    countCategoryArticlesMock.mockResolvedValue(30); // 3 pages
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', undefined, 'Retraites');
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-base', '/rubrique/politique?tag=Retraites');
  });

  it('ignore un tag qui n\'existe pas dans les articles (activeTag = undefined)', async () => {
    await renderPage('politique', undefined, 'TagInexistant');
    // TagFilter toujours affiché (des tags existent)
    const filter = screen.getByTestId('tag-filter');
    // Mais activeTag est vide car 'TagInexistant' ne figure pas dans availableTags
    expect(filter).toHaveAttribute('data-active', '');
  });

  it('la pagination base n\'inclut pas de tag si le tag est invalide', async () => {
    countCategoryArticlesMock.mockResolvedValue(30);
    getCategoryArticlesMock.mockResolvedValue(makeArticles(12));
    await renderPage('politique', undefined, 'TagInexistant');
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-base', '/rubrique/politique');
  });
});

describe('RubriquePage — Tags : aucun article pour ce tag', () => {
  beforeEach(() => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: '["Retraites"]' },
    ]);
    countCategoryArticlesMock.mockResolvedValue(0);
    getCategoryArticlesMock.mockResolvedValue([]);
  });

  it('affiche le message "Aucun article pour le tag" quand le tag filtre donne 0 résultats', async () => {
    await renderPage('politique', undefined, 'Retraites');
    expect(screen.getByText(/Aucun article pour le tag « Retraites »/)).toBeInTheDocument();
  });

  it('n\'affiche pas de cartes articles', async () => {
    await renderPage('politique', undefined, 'Retraites');
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });

  it('n\'affiche pas la pagination', async () => {
    await renderPage('politique', undefined, 'Retraites');
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });
});

describe('RubriquePage — Tags : redirect conserve le tag', () => {
  beforeEach(() => {
    getCategoryArticleTagsDataMock.mockResolvedValue([
      { tags: '["Retraites"]' },
    ]);
  });

  it('conserve le tag dans le redirect de normalisation de slug', async () => {
    await expect(renderPage('société', undefined, 'Retraites')).rejects.toThrow(
      'NEXT_REDIRECT:/rubrique/societe?tag=Retraites'
    );
    expect(mockRedirect).toHaveBeenCalledWith('/rubrique/societe?tag=Retraites');
  });

  it('conserve le tag ET la page dans le redirect de normalisation', async () => {
    countCategoryArticlesMock.mockResolvedValue(24);
    await expect(renderPage('société', '2', 'Retraites')).rejects.toThrow(
      'NEXT_REDIRECT:/rubrique/societe?page=2&tag=Retraites'
    );
    expect(mockRedirect).toHaveBeenCalledWith('/rubrique/societe?page=2&tag=Retraites');
  });
});

// ─── SEO — generateMetadata ───────────────────────────────────────────────────

describe('generateMetadata', () => {
  it('retourne "Rubrique non trouvée — Le Monde" si rubrique absente', async () => {
    getCategoryBySlugMock.mockResolvedValue(null);
    const meta = await generateMetadata({ params: Promise.resolve({ rubrique: 'inexistant' }), searchParams: Promise.resolve({}) });
    expect(meta.title).toBe('Rubrique non trouvée — Le Monde');
  });

  it('retourne le title "{Rubrique} — Le Monde"', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ rubrique: 'politique' }), searchParams: Promise.resolve({}) });
    expect(meta.title).toBe('Politique — Le Monde');
  });

  it('retourne une description', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ rubrique: 'politique' }), searchParams: Promise.resolve({}) });
    expect(meta.description).toContain('Politique');
  });

  it('retourne openGraph.title', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ rubrique: 'politique' }), searchParams: Promise.resolve({}) });
    expect((meta.openGraph as Record<string, unknown>)?.title).toBe('Politique — Le Monde');
  });
});
