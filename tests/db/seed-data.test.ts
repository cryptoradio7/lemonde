/**
 * Tests de validation des données de seed (#22)
 * Vérifie que seed-data.ts respecte les critères d'acceptation de la story.
 */

import {
  CATEGORY_CONFIGS,
  ARTICLE_TEMPLATES,
  TEST_USER,
  countHtmlParagraphs,
  isUnsplashUrl,
} from "../../prisma/seed-data";

// ─── Catégories ────────────────────────────────────────────────────────────────

describe("CATEGORY_CONFIGS", () => {
  const EXPECTED_SLUGS = [
    "international",
    "politique",
    "economie",
    "societe",
    "culture",
    "sport",
    "sciences",
    "planete",
  ] as const;

  it("contient exactement 8 catégories", () => {
    expect(CATEGORY_CONFIGS).toHaveLength(8);
  });

  it("contient les 8 rubriques attendues", () => {
    const slugs = CATEGORY_CONFIGS.map((c) => c.slug);
    expect(slugs).toEqual(expect.arrayContaining(EXPECTED_SLUGS));
  });

  it("chaque catégorie a name, slug, description et order renseignés", () => {
    for (const cat of CATEGORY_CONFIGS) {
      expect(cat.name.length).toBeGreaterThan(0);
      expect(cat.slug.length).toBeGreaterThan(0);
      expect(cat.description.length).toBeGreaterThan(0);
      expect(cat.order).toBeGreaterThan(0);
    }
  });

  it("les slugs sont uniques", () => {
    const slugs = CATEGORY_CONFIGS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("les orders sont uniques et consécutifs", () => {
    const orders = CATEGORY_CONFIGS.map((c) => c.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

// ─── Articles ─────────────────────────────────────────────────────────────────

describe("ARTICLE_TEMPLATES", () => {
  it("contient au moins 30 articles", () => {
    expect(ARTICLE_TEMPLATES.length).toBeGreaterThanOrEqual(30);
  });

  it("les slugs sont uniques", () => {
    const slugs = ARTICLE_TEMPLATES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("chaque article référence une catégorie existante", () => {
    const validSlugs = new Set(CATEGORY_CONFIGS.map((c) => c.slug));
    for (const article of ARTICLE_TEMPLATES) {
      expect(validSlugs.has(article.categorySlug)).toBe(true);
    }
  });

  it("toutes les catégories ont au moins un article", () => {
    const usedSlugs = new Set(ARTICLE_TEMPLATES.map((a) => a.categorySlug));
    for (const cat of CATEGORY_CONFIGS) {
      expect(usedSlugs.has(cat.slug)).toBe(true);
    }
  });

  describe("champs obligatoires", () => {
    it("chaque article a un titre non vide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.title.trim().length).toBeGreaterThan(10);
      }
    });

    it("chaque article a un excerpt non vide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.excerpt.trim().length).toBeGreaterThan(20);
      }
    });

    it("chaque article a un contenu HTML non vide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.content.trim().length).toBeGreaterThan(100);
      }
    });

    it("chaque article a un auteur non vide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.author.trim().length).toBeGreaterThan(2);
      }
    });

    it("chaque article a une date de publication valide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.publishedAt).toBeInstanceOf(Date);
        expect(isNaN(article.publishedAt.getTime())).toBe(false);
      }
    });
  });

  describe("auteurs (critère : 5-8 noms différents)", () => {
    const uniqueAuthors = [...new Set(ARTICLE_TEMPLATES.map((a) => a.author))];

    it("le nombre d'auteurs distincts est entre 5 et 8", () => {
      expect(uniqueAuthors.length).toBeGreaterThanOrEqual(5);
      expect(uniqueAuthors.length).toBeLessThanOrEqual(8);
    });

    it("chaque auteur écrit au moins 2 articles (récurrence réaliste)", () => {
      const counts: Record<string, number> = {};
      for (const a of ARTICLE_TEMPLATES) {
        counts[a.author] = (counts[a.author] ?? 0) + 1;
      }
      for (const [author, count] of Object.entries(counts)) {
        expect(count).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("dates (critère : échelonnées sur 30 jours)", () => {
    const dates = ARTICLE_TEMPLATES.map((a) => a.publishedAt.getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    it("les articles couvrent une période d'au moins 28 jours", () => {
      const spanDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(spanDays).toBeGreaterThanOrEqual(28);
    });

    it("la date la plus récente est dans les 7 derniers jours", () => {
      const now = new Date("2026-03-27");
      const diffDays = (now.getTime() - maxDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeLessThanOrEqual(7);
    });

    it("toutes les dates sont dans le passé (≤ aujourd'hui)", () => {
      const now = new Date("2026-03-27T23:59:59");
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.publishedAt.getTime()).toBeLessThanOrEqual(now.getTime());
      }
    });
  });

  describe("contenu HTML (critère : 3-5 paragraphes)", () => {
    it("chaque article a entre 3 et 5 paragraphes <p>", () => {
      for (const article of ARTICLE_TEMPLATES) {
        const count = countHtmlParagraphs(article.content);
        expect(count).toBeGreaterThanOrEqual(3);
        expect(count).toBeLessThanOrEqual(5);
      }
    });

    it("le contenu ne contient pas de Lorem ipsum", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.content.toLowerCase()).not.toContain("lorem ipsum");
      }
    });
  });

  describe("images Unsplash", () => {
    it("chaque article a une imageUrl Unsplash valide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.imageUrl).toBeTruthy();
        expect(isUnsplashUrl(article.imageUrl ?? "")).toBe(true);
      }
    });

    it("chaque article a un imageAlt non vide", () => {
      for (const article of ARTICLE_TEMPLATES) {
        expect(article.imageAlt?.trim().length).toBeGreaterThan(3);
      }
    });
  });

  describe("tags", () => {
    it("chaque article a des tags JSON valides", () => {
      for (const article of ARTICLE_TEMPLATES) {
        let parsed: unknown;
        expect(() => { parsed = JSON.parse(article.tags); }).not.toThrow();
        expect(Array.isArray(parsed)).toBe(true);
      }
    });

    it("chaque article a au moins 2 tags", () => {
      for (const article of ARTICLE_TEMPLATES) {
        const tags = JSON.parse(article.tags) as string[];
        expect(tags.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});

// ─── Utilisateur test ─────────────────────────────────────────────────────────

describe("TEST_USER", () => {
  it("a l'email lecteur@lemonde.fr", () => {
    expect(TEST_USER.email).toBe("lecteur@lemonde.fr");
  });

  it("a le mot de passe password123", () => {
    expect(TEST_USER.password).toBe("password123");
  });

  it("a un nom non vide", () => {
    expect(TEST_USER.name.trim().length).toBeGreaterThan(0);
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

describe("countHtmlParagraphs", () => {
  it("compte correctement les balises <p>", () => {
    expect(countHtmlParagraphs("<p>Un</p><p>Deux</p><p>Trois</p>")).toBe(3);
  });

  it("retourne 0 pour un contenu sans <p>", () => {
    expect(countHtmlParagraphs("du texte brut")).toBe(0);
  });
});

describe("isUnsplashUrl", () => {
  it("valide une URL Unsplash correcte", () => {
    expect(isUnsplashUrl("https://images.unsplash.com/photo-123?w=800")).toBe(true);
  });

  it("rejette une URL non-Unsplash", () => {
    expect(isUnsplashUrl("https://example.com/photo.jpg")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isUnsplashUrl("")).toBe(false);
  });
});
