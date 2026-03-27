import { prisma } from '@/lib/prisma';
import { filterArticlesByTag } from '@/lib/tags';

export const ARTICLES_PER_PAGE = 12;

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function countCategoryArticles(
  categoryId: string,
  tag?: string
): Promise<number> {
  if (!tag) {
    return prisma.article.count({ where: { categoryId } });
  }
  // SQLite : filtrage JSON via LIKE (le tag est sérialisé dans le champ JSON)
  const articles = await prisma.article.findMany({
    where: { categoryId },
    select: { tags: true },
  });
  return filterArticlesByTag(articles, tag).length;
}

export async function getCategoryArticles(
  categoryId: string,
  page: number,
  perPage: number = ARTICLES_PER_PAGE,
  tag?: string
) {
  if (!tag) {
    return prisma.article.findMany({
      where: { categoryId },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    });
  }

  // Avec filtre tag : on charge tous les articles de la catégorie puis on filtre en mémoire
  // (SQLite ne supporte pas les requêtes JSON natives — acceptable pour de petits volumes)
  const all = await prisma.article.findMany({
    where: { categoryId },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
  const filtered = filterArticlesByTag(all, tag);
  return filtered.slice((page - 1) * perPage, page * perPage);
}

/**
 * Retourne tous les articles d'une catégorie (uniquement les champs nécessaires aux tags).
 * Utilisé pour extraire les tags disponibles dans la rubrique.
 */
export async function getCategoryArticleTagsData(
  categoryId: string
): Promise<{ tags: string }[]> {
  return prisma.article.findMany({
    where: { categoryId },
    select: { tags: true },
  });
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return prisma.category.findMany({ select: { slug: true } });
}
