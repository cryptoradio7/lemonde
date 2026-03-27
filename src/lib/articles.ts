import { prisma } from '@/lib/prisma';

/**
 * Calcule le temps de lecture estimé en minutes (base : 200 mots/min).
 */
function calcReadingTime(content: string): number {
  // Retirer les balises HTML pour ne compter que les mots
  const text = content.replace(/<[^>]+>/g, ' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) return null;

  return {
    ...article,
    readingTime: calcReadingTime(article.content),
  };
}

export async function getRelatedArticles(
  categoryId: string,
  excludeSlug: string,
  limit = 3
) {
  return prisma.article.findMany({
    where: {
      categoryId,
      slug: { not: excludeSlug },
    },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  return prisma.article.findMany({ select: { slug: true } });
}
