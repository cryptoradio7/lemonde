/**
 * Tests — lib/articles.ts
 * Couvre : getArticleBySlug, getRelatedArticles, getAllArticleSlugs, calcReadingTime (indirect)
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findUnique: jest.fn(),
      findMany:   jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  getArticleBySlug,
  getRelatedArticles,
  getAllArticleSlugs,
} from '@/lib/articles';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id:          'cat-1',
  name:        'International',
  slug:        'international',
  description: null,
  order:       1,
};

function makeDbArticle(overrides: Record<string, unknown> = {}) {
  return {
    id:          'art-1',
    title:       'Titre test',
    slug:        'titre-test',
    excerpt:     'Chapeau test.',
    content:     'mot '.repeat(200), // 200 mots → 1 min
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

const findUniqueMock = prisma.article.findUnique as jest.Mock;
const findManyMock   = prisma.article.findMany  as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getArticleBySlug ─────────────────────────────────────────────────────────

describe('getArticleBySlug', () => {
  describe('happy path', () => {
    it('retourne l\'article avec readingTime calculé', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle());
      const result = await getArticleBySlug('titre-test');
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Titre test');
      expect(result?.readingTime).toBeGreaterThanOrEqual(1);
    });

    it('appelle prisma.article.findUnique avec le bon slug', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle());
      await getArticleBySlug('mon-slug');
      expect(findUniqueMock).toHaveBeenCalledWith({
        where:   { slug: 'mon-slug' },
        include: { category: true },
      });
    });

    it('retourne la catégorie incluse', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle());
      const result = await getArticleBySlug('titre-test');
      expect(result?.category.name).toBe('International');
      expect(result?.category.slug).toBe('international');
    });
  });

  describe('slug introuvable → null', () => {
    it('retourne null si l\'article n\'existe pas', async () => {
      findUniqueMock.mockResolvedValue(null);
      const result = await getArticleBySlug('slug-inexistant');
      expect(result).toBeNull();
    });
  });

  describe('calcReadingTime (via getArticleBySlug)', () => {
    it('200 mots → 1 min de lecture', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: 'mot '.repeat(200) }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(1);
    });

    it('400 mots → 2 min de lecture', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: 'mot '.repeat(400) }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(2);
    });

    it('600 mots → 3 min de lecture', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: 'mot '.repeat(600) }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(3);
    });

    it('contenu vide → minimum 1 min', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: '' }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(1);
    });

    it('1 seul mot → 1 min', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: 'bonjour' }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(1);
    });

    it('contenu HTML → les balises sont ignorées pour le comptage', async () => {
      // 200 mots dans des balises → 1 min (les balises ne comptent pas)
      const html = '<p>' + 'mot '.repeat(200) + '</p>';
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: html }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(1);
    });

    it('balises HTML seules (pas de texte) → 1 min', async () => {
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: '<p></p><h1></h1>' }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBe(1);
    });

    it('contenu HTML malveillant → comptage correct', async () => {
      // Injection XSS dans le contenu — calcReadingTime doit fonctionner sans crash
      const malicious = '<script>alert("xss")</script>' + 'mot '.repeat(200);
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: malicious }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBeGreaterThanOrEqual(1);
    });

    it('contenu 100 000 caractères → readingTime > 0', async () => {
      const huge = 'mot '.repeat(25000); // ~25000 mots
      findUniqueMock.mockResolvedValue(makeDbArticle({ content: huge }));
      const result = await getArticleBySlug('test');
      expect(result?.readingTime).toBeGreaterThan(1);
    });
  });
});

// ─── getRelatedArticles ───────────────────────────────────────────────────────

describe('getRelatedArticles', () => {
  it('appelle findMany avec categoryId et exclut le slug courant', async () => {
    findManyMock.mockResolvedValue([]);
    await getRelatedArticles('cat-1', 'titre-test');
    expect(findManyMock).toHaveBeenCalledWith({
      where:   { categoryId: 'cat-1', slug: { not: 'titre-test' } },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take:    3,
    });
  });

  it('retourne au maximum 3 articles (limit par défaut)', async () => {
    const articles = [makeDbArticle(), makeDbArticle(), makeDbArticle()];
    findManyMock.mockResolvedValue(articles);
    const result = await getRelatedArticles('cat-1', 'autre-slug');
    expect(result).toHaveLength(3);
  });

  it('retourne tableau vide si aucun article lié', async () => {
    findManyMock.mockResolvedValue([]);
    const result = await getRelatedArticles('cat-1', 'titre-test');
    expect(result).toEqual([]);
  });

  it('limit personnalisé est transmis à prisma', async () => {
    findManyMock.mockResolvedValue([]);
    await getRelatedArticles('cat-1', 'titre-test', 5);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  it('les articles retournés ne contiennent pas le slug exclu', async () => {
    // La vérification est assurée par la clause where — on vérifie que le mock
    // reçoit bien la bonne clause d'exclusion
    findManyMock.mockResolvedValue([]);
    await getRelatedArticles('cat-abc', 'slug-exclu');
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.where.slug).toEqual({ not: 'slug-exclu' });
  });

  it('résultats triés par date décroissante', async () => {
    findManyMock.mockResolvedValue([]);
    await getRelatedArticles('cat-1', 'test');
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.orderBy).toEqual({ publishedAt: 'desc' });
  });
});

// ─── getAllArticleSlugs ───────────────────────────────────────────────────────

describe('getAllArticleSlugs', () => {
  it('retourne un tableau de slugs', async () => {
    findManyMock.mockResolvedValue([{ slug: 'art-1' }, { slug: 'art-2' }]);
    const result = await getAllArticleSlugs();
    expect(result).toEqual([{ slug: 'art-1' }, { slug: 'art-2' }]);
  });

  it('appelle findMany avec select: { slug: true }', async () => {
    findManyMock.mockResolvedValue([]);
    await getAllArticleSlugs();
    expect(findManyMock).toHaveBeenCalledWith({ select: { slug: true } });
  });

  it('retourne tableau vide si aucun article', async () => {
    findManyMock.mockResolvedValue([]);
    const result = await getAllArticleSlugs();
    expect(result).toEqual([]);
  });
});
