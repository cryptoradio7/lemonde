/**
 * Tests — lib/search.ts
 * Couvre : truncateQuery, buildSearchWhere, searchArticles
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      count:    jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  truncateQuery,
  buildSearchWhere,
  searchArticles,
  SEARCH_RESULTS_PER_PAGE,
} from '@/lib/search';

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
    title:       'Titre test',
    slug:        'titre-test',
    excerpt:     'Chapeau test.',
    content:     'mot '.repeat(200),
    imageUrl:    null,
    imageAlt:    null,
    author:      'Jean Dupont',
    categoryId:  'cat-1',
    publishedAt: new Date('2026-03-27T09:00:00Z'),
    createdAt:   new Date('2026-03-27T09:00:00Z'),
    updatedAt:   new Date('2026-03-27T09:00:00Z'),
    category:    mockCategory,
    ...overrides,
  };
}

const countMock    = prisma.article.count    as jest.Mock;
const findManyMock = prisma.article.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

// ─── truncateQuery ────────────────────────────────────────────────────────────

describe('truncateQuery', () => {
  it('retourne la query inchangée si ≤ 200 caractères', () => {
    expect(truncateQuery('hello')).toBe('hello');
  });

  it('tronque à 200 caractères exactement', () => {
    const long = 'a'.repeat(250);
    expect(truncateQuery(long)).toHaveLength(200);
  });

  it('trim avant de tronquer', () => {
    expect(truncateQuery('  bonjour  ')).toBe('bonjour');
  });

  it('query vide → chaîne vide', () => {
    expect(truncateQuery('')).toBe('');
  });

  it('query exactement 200 chars → inchangée', () => {
    const exact = 'x'.repeat(200);
    expect(truncateQuery(exact)).toBe(exact);
  });

  it('query 201 chars → 200 chars', () => {
    const over = 'x'.repeat(201);
    expect(truncateQuery(over)).toHaveLength(200);
  });

  it('caractères spéciaux → conservés (Prisma gère l\'échappement)', () => {
    const special = "SELECT * FROM articles; DROP TABLE;";
    expect(truncateQuery(special)).toBe(special);
  });
});

// ─── buildSearchWhere ─────────────────────────────────────────────────────────

describe('buildSearchWhere', () => {
  it('query non vide → OR sur title et excerpt', () => {
    const where = buildSearchWhere('ukraine', '');
    expect(where.AND).toEqual(
      expect.arrayContaining([
        {
          OR: [
            { title:  { contains: 'ukraine' } },
            { excerpt: { contains: 'ukraine' } },
          ],
        },
      ])
    );
  });

  it('query vide → pas de filtre texte (objet vide dans AND)', () => {
    const where = buildSearchWhere('', '');
    expect(where.AND).toContainEqual({});
  });

  it('rubrique non vide → filtre sur category.slug', () => {
    const where = buildSearchWhere('', 'international');
    expect(where.AND).toContainEqual({ category: { slug: 'international' } });
  });

  it('rubrique vide → pas de filtre rubrique (objet vide dans AND)', () => {
    const where = buildSearchWhere('test', '');
    const rubriquePart = where.AND.filter(
      (c) => 'category' in c
    );
    expect(rubriquePart).toHaveLength(0);
  });

  it('query + rubrique → les deux filtres sont présents', () => {
    const where = buildSearchWhere('économie', 'economie');
    const hasText = where.AND.some(
      (c) => 'OR' in c
    );
    const hasRubrique = where.AND.some(
      (c) => 'category' in c
    );
    expect(hasText).toBe(true);
    expect(hasRubrique).toBe(true);
  });
});

// ─── searchArticles ───────────────────────────────────────────────────────────

describe('searchArticles', () => {
  describe('query non vide', () => {
    it('appelle count et findMany avec la where clause', async () => {
      countMock.mockResolvedValue(1);
      findManyMock.mockResolvedValue([makeArticle()]);

      await searchArticles('ukraine', '', 1);

      expect(countMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) })
      );
      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) })
      );
    });

    it('retourne les articles et le total', async () => {
      countMock.mockResolvedValue(2);
      findManyMock.mockResolvedValue([makeArticle(), makeArticle({ id: 'art-2' })]);

      const result = await searchArticles('test', '', 1);
      expect(result.total).toBe(2);
      expect(result.articles).toHaveLength(2);
    });

    it('tronque rawQuery à 200 chars et retourne la query tronquée', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      const long = 'a'.repeat(250);
      const result = await searchArticles(long, '', 1);
      expect(result.query).toHaveLength(200);
    });
  });

  describe('query vide → tous les articles', () => {
    it('ne passe pas de filtre texte (retourne tous les articles)', async () => {
      countMock.mockResolvedValue(30);
      findManyMock.mockResolvedValue([makeArticle()]);

      await searchArticles('', '', 1);

      const whereArg = findManyMock.mock.calls[0][0].where;
      const hasTextFilter = whereArg.AND.some(
        (c: Record<string, unknown>) => 'OR' in c
      );
      expect(hasTextFilter).toBe(false);
    });

    it('query vide → query retournée est chaîne vide', async () => {
      countMock.mockResolvedValue(5);
      findManyMock.mockResolvedValue([makeArticle()]);

      const result = await searchArticles('', '', 1);
      expect(result.query).toBe('');
    });
  });

  describe('pagination', () => {
    it('page 1 → skip=0, take=12', async () => {
      countMock.mockResolvedValue(30);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', '', 1);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: SEARCH_RESULTS_PER_PAGE,
        })
      );
    });

    it('page 2 → skip=12, take=12', async () => {
      countMock.mockResolvedValue(30);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', '', 2);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 12, take: 12 })
      );
    });

    it('page négative → normalisée à 1', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      const result = await searchArticles('test', '', -5);
      expect(result.currentPage).toBe(1);
    });

    it('page 0 → normalisée à 1', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      const result = await searchArticles('test', '', 0);
      expect(result.currentPage).toBe(1);
    });

    it('calcule totalPages correctement (25 résultats → 3 pages)', async () => {
      countMock.mockResolvedValue(25);
      findManyMock.mockResolvedValue([]);

      const result = await searchArticles('test', '', 1);
      expect(result.totalPages).toBe(3);
    });

    it('calcule totalPages exactement divisible (24 résultats → 2 pages)', async () => {
      countMock.mockResolvedValue(24);
      findManyMock.mockResolvedValue([]);

      const result = await searchArticles('test', '', 1);
      expect(result.totalPages).toBe(2);
    });

    it('0 résultats → totalPages = 0', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      const result = await searchArticles('introuvable', '', 1);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('filtre rubrique', () => {
    it('rubrique non vide → where contient le filtre slug', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', 'politique', 1);

      const whereArg = findManyMock.mock.calls[0][0].where;
      const hasRubrique = whereArg.AND.some(
        (c: Record<string, unknown>) => 'category' in c
      );
      expect(hasRubrique).toBe(true);
    });

    it('rubrique vide → where ne contient pas de filtre slug', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', '', 1);

      const whereArg = findManyMock.mock.calls[0][0].where;
      const hasRubrique = whereArg.AND.some(
        (c: Record<string, unknown>) => 'category' in c
      );
      expect(hasRubrique).toBe(false);
    });
  });

  describe('tri', () => {
    it('résultats triés par date décroissante', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', '', 1);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { publishedAt: 'desc' } })
      );
    });
  });

  describe('include category', () => {
    it('inclut la catégorie dans les résultats', async () => {
      countMock.mockResolvedValue(0);
      findManyMock.mockResolvedValue([]);

      await searchArticles('test', '', 1);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ include: { category: true } })
      );
    });
  });
});
