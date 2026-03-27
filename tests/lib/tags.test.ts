/**
 * Tests — lib/tags.ts
 * Couvre : parseTags, extractTagsFromArticles, filterArticlesByTag
 */

import { parseTags, extractTagsFromArticles, filterArticlesByTag } from '@/lib/tags';

// ─── parseTags ────────────────────────────────────────────────────────────────

describe('parseTags', () => {
  it('désérialise un tableau de tags valide', () => {
    expect(parseTags('["Politique","Élections"]')).toEqual(['Politique', 'Élections']);
  });

  it('retourne un tableau vide pour "[]"', () => {
    expect(parseTags('[]')).toEqual([]);
  });

  it('retourne un tableau vide pour JSON invalide', () => {
    expect(parseTags('not-json')).toEqual([]);
  });

  it('retourne un tableau vide pour une valeur non-tableau', () => {
    expect(parseTags('"chaîne"')).toEqual([]);
    expect(parseTags('42')).toEqual([]);
    expect(parseTags('null')).toEqual([]);
  });

  it('filtre les entrées non-chaînes du tableau', () => {
    expect(parseTags('[1, "tag", true, null]')).toEqual(['tag']);
  });

  it('filtre les chaînes vides ou espaces', () => {
    expect(parseTags('["tag", "", "  "]')).toEqual(['tag']);
  });

  it('retourne un tableau vide pour chaîne vide', () => {
    expect(parseTags('')).toEqual([]);
  });
});

// ─── extractTagsFromArticles ──────────────────────────────────────────────────

describe('extractTagsFromArticles', () => {
  it('retourne les tags uniques triés par fréquence décroissante', () => {
    const articles = [
      { tags: '["Politique","Élections","Sondages"]' },
      { tags: '["Politique","Syndicats"]' },
      { tags: '["Politique","Élections"]' },
    ];
    const result = extractTagsFromArticles(articles);
    // Politique : 3, Élections : 2, Syndicats : 1, Sondages : 1
    expect(result[0]).toBe('Politique');
    expect(result[1]).toBe('Élections');
    expect(result).toContain('Syndicats');
    expect(result).toContain('Sondages');
    expect(result).toHaveLength(4);
  });

  it('déduplique les tags insensiblement à la casse', () => {
    const articles = [
      { tags: '["Politique"]' },
      { tags: '["politique"]' },
      { tags: '["POLITIQUE"]' },
    ];
    const result = extractTagsFromArticles(articles);
    expect(result).toHaveLength(1);
  });

  it('retourne le label de la première occurrence (casse d\'origine)', () => {
    const articles = [
      { tags: '["Politique"]' },
      { tags: '["politique"]' },
    ];
    const result = extractTagsFromArticles(articles);
    expect(result[0]).toBe('Politique');
  });

  it('retourne un tableau vide si aucun article', () => {
    expect(extractTagsFromArticles([])).toEqual([]);
  });

  it('retourne un tableau vide si tous les articles ont tags="[]"', () => {
    const articles = [{ tags: '[]' }, { tags: '[]' }];
    expect(extractTagsFromArticles(articles)).toEqual([]);
  });

  it('ignore les articles avec tags JSON invalide', () => {
    const articles = [
      { tags: 'invalid' },
      { tags: '["Économie"]' },
    ];
    const result = extractTagsFromArticles(articles);
    expect(result).toEqual(['Économie']);
  });

  it('trie alphabétiquement les tags à fréquence égale', () => {
    const articles = [
      { tags: '["Zèbre","Antilope"]' },
    ];
    const result = extractTagsFromArticles(articles);
    expect(result[0]).toBe('Antilope');
    expect(result[1]).toBe('Zèbre');
  });
});

// ─── filterArticlesByTag ──────────────────────────────────────────────────────

describe('filterArticlesByTag', () => {
  const articles = [
    { id: '1', tags: '["Politique","Élections"]' },
    { id: '2', tags: '["Politique","Syndicats"]' },
    { id: '3', tags: '["Économie","BCE"]' },
    { id: '4', tags: '[]' },
  ];

  it('filtre les articles ayant le tag', () => {
    const result = filterArticlesByTag(articles, 'Politique');
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id)).toEqual(['1', '2']);
  });

  it('est insensible à la casse', () => {
    const result = filterArticlesByTag(articles, 'politique');
    expect(result).toHaveLength(2);
  });

  it('retourne un tableau vide si aucun article ne correspond', () => {
    const result = filterArticlesByTag(articles, 'Sport');
    expect(result).toEqual([]);
  });

  it('retourne un tableau vide pour articles vide', () => {
    expect(filterArticlesByTag([], 'Politique')).toEqual([]);
  });

  it('filtre correctement un tag unique', () => {
    const result = filterArticlesByTag(articles, 'BCE');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('ignore les articles avec tags invalide', () => {
    const mixed = [
      { id: 'a', tags: 'invalid' },
      { id: 'b', tags: '["Politique"]' },
    ];
    const result = filterArticlesByTag(mixed, 'Politique');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b');
  });
});
