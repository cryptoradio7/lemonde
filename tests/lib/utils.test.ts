/**
 * Tests — lib/utils.ts
 * Couvre : slugify, formatDateShort
 */

import { slugify, formatDateShort, formatRelativeDate } from '@/lib/utils';

// ─── formatRelativeDate ───────────────────────────────────────────────────────

describe('formatRelativeDate', () => {
  const NOW = new Date('2026-03-27T12:00:00Z').getTime();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('happy path', () => {
    it('< 1 min → "À l\'instant"', () => {
      const date = new Date(NOW - 30 * 1000);
      expect(formatRelativeDate(date)).toBe('À l\'instant');
    });

    it('exactement 0ms → "À l\'instant"', () => {
      const date = new Date(NOW);
      expect(formatRelativeDate(date)).toBe('À l\'instant');
    });

    it('5 minutes → "Il y a 5 min"', () => {
      const date = new Date(NOW - 5 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 5 min');
    });

    it('59 minutes → "Il y a 59 min"', () => {
      const date = new Date(NOW - 59 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 59 min');
    });

    it('1 heure → "Il y a 1h"', () => {
      const date = new Date(NOW - 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 1h');
    });

    it('3 heures → "Il y a 3h"', () => {
      const date = new Date(NOW - 3 * 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 3h');
    });

    it('23 heures → "Il y a 23h"', () => {
      const date = new Date(NOW - 23 * 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 23h');
    });

    it('1 jour → "Il y a 1 jours"', () => {
      const date = new Date(NOW - 24 * 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 1 jours');
    });

    it('3 jours → "Il y a 3 jours"', () => {
      const date = new Date(NOW - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 3 jours');
    });

    it('6 jours → "Il y a 6 jours"', () => {
      const date = new Date(NOW - 6 * 24 * 60 * 60 * 1000);
      expect(formatRelativeDate(date)).toBe('Il y a 6 jours');
    });

    it('7 jours → date absolue', () => {
      const date = new Date(NOW - 7 * 24 * 60 * 60 * 1000);
      const result = formatRelativeDate(date);
      expect(result).toContain('mars');
      expect(result).toContain('2026');
    });

    it('> 7 jours → date absolue avec mois en français', () => {
      const date = new Date(NOW - 30 * 24 * 60 * 60 * 1000);
      const result = formatRelativeDate(date);
      expect(result).toMatch(/\d+ [\w\u00C0-\u024F]+ \d{4}/);
      expect(result).not.toMatch(/Il y a/);
    });
  });

  describe('edge cases', () => {
    it('date dans le futur → date absolue', () => {
      const date = new Date(NOW + 60 * 60 * 1000);
      const result = formatRelativeDate(date);
      expect(result).not.toMatch(/Il y a/);
      expect(result).not.toBe('À l\'instant');
      expect(result).toContain('2026');
    });

    it('date très ancienne → date absolue', () => {
      const date = new Date('2020-01-01T00:00:00Z');
      const result = formatRelativeDate(date);
      expect(result).toContain('2020');
      expect(result).toContain('janvier');
    });
  });
});

// ─── slugify ─────────────────────────────────────────────────────────────────

describe('slugify', () => {
  describe('happy path', () => {
    it('convertit en minuscules', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('remplace les espaces par des tirets', () => {
      expect(slugify('Le Monde Diplomatique')).toBe('le-monde-diplomatique');
    });

    it('supprime les accents', () => {
      expect(slugify('Économie')).toBe('economie');
    });

    it('supprime les accents complexes', () => {
      expect(slugify('Île-de-France')).toBe('ile-de-france');
    });

    it('gère les caractères spéciaux', () => {
      expect(slugify("L'art & la science")).toBe('l-art-la-science');
    });

    it('conserve les tirets existants', () => {
      expect(slugify('hello-world')).toBe('hello-world');
    });

    it('conserve les chiffres', () => {
      expect(slugify('Article 2026')).toBe('article-2026');
    });
  });

  describe('edge cases', () => {
    it('chaîne vide → chaîne vide', () => {
      expect(slugify('')).toBe('');
    });

    it('supprime les tirets en début et fin', () => {
      // Les espaces aux extrémités deviennent des tirets puis sont supprimés
      expect(slugify('  bonjour  ')).toBe('bonjour');
    });

    it('collapse les séparateurs multiples', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('supprime les balises HTML-like', () => {
      expect(slugify('<script>alert</script>')).toBe('script-alert-script');
    });

    it('supprime les emoji (non-alphanumériques)', () => {
      expect(slugify('test 🎉 article')).toBe('test-article');
    });

    it('slug déjà correct → inchangé', () => {
      expect(slugify('mon-article-test-2026')).toBe('mon-article-test-2026');
    });

    it('accents sur voyelles communes', () => {
      const result = slugify('éèê àâ îï ôù û');
      expect(result).toMatch(/^[a-z0-9-]+$/);
      expect(result).not.toMatch(/[àâäéèêëîïôùûü]/);
    });
  });
});

// ─── formatDateShort ─────────────────────────────────────────────────────────

describe('formatDateShort', () => {
  describe('format de base', () => {
    it('retourne une chaîne non vide', () => {
      expect(formatDateShort(new Date(2026, 2, 27)).length).toBeGreaterThan(0);
    });

    it('retourne une chaîne', () => {
      expect(typeof formatDateShort(new Date(2026, 2, 27))).toBe('string');
    });

    it('contient l\'année', () => {
      expect(formatDateShort(new Date(2026, 2, 27))).toContain('2026');
    });

    it('contient le mois en français', () => {
      expect(formatDateShort(new Date(2026, 2, 27))).toContain('mars');
    });

    it('contient le jour numérique', () => {
      expect(formatDateShort(new Date(2026, 2, 27))).toContain('27');
    });

    it('N\'inclut PAS le jour de la semaine (format court)', () => {
      const result = formatDateShort(new Date(2026, 2, 27)); // vendredi
      expect(result).not.toContain('vendredi');
    });
  });

  describe('tous les mois', () => {
    const moisFr = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ];

    moisFr.forEach((mois, index) => {
      it(`mois ${index + 1} → ${mois}`, () => {
        expect(formatDateShort(new Date(2026, index, 15))).toContain(mois);
      });
    });
  });

  describe('edge cases', () => {
    it('1er janvier', () => {
      const result = formatDateShort(new Date(2026, 0, 1));
      expect(result).toContain('janvier');
      expect(result).toContain('2026');
    });

    it('31 décembre', () => {
      const result = formatDateShort(new Date(2026, 11, 31));
      expect(result).toContain('décembre');
      expect(result).toContain('31');
    });

    it('jour 1 sans zéro de tête', () => {
      const result = formatDateShort(new Date(2026, 2, 1));
      expect(result).toContain('1');
      // Pas de "01" dans un format jour numérique fr
      expect(result).not.toMatch(/\b01\b/);
    });
  });
});
