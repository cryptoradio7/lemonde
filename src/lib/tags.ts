import type { Article } from '@prisma/client';

/**
 * Désérialise le champ JSON tags d'un article.
 * Retourne un tableau vide en cas d'erreur ou de valeur invalide.
 */
export function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
  } catch {
    return [];
  }
}

/**
 * Extrait les tags de tous les articles d'une rubrique, triés par fréquence décroissante.
 * Retourne les tags uniques (déduplication insensible à la casse).
 */
export function extractTagsFromArticles(articles: Pick<Article, 'tags'>[]): string[] {
  const freq = new Map<string, { label: string; count: number }>();

  for (const article of articles) {
    const tags = parseTags(article.tags);
    for (const tag of tags) {
      const key = tag.toLowerCase();
      const existing = freq.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        freq.set(key, { label: tag, count: 1 });
      }
    }
  }

  return Array.from(freq.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'))
    .map((entry) => entry.label);
}

/**
 * Filtre les articles selon un tag sélectionné.
 * La comparaison est insensible à la casse.
 */
export function filterArticlesByTag<T extends Pick<Article, 'tags'>>(
  articles: T[],
  tag: string
): T[] {
  const needle = tag.toLowerCase();
  return articles.filter((article) =>
    parseTags(article.tags).some((t) => t.toLowerCase() === needle)
  );
}
