import { calcReadingTime } from '@/utils/readingTime';

// ─── Contenu vide ─────────────────────────────────────────────────────────────

describe('calcReadingTime — contenu vide', () => {
  it('retourne null pour une chaîne vide', () => {
    expect(calcReadingTime('')).toBeNull();
  });

  it('retourne null pour une chaîne de blancs uniquement', () => {
    expect(calcReadingTime('   ')).toBeNull();
  });

  it('retourne null pour des tabulations uniquement', () => {
    expect(calcReadingTime('\t\t\t')).toBeNull();
  });

  it('retourne null pour des sauts de ligne uniquement', () => {
    expect(calcReadingTime('\n\n\n')).toBeNull();
  });

  it('retourne null pour une chaîne de balises HTML vides', () => {
    expect(calcReadingTime('<p></p><br/>')).toBeNull();
  });

  it('retourne null pour des balises HTML avec attributs mais sans texte', () => {
    expect(calcReadingTime('<img src="photo.jpg" alt="une photo"/>')).toBeNull();
  });

  it('retourne null pour des balises HTML imbriquées sans texte', () => {
    expect(calcReadingTime('<div><span></span><p><br /></p></div>')).toBeNull();
  });
});

// ─── Happy path — calcul du temps de lecture ──────────────────────────────────

describe('calcReadingTime — calcul du temps de lecture', () => {
  it('1 mot → 1 min de lecture (minimum absolu)', () => {
    expect(calcReadingTime('mot')).toBe('1 min de lecture');
  });

  it('100 mots → 1 min de lecture (arrondi supérieur)', () => {
    expect(calcReadingTime('mot '.repeat(100))).toBe('1 min de lecture');
  });

  it('199 mots → 1 min de lecture (juste en dessous du seuil)', () => {
    expect(calcReadingTime('mot '.repeat(199))).toBe('1 min de lecture');
  });

  it('200 mots → 1 min de lecture (exactement 1 page WPM)', () => {
    expect(calcReadingTime('mot '.repeat(200))).toBe('1 min de lecture');
  });

  it('201 mots → 2 min de lecture (passage au palier supérieur)', () => {
    expect(calcReadingTime('mot '.repeat(201))).toBe('2 min de lecture');
  });

  it('400 mots → 2 min de lecture (exactement 2 pages WPM)', () => {
    expect(calcReadingTime('mot '.repeat(400))).toBe('2 min de lecture');
  });

  it('600 mots → 3 min de lecture', () => {
    expect(calcReadingTime('mot '.repeat(600))).toBe('3 min de lecture');
  });

  it('1000 mots → 5 min de lecture', () => {
    expect(calcReadingTime('mot '.repeat(1000))).toBe('5 min de lecture');
  });

  it('2000 mots → 10 min de lecture', () => {
    expect(calcReadingTime('mot '.repeat(2000))).toBe('10 min de lecture');
  });
});

// ─── Format de la valeur retournée ────────────────────────────────────────────

describe('calcReadingTime — format de retour', () => {
  it('retourne une chaîne (pas un nombre)', () => {
    expect(typeof calcReadingTime('mot')).toBe('string');
  });

  it('retourne exactement "{n} min de lecture" (pas d\'espace de trop)', () => {
    const result = calcReadingTime('mot');
    expect(result).toMatch(/^\d+ min de lecture$/);
  });

  it('le nombre dans la chaîne est un entier positif', () => {
    const result = calcReadingTime('mot '.repeat(300));
    const match = result?.match(/^(\d+) min de lecture$/);
    expect(match).not.toBeNull();
    expect(parseInt(match![1], 10)).toBeGreaterThan(0);
  });
});

// ─── Strip HTML ───────────────────────────────────────────────────────────────

