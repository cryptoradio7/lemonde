const WORDS_PER_MINUTE = 200;

/**
 * Calcule le temps de lecture estimé d'un contenu.
 * Retourne null si le contenu est vide.
 */
export function calcReadingTime(content: string): string | null {
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  return `${Math.ceil(words / WORDS_PER_MINUTE)} min de lecture`;
}
