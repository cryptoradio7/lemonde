/**
 * Tests — lib/categories.ts
 * Couvre : getCategoryBySlug, countCategoryArticles, getCategoryArticles, getAllCategorySlugs
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      findUnique: jest.fn(),
      findMany:   jest.fn(),
    },
    article: {
      count:    jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  getCategoryBySlug,
  countCategoryArticles,
  getCategoryArticles,
  getAllCategorySlugs,
  ARTICLES_PER_PAGE,
} from '@/lib/categories';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id:          'cat-pol',
  name:        'Politique',
  slug:        'politique',
  description: 'Actualité politique française',
  order:       3,
};

function makeArticle(index: number) {
  return {
    id:          `art-${index}`,
    title:       `Article ${index}`,
    slug:        `article-${index}`,
    excerpt:     `Résumé ${index}`,
    content:     'mot '.repeat(200),
    imageUrl:    null,
    imageAlt:    null,
    author:      'Auteur Test',
    categoryId:  'cat-pol',
    publishedAt: new Date(`2026-03-${String(index).padStart(2, '0')}T09:00:00Z`),
    createdAt:   new Date('2026-01-01T00:00:00Z'),
    updatedAt:   new Date('2026-01-01T00:00:00Z'),
    category:    mockCategory,
  };
}

const categoryFindUniqueMock = prisma.category.findUnique as jest.Mock;
const categoryFindManyMock   = prisma.category.findMany  as jest.Mock;
const articleCountMock       = prisma.article.count      as jest.Mock;
const articleFindManyMock    = prisma.article.findMany   as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── ARTICLES_PER_PAGE ────────────────────────────────────────────────────────

describe('ARTICLES_PER_PAGE', () => {
  it('vaut 12', () => {
    expect(ARTICLES_PER_PAGE).toBe(12);
  });
});

// ─── getCategoryBySlug ────────────────────────────────────────────────────────

describe('getCategoryBySlug', () => {
  it('retourne la catégorie si le slug existe', async () => {
    categoryFindUniqueMock.mockResolvedValue(mockCategory);
    const result = await getCategoryBySlug('politique');
    expect(result).toEqual(mockCategory);
  });

  it('appelle prisma.category.findUnique avec le bon slug', async () => {
    categoryFindUniqueMock.mockResolvedValue(mockCategory);
    await getCategoryBySlug('politique');
    expect(categoryFindUniqueMock).toHaveBeenCalledWith({ where: { slug: 'politique' } });
  });

  it('retourne null si le slug n\'existe pas', async () => {
    categoryFindUniqueMock.mockResolvedValue(null);
    const result = await getCategoryBySlug('inexistant');
    expect(result).toBeNull();
  });

  it('retourne null pour slug vide', async () => {
    categoryFindUniqueMock.mockResolvedValue(null);
    const result = await getCategoryBySlug('');
    expect(result).toBeNull();
  });
});

// ─── countCategoryArticles ────────────────────────────────────────────────────

describe('countCategoryArticles', () => {
  it('retourne le nombre d\'articles de la catégorie', async () => {
    articleCountMock.mockResolvedValue(30);
    const result = await countCategoryArticles('cat-pol');
    expect(result).toBe(30);
  });

  it('appelle prisma.article.count avec le bon categoryId', async () => {
    articleCountMock.mockResolvedValue(5);
    await countCategoryArticles('cat-pol');
    expect(articleCountMock).toHaveBeenCalledWith({ where: { categoryId: 'cat-pol' } });
  });

  it('retourne 0 si la catégorie n\'a aucun article', async () => {
    articleCountMock.mockResolvedValue(0);
    const result = await countCategoryArticles('cat-vide');
    expect(result).toBe(0);
  });
});

// ─── getCategoryArticles ──────────────────────────────────────────────────────

describe('getCategoryArticles', () => {
  it('retourne les articles de la page 1', async () => {
    const articles = Array.from({ length: 12 }, (_, i) => makeArticle(i + 1));
    articleFindManyMock.mockResolvedValue(articles);
    const result = await getCategoryArticles('cat-pol', 1);
    expect(result).toHaveLength(12);
  });

  it('appelle findMany avec skip=0 pour la page 1', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 1);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: ARTICLES_PER_PAGE })
    );
  });

  it('appelle findMany avec skip=12 pour la page 2', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 2);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 12, take: ARTICLES_PER_PAGE })
    );
  });

  it('appelle findMany avec skip=24 pour la page 3', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 3);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 24, take: ARTICLES_PER_PAGE })
    );
  });

  it('trie par publishedAt décroissant', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 1);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { publishedAt: 'desc' } })
    );
  });

  it('filtre par categoryId', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 1);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { categoryId: 'cat-pol' } })
    );
  });

  it('inclut la catégorie dans les résultats', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 1);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ include: { category: true } })
    );
  });

  it('accepte un perPage personnalisé', async () => {
    articleFindManyMock.mockResolvedValue([]);
    await getCategoryArticles('cat-pol', 1, 6);
    expect(articleFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 6 })
    );
  });

  it('retourne tableau vide si aucun article', async () => {
    articleFindManyMock.mockResolvedValue([]);
    const result = await getCategoryArticles('cat-vide', 1);
    expect(result).toEqual([]);
  });
});

// ─── getAllCategorySlugs ──────────────────────────────────────────────────────

describe('getAllCategorySlugs', () => {
  it('retourne les slugs de toutes les catégories', async () => {
    categoryFindManyMock.mockResolvedValue([
      { slug: 'politique' },
      { slug: 'international' },
      { slug: 'economie' },
    ]);
    const result = await getAllCategorySlugs();
    expect(result).toEqual([
      { slug: 'politique' },
      { slug: 'international' },
      { slug: 'economie' },
    ]);
  });

  it('appelle findMany avec select: { slug: true }', async () => {
    categoryFindManyMock.mockResolvedValue([]);
    await getAllCategorySlugs();
    expect(categoryFindManyMock).toHaveBeenCalledWith({ select: { slug: true } });
  });

  it('retourne tableau vide si aucune catégorie', async () => {
    categoryFindManyMock.mockResolvedValue([]);
    const result = await getAllCategorySlugs();
    expect(result).toEqual([]);
  });
});