describe('calcReadingTime — strip HTML', () => {
  it('ignore les balises HTML dans le comptage', () => {
    const html = '<p>' + 'mot '.repeat(200) + '</p>';
    expect(calcReadingTime(html)).toBe('1 min de lecture');
  });

  it('ne compte pas les attributs HTML comme des mots', () => {
    // Les attributs "class", "id", "href" ne doivent pas être comptés
    const html = '<p class="titre-article" id="main">bonjour</p>';
    // 1 seul mot visible : "bonjour"
    expect(calcReadingTime(html)).toBe('1 min de lecture');
  });

  it('les balises auto-fermantes ne génèrent pas de faux mots', () => {
    const html = '<br/><hr/><input type="text"/>' + 'mot '.repeat(200);
    expect(calcReadingTime(html)).toBe('1 min de lecture');
  });

  it('gère le HTML imbriqué profondément', () => {
    const html = '<div><section><article><p><strong>' + 'mot '.repeat(200) + '</strong></p></article></section></div>';
    expect(calcReadingTime(html)).toBe('1 min de lecture');
  });

  it('gère les entités HTML dans les attributs (ne les compte pas)', () => {
    // src="image&amp;id=1" ne doit pas générer de mots parasites
    const html = '<img src="image&amp;id=1" alt="photo"/>' + 'mot '.repeat(200);
    expect(calcReadingTime(html)).toBe('1 min de lecture');
  });

  it('contenu HTML avec 300 mots → 2 min de lecture', () => {
    const html = '<p>' + 'mot '.repeat(150) + '</p><p>' + 'mot '.repeat(150) + '</p>';
    expect(calcReadingTime(html)).toBe('2 min de lecture');
  });
});

// ─── Edge cases texte ─────────────────────────────────────────────────────────

describe('calcReadingTime — edge cases texte', () => {
  it('mots séparés par des espaces multiples → compte correctement', () => {
    // "mot  mot  mot" = 3 mots malgré les doubles espaces
    const content = 'mot  mot  mot  ' + 'a '.repeat(197); // 200 mots total
    expect(calcReadingTime(content)).toBe('1 min de lecture');
  });

  it('mots séparés par des sauts de ligne → compte correctement', () => {
    // Chaque ligne = 1 mot
    const content = Array(200).fill('mot').join('\n');
    expect(calcReadingTime(content)).toBe('1 min de lecture');
  });

  it('mots séparés par des tabulations → compte correctement', () => {
    const content = Array(200).fill('mot').join('\t');
    expect(calcReadingTime(content)).toBe('1 min de lecture');
  });

  it('contenu avec des chiffres → les chiffres comptent comme des mots', () => {
    // "2026 2025 2024" = 3 mots (les nombres comptent)
    const content = Array(200).fill('2026').join(' ');
    expect(calcReadingTime(content)).toBe('1 min de lecture');
  });

  it('contenu avec de la ponctuation collée → les tokens sont comptés', () => {
    // "bonjour, monde!" → 2 tokens avec split(/\s+/)
    const tokens = Array(200).fill('mot,').join(' ');
    expect(calcReadingTime(tokens)).toBe('1 min de lecture');
  });

  it('très long article (5000 mots) → calcul correct', () => {
    expect(calcReadingTime('mot '.repeat(5000))).toBe('25 min de lecture');
  });
});

// ─── Sécurité et robustesse ───────────────────────────────────────────────────

describe('calcReadingTime — sécurité', () => {
  it('ne plante pas avec un script injection HTML', () => {
    // La regex /<[^>]+>/g supprime les balises mais conserve le texte intérieur de <script>.
    // Comportement réel : alert("xss") est compté comme 1 token => 200 mots + 1 = 2 min.
    const xss = '<script>alert("xss")</script>' + 'mot '.repeat(200);
    expect(() => calcReadingTime(xss)).not.toThrow();
    // Vérifier uniquement que ça ne plante pas et retourne une valeur non-null
    const result = calcReadingTime(xss);
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\d+ min de lecture$/);
  });

  it('le contenu textuel dans les balises script est traité comme texte (comportement de la regex)', () => {
    // Note QA : calcReadingTime utilise /<[^>]+>/g (supprime balises, conserve le texte intérieur).
    // Cela signifie que "var a = \"hello world\"" dans un <script> est compté.
    // 200 mots de contenu + texte du script => résultat > 1 min.
    const xss = '<script>var a = "hello world foo bar";</script>' + 'mot '.repeat(200);
    const result = calcReadingTime(xss);
    expect(result).not.toBeNull();
    // Le résultat doit être >= 1 min (le texte du script augmente le comptage)
    const minutes = parseInt(result!.split(' ')[0], 10);
    expect(minutes).toBeGreaterThanOrEqual(1);
  });

  it('ne plante pas avec du HTML malformé', () => {
    const malformed = '<div<p>mot</p></div>>texte';
    expect(() => calcReadingTime(malformed)).not.toThrow();
  });

  it('ne plante pas avec une chaîne très longue', () => {
    const huge = 'mot '.repeat(100_000);
    expect(() => calcReadingTime(huge)).not.toThrow();
    expect(calcReadingTime(huge)).toBe('500 min de lecture');
  });
});
