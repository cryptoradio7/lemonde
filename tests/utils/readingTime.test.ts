import { calcReadingTime } from '@/utils/readingTime';

describe('calcReadingTime', () => {
  describe('contenu vide', () => {
    it('retourne null pour une chaîne vide', () => {
      expect(calcReadingTime('')).toBeNull();
    });

    it('retourne null pour une chaîne de blancs uniquement', () => {
      expect(calcReadingTime('   ')).toBeNull();
    });

    it('retourne null pour une chaîne de balises HTML vides', () => {
      expect(calcReadingTime('<p></p><br/>')).toBeNull();
    });
  });

  describe('calcul du temps de lecture', () => {
    it('200 mots → 1 min de lecture', () => {
      expect(calcReadingTime('mot '.repeat(200))).toBe('1 min de lecture');
    });

    it('1 mot → 1 min de lecture (minimum)', () => {
      expect(calcReadingTime('mot')).toBe('1 min de lecture');
    });

    it('100 mots → 1 min de lecture (arrondi supérieur)', () => {
      expect(calcReadingTime('mot '.repeat(100))).toBe('1 min de lecture');
    });

    it('199 mots → 1 min de lecture', () => {
      expect(calcReadingTime('mot '.repeat(199))).toBe('1 min de lecture');
    });

    it('201 mots → 2 min de lecture', () => {
      expect(calcReadingTime('mot '.repeat(201))).toBe('2 min de lecture');
    });

    it('400 mots → 2 min de lecture', () => {
      expect(calcReadingTime('mot '.repeat(400))).toBe('2 min de lecture');
    });

    it('600 mots → 3 min de lecture', () => {
      expect(calcReadingTime('mot '.repeat(600))).toBe('3 min de lecture');
    });
  });

  describe('strip HTML', () => {
    it('ignore les balises HTML dans le comptage', () => {
      // 200 mots enveloppés dans des balises
      const html = '<p>' + 'mot '.repeat(200) + '</p>';
      expect(calcReadingTime(html)).toBe('1 min de lecture');
    });

    it('compte uniquement les mots visibles (pas les attributs HTML)', () => {
      const html = '<img src="photo.jpg" alt="une photo"/>';
      expect(calcReadingTime(html)).toBeNull();
    });
  });
});
