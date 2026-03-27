/**
 * Tests — Story #14 : Section "En continu"
 *
 * Couvre :
 * - formatHeure()  : formatage HH:MM depuis Date
 * - sortLiveFeed() : tri chronologique inverse + edge cases
 * - Edge case      : fil vide → aucun article retourné
 * - Edge case      : deux articles à la même heure → ordre createdAt desc
 * - Limite         : 10 articles maximum
 * - Sécurité       : XSS dans les titres
 * - getLiveFeedArticles() : appel Prisma avec bons paramètres
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  formatHeure,
  sortLiveFeed,
  getLiveFeedArticles,
  LIVE_FEED_LIMIT,
  type ArticleWithCategory,
} from '@/lib/liveFeed';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCategory = {
  id: 'cat-1',
  name: 'International',
  slug: 'international',
  description: null,
  order: 1,
};

function makeArticle(overrides: Partial<ArticleWithCategory> = {}): ArticleWithCategory {
  return {
    id: 'art-1',
    title: 'Titre test',
    slug: 'titre-test',
    excerpt: 'Chapeau test.',
    content: 'Contenu test.',
    imageUrl: null,
    imageAlt: null,
    author: 'Jean Dupont',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-27T09:00:00Z'),
    createdAt: new Date('2026-03-27T09:00:00Z'),
    updatedAt: new Date('2026-03-27T09:00:00Z'),
    category: mockCategory,
    ...overrides,
  };
}

/** Génère N articles distincts pour tester la limite. */
function makeArticles(count: number): ArticleWithCategory[] {
  return Array.from({ length: count }, (_, i) =>
    makeArticle({
      id: `art-${i + 1}`,
      slug: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      publishedAt: new Date(`2026-03-27T${String(i).padStart(2, '0')}:00:00Z`),
      createdAt: new Date(`2026-03-27T${String(i).padStart(2, '0')}:00:00Z`),
    })
  );
}

const findManyMock = prisma.article.findMany as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── formatHeure ─────────────────────────────────────────────────────────────

