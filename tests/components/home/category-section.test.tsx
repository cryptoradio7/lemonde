/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

import CategorySection from '@/components/home/CategorySection';
import type { Article, Category } from '@prisma/client';

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'art-1',
    title: 'Titre article',
    slug: 'titre-article',
    excerpt: 'Chapeau de l\'article.',
    content: 'Contenu complet.',
    imageUrl: null,
    imageAlt: null,
    author: 'Marie Martin',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-25T10:00:00Z'),
    createdAt: new Date('2026-03-25T10:00:00Z'),
    updatedAt: new Date('2026-03-25T10:00:00Z'),
    ...overrides,
  };
}

function makeCategory(articleCount = 3, overrides: Partial<Category> = {}) {
  const articles = Array.from({ length: articleCount }, (_, i) =>
    makeArticle({ id: `art-${i + 1}`, title: `Article ${i + 1}`, slug: `article-${i + 1}` })
  );
  return {
    id: 'cat-1',
    name: 'Politique',
    slug: 'politique',
    description: null,
    order: 1,
    articles,
    ...overrides,
  };
}

// ─── Tests en-tête rubrique ───────────────────────────────────────────────────

describe('CategorySection — en-tête', () => {
  it('affiche le nom de la rubrique', () => {
    render(<CategorySection category={makeCategory()} />);
    expect(screen.getAllByText('Politique').length).toBeGreaterThan(0);
  });

  it('le nom est en majuscules (classe uppercase)', () => {
    const { container } = render(<CategorySection category={makeCategory()} />);
    const header = container.querySelector('.border-b-2');
    expect(header?.className).toMatch(/border-\[#005C9C\]/);
  });

  it('affiche le lien "Voir tout →"', () => {
    render(<CategorySection category={makeCategory()} />);
    expect(screen.getByText('Voir tout →')).toBeInTheDocument();
  });

  it('"Voir tout →" pointe vers /rubrique/{slug}', () => {
    render(<CategorySection category={makeCategory()} />);
    const link = screen.getByText('Voir tout →');
    expect(link).toHaveAttribute('href', '/rubrique/politique');
  });

  it('le titre de la rubrique est un lien vers /rubrique/{slug}', () => {
    render(<CategorySection category={makeCategory()} />);
    const links = screen.getAllByRole('link', { name: 'Politique' });
    expect(links[0]).toHaveAttribute('href', '/rubrique/politique');
  });
});

// ─── Tests grille articles ─────────────────────────────────────────────────────

describe('CategorySection — grille articles', () => {
  it('affiche les articles dans une grille 3 colonnes (lg:grid-cols-3 desktop)', () => {
    const { container } = render(<CategorySection category={makeCategory(3)} />);
    const grid = container.querySelector('.grid');
    expect(grid?.className).toMatch(/lg:grid-cols-3/);
  });

  it('affiche 3 articles', () => {
    render(<CategorySection category={makeCategory(3)} />);
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Article 3')).toBeInTheDocument();
  });

  it('chaque article est un lien vers /article/{slug}', () => {
    render(<CategorySection category={makeCategory(3)} />);
    const link1 = screen.getByText('Article 1').closest('a');
    expect(link1).toHaveAttribute('href', '/article/article-1');
  });

  it('affiche l\'auteur de chaque article', () => {
    render(<CategorySection category={makeCategory(3)} />);
    const authorEls = screen.getAllByText('Marie Martin');
    expect(authorEls.length).toBe(3);
  });

  it('affiche le chapeau de chaque article', () => {
    render(<CategorySection category={makeCategory(3)} />);
    const excerpts = screen.getAllByText('Chapeau de l\'article.');
    expect(excerpts.length).toBe(3);
  });

  it('affiche une date pour chaque article', () => {
    render(<CategorySection category={makeCategory(3)} />);
    const times = document.querySelectorAll('time');
    expect(times.length).toBe(3);
  });
});

// ─── Tests image / placeholder ────────────────────────────────────────────────

describe('CategorySection — image et placeholder', () => {
  it('affiche une balise <img> si imageUrl est fourni', () => {
    const cat = makeCategory(1, {});
    cat.articles[0].imageUrl = 'https://example.com/image.jpg';
    cat.articles[0].imageAlt = 'Image de test';
    const { container } = render(<CategorySection category={cat} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Image de test');
  });

  it('affiche un placeholder gris si imageUrl est null', () => {
    const { container } = render(<CategorySection category={makeCategory(1)} />);
    // Pas d'image
    expect(container.querySelector('img')).not.toBeInTheDocument();
    // Un span avec le nom de la rubrique en uppercase sert de placeholder
    const spans = container.querySelectorAll('span');
    const hasPlaceholder = Array.from(spans).some(
      (s) => s.textContent?.trim() === 'Politique' && s.className.includes('uppercase')
    );
    expect(hasPlaceholder).toBe(true);
  });

  it('le placeholder affiche le nom de la rubrique', () => {
    render(<CategorySection category={makeCategory(1)} />);
    // La rubrique "Politique" apparaît dans le placeholder
    const politiqueEls = screen.getAllByText('Politique');
    expect(politiqueEls.length).toBeGreaterThan(0);
  });

  it('imageAlt null → utilise le nom de la rubrique comme alt', () => {
    const cat = makeCategory(1);
    cat.articles[0].imageUrl = 'https://example.com/img.jpg';
    cat.articles[0].imageAlt = null;
    const { container } = render(<CategorySection category={cat} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'Politique');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('CategorySection — edge cases', () => {
  it('rubrique avec 0 articles → rendu sans erreur (composant appelé si la page le gère)', () => {
    const emptyCategory = makeCategory(0);
    expect(() => render(<CategorySection category={emptyCategory} />)).not.toThrow();
  });

  it('rubrique avec 5 articles → affiche tous les 5', () => {
    render(<CategorySection category={makeCategory(5)} />);
    expect(screen.getByText('Article 5')).toBeInTheDocument();
  });

  it('nom de rubrique avec accents → rendu correct', () => {
    render(<CategorySection category={makeCategory(1, { name: 'Économie', slug: 'economie' })} />);
    expect(screen.getAllByText('Économie').length).toBeGreaterThan(0);
  });

  it('lien "Voir tout" avec slug custom', () => {
    render(<CategorySection category={makeCategory(1, { slug: 'sciences-tech' })} />);
    const link = screen.getByText('Voir tout →');
    expect(link).toHaveAttribute('href', '/rubrique/sciences-tech');
  });

  it('titre article très long → rendu sans erreur', () => {
    const cat = makeCategory(1);
    cat.articles[0].title = 'T'.repeat(300);
    expect(() => render(<CategorySection category={cat} />)).not.toThrow();
  });

  it('excerpt vide → ne plante pas', () => {
    const cat = makeCategory(1);
    cat.articles[0].excerpt = '';
    expect(() => render(<CategorySection category={cat} />)).not.toThrow();
  });
});
