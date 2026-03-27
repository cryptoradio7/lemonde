/**
 * Tests — SEO story #12
 * Couvre :
 *   - metadata statique de l'accueil (layout + page)
 *   - generateMetadata article (title, description, openGraph, edge case sans excerpt)
 *   - generateMetadata rubrique
 *   - generateMetadata recherche
 *   - sitemap dynamique (pages statiques + articles + rubriques)
 *   - robots.txt
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/articles', () => ({
  getArticleBySlug: jest.fn(),
}));

jest.mock('@/lib/categories', () => ({
  getCategoryBySlug: jest.fn(),
  getAllCategorySlugs: jest.fn(),
  countCategoryArticles: jest.fn(),
  getCategoryArticles: jest.fn(),
  ARTICLES_PER_PAGE: 12,
}));

jest.mock('@/lib/search', () => ({
  searchArticles: jest.fn(),
  truncateQuery: jest.fn((q: string) => q.slice(0, 100)),
}));

// ─── Imports après mocks ──────────────────────────────────────────────────────

import { prisma } from '@/lib/prisma';
import { getArticleBySlug } from '@/lib/articles';
import { getCategoryBySlug } from '@/lib/categories';
import { generateMetadata as articleGenerateMetadata } from '@/app/article/[slug]/page';
import { generateMetadata as rubriqueGenerateMetadata } from '@/app/rubrique/[rubrique]/page';
import { generateMetadata as rechercheGenerateMetadata } from '@/app/recherche/page';
import { metadata as homeMetadata } from '@/app/page';
import sitemapFn from '@/app/sitemap';
import robotsFn from '@/app/robots';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id: 'cat-1',
  name: 'Politique',
  slug: 'politique',
  description: 'Actualité politique',
  order: 1,
};

function makeArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: 'art-1',
    title: 'La réforme de l\'éducation nationale',
    slug: 'reforme-education',
    excerpt: 'Le gouvernement annonce une réforme majeure.',
    content: '<p>' + 'mot '.repeat(300) + '</p>',
    imageUrl: 'https://img.test/photo.jpg',
    imageAlt: 'Photo de la réforme',
    author: 'Marie Dupont',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-27T09:00:00Z'),
    createdAt: new Date('2026-03-27T09:00:00Z'),
    updatedAt: new Date('2026-03-27T09:00:00Z'),
    readingTime: 2,
    category: mockCategory,
    ...overrides,
  };
}

const getArticleBySlugMock = getArticleBySlug as jest.Mock;
const getCategoryBySlugMock = getCategoryBySlug as jest.Mock;
const prismaArticleFindManyMock = (prisma.article.findMany as jest.Mock);
const prismaCategoryFindManyMock = (prisma.category.findMany as jest.Mock);

beforeEach(() => {
  jest.clearAllMocks();
  getCategoryBySlugMock.mockResolvedValue(mockCategory);
});

// ─── Accueil — metadata statique ─────────────────────────────────────────────

describe('Accueil — metadata statique', () => {
  it('a le title attendu', () => {
    expect(homeMetadata.title).toBe(
      'Le Monde.fr \u2014 Actualit\u00e9s et Infos en France et dans le monde'
    );
  });

  it('a une description non vide', () => {
    expect(typeof homeMetadata.description).toBe('string');
    expect((homeMetadata.description ?? '').length).toBeGreaterThan(10);
  });
});

// ─── Article — generateMetadata ───────────────────────────────────────────────

describe('Article — generateMetadata', () => {
  it('retourne {} si article introuvable', async () => {
    getArticleBySlugMock.mockResolvedValue(null);
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'inexistant' }),
    });
    expect(meta).toEqual({});
  });

  it('retourne le title "{titre} — Le Monde"', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    expect(meta.title).toContain('La réforme de l\'éducation nationale');
    expect(meta.title).toContain('Le Monde');
  });

  it('retourne la description = excerpt', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    expect(meta.description).toBe('Le gouvernement annonce une réforme majeure.');
  });

  it('edge case — description = 160 premiers chars du contenu si excerpt vide', async () => {
    const content = '<p>' + 'A'.repeat(200) + '</p>';
    getArticleBySlugMock.mockResolvedValue(
      makeArticle({ excerpt: '', content })
    );
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    // La description doit être <= 160 chars et contenir du texte du contenu (sans balises HTML)
    expect(meta.description).toBeDefined();
    expect((meta.description ?? '').length).toBeLessThanOrEqual(160);
    expect(meta.description).toContain('A');
  });

  it('edge case — description issues du contenu si excerpt est null', async () => {
    const content = '<p>Contenu de secours pour la description SEO.</p>';
    getArticleBySlugMock.mockResolvedValue(
      makeArticle({ excerpt: null, content })
    );
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    expect(meta.description).toContain('Contenu de secours');
  });

  it('retourne openGraph.type = "article"', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.type).toBe('article');
  });

  it('retourne openGraph.images avec imageUrl', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    const og = meta.openGraph as Record<string, unknown>;
    const images = og?.images as Array<Record<string, string>>;
    expect(images?.[0]?.url).toBe('https://img.test/photo.jpg');
  });

  it('openGraph.images est vide si imageUrl est null', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle({ imageUrl: null }));
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect((og?.images as unknown[])?.length ?? 0).toBe(0);
  });

  it('retourne openGraph.section = nom de la catégorie', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.section).toBe('Politique');
  });

  it('retourne openGraph.authors avec le nom de l\'auteur', async () => {
    getArticleBySlugMock.mockResolvedValue(makeArticle());
    const meta = await articleGenerateMetadata({
      params: Promise.resolve({ slug: 'reforme-education' }),
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.authors).toContain('Marie Dupont');
  });
});

// ─── Rubrique — generateMetadata ─────────────────────────────────────────────

describe('Rubrique — generateMetadata', () => {
  it('retourne "Rubrique non trouvée — Le Monde" si catégorie absente', async () => {
    getCategoryBySlugMock.mockResolvedValue(null);
    const meta = await rubriqueGenerateMetadata({
      params: Promise.resolve({ rubrique: 'inexistant' }),
      searchParams: Promise.resolve({}),
    });
    expect(meta.title).toBe('Rubrique non trouvée — Le Monde');
  });

  it('retourne le title "{Rubrique} — Le Monde"', async () => {
    const meta = await rubriqueGenerateMetadata({
      params: Promise.resolve({ rubrique: 'politique' }),
      searchParams: Promise.resolve({}),
    });
    expect(meta.title).toBe('Politique — Le Monde');
  });

  it('retourne une description contenant le nom de la rubrique', async () => {
    const meta = await rubriqueGenerateMetadata({
      params: Promise.resolve({ rubrique: 'politique' }),
      searchParams: Promise.resolve({}),
    });
    expect(meta.description).toContain('Politique');
  });

  it('retourne openGraph.title', async () => {
    const meta = await rubriqueGenerateMetadata({
      params: Promise.resolve({ rubrique: 'politique' }),
      searchParams: Promise.resolve({}),
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og?.title).toBe('Politique — Le Monde');
  });
});

// ─── Recherche — generateMetadata ────────────────────────────────────────────

describe('Recherche — generateMetadata', () => {
  it('retourne "Recherche — Le Monde" sans query', async () => {
    const meta = await rechercheGenerateMetadata({
      searchParams: Promise.resolve({}),
    });
    expect(meta.title).toContain('Recherche');
    expect(String(meta.title)).toContain('Le Monde');
  });

  it('inclut la query dans le title si présente', async () => {
    const meta = await rechercheGenerateMetadata({
      searchParams: Promise.resolve({ q: 'réforme' }),
    });
    expect(String(meta.title)).toContain('réforme');
  });
});

// ─── Sitemap ──────────────────────────────────────────────────────────────────

describe('Sitemap', () => {
  beforeEach(() => {
    prismaArticleFindManyMock.mockResolvedValue([
      { slug: 'article-1', updatedAt: new Date('2026-03-20') },
      { slug: 'article-2', updatedAt: new Date('2026-03-21') },
    ]);
    prismaCategoryFindManyMock.mockResolvedValue([
      { slug: 'politique' },
      { slug: 'culture' },
    ]);
  });

  it('retourne un tableau non vide', async () => {
    const result = await sitemapFn();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('inclut la page d\'accueil', async () => {
    const result = await sitemapFn();
    const urls = result.map((r) => r.url);
    expect(urls.some((u) => u === 'http://localhost:3000' || u.endsWith('/'))).toBe(true);
  });

  it('inclut la page recherche', async () => {
    const result = await sitemapFn();
    const urls = result.map((r) => r.url);
    expect(urls.some((u) => u.includes('/recherche'))).toBe(true);
  });

  it('inclut les URLs des articles', async () => {
    const result = await sitemapFn();
    const urls = result.map((r) => r.url);
    expect(urls.some((u) => u.includes('/article/article-1'))).toBe(true);
    expect(urls.some((u) => u.includes('/article/article-2'))).toBe(true);
  });

  it('inclut les URLs des rubriques', async () => {
    const result = await sitemapFn();
    const urls = result.map((r) => r.url);
    expect(urls.some((u) => u.includes('/rubrique/politique'))).toBe(true);
    expect(urls.some((u) => u.includes('/rubrique/culture'))).toBe(true);
  });

  it('chaque entrée a une url, lastModified, changeFrequency et priority', async () => {
    const result = await sitemapFn();
    result.forEach((entry) => {
      expect(entry.url).toBeTruthy();
      expect(entry.lastModified).toBeDefined();
      expect(entry.changeFrequency).toBeDefined();
      expect(entry.priority).toBeDefined();
    });
  });

  it('la page d\'accueil a la priority 1 (la plus haute)', async () => {
    const result = await sitemapFn();
    const home = result.find(
      (r) => r.url === 'http://localhost:3000' || r.url === 'http://localhost:3000/'
    );
    expect(home?.priority).toBe(1);
  });

  it('les articles ont une priority >= 0.5', async () => {
    const result = await sitemapFn();
    const articleEntries = result.filter((r) => r.url.includes('/article/'));
    articleEntries.forEach((entry) => {
      expect(entry.priority).toBeGreaterThanOrEqual(0.5);
    });
  });
});

// ─── Robots.txt ───────────────────────────────────────────────────────────────

describe('Robots.txt', () => {
  it('retourne un objet avec rules et sitemap', () => {
    const result = robotsFn();
    expect(result).toHaveProperty('rules');
    expect(result).toHaveProperty('sitemap');
  });

  it('autorise tous les crawlers sur "/"', () => {
    const result = robotsFn();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
  });

  it('pointe le sitemap vers /sitemap.xml', () => {
    const result = robotsFn();
    const sitemapUrl = Array.isArray(result.sitemap)
      ? result.sitemap[0]
      : result.sitemap;
    expect(String(sitemapUrl)).toContain('/sitemap.xml');
  });

  it('ne comporte pas de disallow bloquant tout', () => {
    const result = robotsFn();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    // disallow ne doit pas être "/"
    expect((rules as Record<string, unknown>).disallow).not.toBe('/');
  });
});