describe('formatHeure', () => {
  describe('format HH:MM', () => {
    it('retourne une chaîne au format HH:MM', () => {
      const result = formatHeure(new Date('2026-03-27T09:05:00'));
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('formate 09:00 correctement (zéro de tête sur les heures)', () => {
      // On teste le format plutôt que la valeur exacte (locale-dépendant)
      const result = formatHeure(new Date('2026-03-27T09:00:00'));
      expect(result).toContain(':');
      expect(result.length).toBe(5);
    });

    it('formate minuit (00:00)', () => {
      const result = formatHeure(new Date('2026-03-27T00:00:00'));
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('formate 23:59 correctement', () => {
      const result = formatHeure(new Date('2026-03-27T23:59:00'));
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('retourne une chaîne de longueur 5 (HH:MM)', () => {
      expect(formatHeure(new Date('2026-03-27T14:30:00')).length).toBe(5);
    });

    it('retourne un type string', () => {
      expect(typeof formatHeure(new Date())).toBe('string');
    });

    it('deux dates à la même heure retournent le même résultat', () => {
      const d1 = new Date('2026-03-27T10:30:00');
      const d2 = new Date('2026-03-27T10:30:00');
      expect(formatHeure(d1)).toBe(formatHeure(d2));
    });

    it('deux dates à des heures différentes retournent des résultats différents', () => {
      const d1 = new Date('2026-03-27T10:00:00');
      const d2 = new Date('2026-03-27T11:00:00');
      expect(formatHeure(d1)).not.toBe(formatHeure(d2));
    });
  });
});

// ─── sortLiveFeed ─────────────────────────────────────────────────────────────

describe('sortLiveFeed', () => {
  describe('tri chronologique inverse', () => {
    it('trie les articles du plus récent au plus ancien (publishedAt)', () => {
      const articles = [
        makeArticle({ id: 'a1', slug: 'a1', publishedAt: new Date('2026-03-27T08:00:00Z'), createdAt: new Date('2026-03-27T08:00:00Z') }),
        makeArticle({ id: 'a3', slug: 'a3', publishedAt: new Date('2026-03-27T10:00:00Z'), createdAt: new Date('2026-03-27T10:00:00Z') }),
        makeArticle({ id: 'a2', slug: 'a2', publishedAt: new Date('2026-03-27T09:00:00Z'), createdAt: new Date('2026-03-27T09:00:00Z') }),
      ];
      const result = sortLiveFeed(articles);
      expect(result[0].id).toBe('a3');
      expect(result[1].id).toBe('a2');
      expect(result[2].id).toBe('a1');
    });

    it('le premier élément est toujours le plus récent', () => {
      const articles = makeArticles(5);
      const result = sortLiveFeed(articles);
      const maxDate = Math.max(...articles.map((a) => new Date(a.publishedAt).getTime()));
      expect(new Date(result[0].publishedAt).getTime()).toBe(maxDate);
    });

    it('le dernier élément est toujours le plus ancien', () => {
      const articles = makeArticles(5);
      const result = sortLiveFeed(articles);
      const minDate = Math.min(...articles.map((a) => new Date(a.publishedAt).getTime()));
      expect(new Date(result[result.length - 1].publishedAt).getTime()).toBe(minDate);
    });

    it('ne modifie pas le tableau source (pure function)', () => {
      const articles = makeArticles(3);
      const originalOrder = articles.map((a) => a.id);
      sortLiveFeed(articles);
      expect(articles.map((a) => a.id)).toEqual(originalOrder);
    });
  });

  describe('edge case : même heure → ordre createdAt desc', () => {
    it('deux articles avec même publishedAt → celui créé en dernier apparaît en premier', () => {
      const sharedDate = new Date('2026-03-27T09:00:00Z');
      const older = makeArticle({
        id: 'older',
        slug: 'older',
        publishedAt: sharedDate,
        createdAt: new Date('2026-03-27T08:55:00Z'),
      });
      const newer = makeArticle({
        id: 'newer',
        slug: 'newer',
        publishedAt: sharedDate,
        createdAt: new Date('2026-03-27T09:05:00Z'),
      });
      const result = sortLiveFeed([older, newer]);
      expect(result[0].id).toBe('newer');
      expect(result[1].id).toBe('older');
    });

    it('trois articles à la même heure → triés par createdAt décroissant', () => {
      const sharedDate = new Date('2026-03-27T09:00:00Z');
      const a = makeArticle({ id: 'a', slug: 'a', publishedAt: sharedDate, createdAt: new Date('2026-03-27T09:00:00Z') });
      const b = makeArticle({ id: 'b', slug: 'b', publishedAt: sharedDate, createdAt: new Date('2026-03-27T09:02:00Z') });
      const c = makeArticle({ id: 'c', slug: 'c', publishedAt: sharedDate, createdAt: new Date('2026-03-27T09:01:00Z') });
      const result = sortLiveFeed([a, b, c]);
      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('c');
      expect(result[2].id).toBe('a');
    });
  });

  describe('edge case : fil vide', () => {
    it('retourne un tableau vide si l\'entrée est vide', () => {
      expect(sortLiveFeed([])).toEqual([]);
    });

    it('retourne un tableau vide si limit = 0', () => {
      const articles = makeArticles(5);
      expect(sortLiveFeed(articles, 0)).toEqual([]);
    });
  });

  describe('limite : 10 articles maximum', () => {
    it('retourne au maximum LIVE_FEED_LIMIT articles (défaut)', () => {
      const articles = makeArticles(15);
      const result = sortLiveFeed(articles);
      expect(result.length).toBeLessThanOrEqual(LIVE_FEED_LIMIT);
    });

    it('retourne exactement LIVE_FEED_LIMIT si 15 articles sont passés', () => {
      const articles = makeArticles(15);
      const result = sortLiveFeed(articles);
      expect(result.length).toBe(LIVE_FEED_LIMIT);
    });

    it('retourne tous les articles si moins de LIVE_FEED_LIMIT sont passés', () => {
      const articles = makeArticles(5);
      const result = sortLiveFeed(articles);
      expect(result.length).toBe(5);
    });

    it('limit personnalisé est respecté', () => {
      const articles = makeArticles(10);
      const result = sortLiveFeed(articles, 3);
      expect(result.length).toBe(3);
    });

    it('LIVE_FEED_LIMIT vaut 10', () => {
      expect(LIVE_FEED_LIMIT).toBe(10);
    });
  });

  describe('sécurité : XSS dans les titres', () => {
    it('un article avec titre contenant du HTML est retourné sans modification (rendu sécurisé par React)', () => {
      // sortLiveFeed ne modifie pas les données — React escapes automatiquement
      const xssArticle = makeArticle({
        id: 'xss',
        slug: 'xss',
        title: '<script>alert("xss")</script>Article légitime',
      });
      const result = sortLiveFeed([xssArticle]);
      // Le titre est conservé tel quel — c'est React qui escapes à l'affichage
      expect(result[0].title).toBe('<script>alert("xss")</script>Article légitime');
    });

    it('un article avec slug contenant des caractères spéciaux est retourné intact', () => {
      const article = makeArticle({
        id: 'special',
        slug: 'article-"><img-src=x-onerror=alert(1)>',
        title: 'Article test',
      });
      const result = sortLiveFeed([article]);
      expect(result[0].slug).toBe('article-"><img-src=x-onerror=alert(1)>');
    });

    it('un article avec excerpt XSS est retourné intact (pas de mutation côté tri)', () => {
      const article = makeArticle({
        id: 'xss2',
        slug: 'xss2',
        excerpt: '<img src=x onerror=alert(document.cookie)>',
      });
      const result = sortLiveFeed([article]);
      expect(result[0].excerpt).toBe('<img src=x onerror=alert(document.cookie)>');
    });
  });
});

// ─── getLiveFeedArticles ──────────────────────────────────────────────────────

describe('getLiveFeedArticles', () => {
  it('appelle prisma.article.findMany avec orderBy [publishedAt desc, createdAt desc]', async () => {
    findManyMock.mockResolvedValue([]);
    await getLiveFeedArticles();
    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: LIVE_FEED_LIMIT,
      include: { category: true },
    });
  });

  it('passe take: 10 à prisma', async () => {
    findManyMock.mockResolvedValue([]);
    await getLiveFeedArticles();
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.take).toBe(10);
  });

  it('inclut la catégorie', async () => {
    findManyMock.mockResolvedValue([]);
    await getLiveFeedArticles();
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.include).toEqual({ category: true });
  });

  it('retourne un tableau vide si aucun article en DB', async () => {
    findManyMock.mockResolvedValue([]);
    const result = await getLiveFeedArticles();
    expect(result).toEqual([]);
  });

  it('retourne les articles fournis par prisma', async () => {
    const articles = makeArticles(3);
    findManyMock.mockResolvedValue(articles);
    const result = await getLiveFeedArticles();
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(articles[0].id);
  });

  it('ordonne par publishedAt en premier', async () => {
    findManyMock.mockResolvedValue([]);
    await getLiveFeedArticles();
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.orderBy[0]).toEqual({ publishedAt: 'desc' });
  });

  it('ordonne par createdAt en second (départage)', async () => {
    findManyMock.mockResolvedValue([]);
    await getLiveFeedArticles();
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.orderBy[1]).toEqual({ createdAt: 'desc' });
  });
});
