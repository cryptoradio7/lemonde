/**
 * Tests — lib/utils.ts
 * Couvre : slugify, formatDateShort
 */

import { slugify, formatDateShort } from '@/lib/utils';

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
