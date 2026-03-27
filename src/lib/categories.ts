import { prisma } from '@/lib/prisma';

export const ARTICLES_PER_PAGE = 12;

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function countCategoryArticles(categoryId: string): Promise<number> {
  return prisma.article.count({ where: { categoryId } });
}

export async function getCategoryArticles(
  categoryId: string,
  page: number,
  perPage: number = ARTICLES_PER_PAGE
) {
  return prisma.article.findMany({
    where: { categoryId },
    orderBy: { publishedAt: 'desc' },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { category: true },
  });
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return prisma.category.findMany({ select: { slug: true } });
}
