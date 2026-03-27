/**
 * lib/liveFeed.ts
 * Logique métier pour la section "En continu" (fil d'actualités chronologique).
 */

import { prisma } from '@/lib/prisma';
import { formatTime } from '@/lib/utils';
import type { ArticleWithCategory } from '@/components/ArticleCard';

export type { ArticleWithCategory };

/** Nombre maximum d'articles affichés dans le fil "En continu". */
export const LIVE_FEED_LIMIT = 10;

/**
 * Alias de formatTime (utils) pour la testabilité isolée de cette feature.
 */
export const formatHeure = formatTime;

/**
 * Trie un tableau d'articles pour le fil "En continu" :
 * 1. publishedAt décroissant (le plus récent d'abord)
 * 2. En cas d'égalité sur publishedAt → createdAt décroissant
 * 3. Limite au nombre d'articles défini par LIVE_FEED_LIMIT.
 *
 * Cette fonction est pure (pas d'effet de bord) et testable unitairement.
 */
export function sortLiveFeed(
  articles: ArticleWithCategory[],
  limit = LIVE_FEED_LIMIT
): ArticleWithCategory[] {
  return [...articles]
    .sort((a, b) => {
      const diffPublished =
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (diffPublished !== 0) return diffPublished;
      // Même publishedAt → départager par createdAt décroissant
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    })
    .slice(0, limit);
}

/**
 * Récupère les articles du fil "En continu" depuis la base de données.
 * Tri délégué à Prisma pour performance ; la fonction sortLiveFeed
 * sert à valider la logique côté tests sans dépendance DB.
 */
export async function getLiveFeedArticles(): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: LIVE_FEED_LIMIT,
    include: { category: true },
  });
}
