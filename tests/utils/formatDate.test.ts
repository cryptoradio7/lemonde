import { formatDateFr } from '@/utils/formatDate';

describe('formatDateFr', () => {
  describe('format de base', () => {
    it('retourne la date en français long', () => {
      // 26 mars 2026 = jeudi
      const result = formatDateFr(new Date(2026, 2, 26)); // mois 0-indexé
      expect(result).toBe('jeudi 26 mars 2026');
    });

    it('retourne le jour de la semaine en minuscules', () => {
      const result = formatDateFr(new Date(2026, 2, 27));
      expect(result).toMatch(/^[a-zàâäéèêëîïôùûü]+\s/);
    });

    it('contient le nom du mois en minuscules', () => {
      const result = formatDateFr(new Date(2026, 0, 1)); // janvier
      expect(result).toContain('janvier');
    });

    it('contient l\'année sur 4 chiffres', () => {
      const result = formatDateFr(new Date(2026, 2, 27));
      expect(result).toContain('2026');
    });

    it('contient le jour numérique sans zéro de tête', () => {
      const result = formatDateFr(new Date(2026, 2, 1)); // 1er mars
      expect(result).toContain('1');
      expect(result).not.toContain('01');
    });
  });

  describe('tous les mois', () => {
    const moisFr = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ];

    moisFr.forEach((mois, index) => {
      it(`mois ${index + 1} → ${mois}`, () => {
        const result = formatDateFr(new Date(2026, index, 15));
        expect(result).toContain(mois);
      });
    });
  });

  describe('tous les jours de la semaine', () => {
    // Semaine du 23 au 29 mars 2026
    const joursFr = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const joursDate = [23, 24, 25, 26, 27, 28, 29]; // mars 2026

    joursFr.forEach((jour, i) => {
      it(`${jour} 2026-03-${joursDate[i]}`, () => {
        const result = formatDateFr(new Date(2026, 2, joursDate[i]));
        expect(result).toContain(jour);
      });
    });
  });

  describe('edge cases', () => {
    it('gère minuit correctement (pas de décalage de jour)', () => {
      const midnight = new Date(2026, 2, 27, 0, 0, 0);
      const result = formatDateFr(midnight);
      expect(result).toContain('27');
    });

    it('gère le 31 décembre', () => {
      const result = formatDateFr(new Date(2026, 11, 31));
      expect(result).toContain('décembre');
      expect(result).toContain('31');
    });

    it('gère le 1er janvier', () => {
      const result = formatDateFr(new Date(2026, 0, 1));
      expect(result).toContain('janvier');
      expect(result).toContain('2026');
    });

    it('retourne une chaîne non vide', () => {
      const result = formatDateFr(new Date());
      expect(result.length).toBeGreaterThan(0);
    });

    it('retourne une chaîne de type string', () => {
      const result = formatDateFr(new Date(2026, 2, 27));
      expect(typeof result).toBe('string');
    });
  });
});
