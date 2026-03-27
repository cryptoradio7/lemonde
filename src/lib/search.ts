import { prisma } from '@/lib/prisma';

export const SEARCH_RESULTS_PER_PAGE = 12;
const MAX_QUERY_LENGTH = 200;

/**
 * Tronque la query à MAX_QUERY_LENGTH caractères après trim.
 */
export function truncateQuery(raw: string): string {
  return raw.trim().slice(0, MAX_QUERY_LENGTH);
}

/**
 * Construit la clause `where` Prisma pour la recherche.
 * - query vide → tous les articles (pas de filtre texte)
 * - rubrique vide → toutes les rubriques
 */
export function buildSearchWhere(query: string, rubrique: string) {
  return {
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
            ],
          }
        : {},
      rubrique ? { category: { slug: rubrique } } : {},
    ],
  };
}

export interface SearchResult {
  articles: Awaited<ReturnType<typeof prisma.article.findMany>>;
  total: number;
  totalPages: number;
  currentPage: number;
  query: string;
}

/**
 * Recherche paginée d'articles.
 * - rawQuery vide → tous les articles triés par date décroissante
 * - rawQuery non vide → filtre LIKE sur titre et chapeau
 * - rubrique optionnelle → filtre par slug de catégorie
 * - page → pagination DB (skip/take)
 */
export async function searchArticles(
  rawQuery: string,
  rubrique: string,
  page: number
): Promise<SearchResult> {
  const query = truncateQuery(rawQuery);
  const currentPage = Math.max(1, page);
  const where = buildSearchWhere(query, rubrique);

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      skip: (currentPage - 1) * SEARCH_RESULTS_PER_PAGE,
      take: SEARCH_RESULTS_PER_PAGE,
    }),
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / SEARCH_RESULTS_PER_PAGE),
    currentPage,
    query,
  };
}
