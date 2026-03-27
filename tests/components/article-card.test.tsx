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

import ArticleCard, { type ArticleWithCategory } from '@/components/ArticleCard';

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<ArticleWithCategory> = {}): ArticleWithCategory {
  return {
    id: 'art-1',
    title: 'Titre de l\'article',
    slug: 'titre-article',
    excerpt: 'Chapeau de l\'article test.',
    content: 'Mot '.repeat(400), // ~400 mots = 2 min de lecture
    imageUrl: null,
    imageAlt: null,
    author: 'Pierre Durand',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-25T10:00:00Z'),
    createdAt: new Date('2026-03-25T10:00:00Z'),
    updatedAt: new Date('2026-03-25T10:00:00Z'),
    category: {
      id: 'cat-1',
      name: 'International',
      slug: 'international',
      description: null,
      order: 2,
    },
    ...overrides,
  };
}

// ─── Variant medium (default) ─────────────────────────────────────────────────

describe('ArticleCard — variant medium (défaut)', () => {
  it('affiche le titre', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Titre de l\'article')).toBeInTheDocument();
  });

  it('le titre est un lien vers /article/{slug}', () => {
    render(<ArticleCard article={makeArticle()} />);
    const link = screen.getByText('Titre de l\'article').closest('a');
    expect(link).toHaveAttribute('href', '/article/titre-article');
  });

  it('le titre a le style serif', () => {
    render(<ArticleCard article={makeArticle()} />);
    const title = screen.getByText('Titre de l\'article');
    expect(title).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('affiche le chapeau', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Chapeau de l\'article test.')).toBeInTheDocument();
  });

  it('affiche l\'auteur', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Pierre Durand')).toBeInTheDocument();
  });

  it('affiche la date', () => {
    render(<ArticleCard article={makeArticle()} />);
    const time = document.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute('dateTime', '2026-03-25T10:00:00.000Z');
  });

  it('affiche le temps de lecture', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText(/min de lecture/)).toBeInTheDocument();
  });

  it('affiche le nom de la rubrique en badge', () => {
    render(<ArticleCard article={makeArticle()} />);
    // Plusieurs éléments peuvent afficher 'International' (badge + placeholder)
    expect(screen.getAllByText('International').length).toBeGreaterThan(0);
  });

  it('affiche le placeholder gris si imageUrl est null', () => {
    const { container } = render(<ArticleCard article={makeArticle()} />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    // Le placeholder a un span avec le nom de la rubrique
    const spans = container.querySelectorAll('span');
    const hasPlaceholder = Array.from(spans).some(
      (s) => s.textContent?.trim() === 'International' && s.className.includes('uppercase')
    );
    expect(hasPlaceholder).toBe(true);
  });

  it('affiche une image si imageUrl est fourni', () => {
    const { container } = render(<ArticleCard article={makeArticle({ imageUrl: 'https://img.test/photo.jpg', imageAlt: 'Photo test' })} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://img.test/photo.jpg');
  });
});

// ─── Variant large ────────────────────────────────────────────────────────────

describe('ArticleCard — variant large', () => {
  it('affiche le titre', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    expect(screen.getByText('Titre de l\'article')).toBeInTheDocument();
  });

  it('le titre est un lien vers /article/{slug}', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    const link = screen.getByText('Titre de l\'article').closest('a');
    expect(link).toHaveAttribute('href', '/article/titre-article');
  });

  it('affiche l\'auteur', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    expect(screen.getByText('Pierre Durand')).toBeInTheDocument();
  });

  it('affiche la date', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    const time = document.querySelector('time');
    expect(time).toBeInTheDocument();
  });

  it('affiche le nom de la rubrique', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    expect(screen.getAllByText('International').length).toBeGreaterThan(0);
  });

  it('affiche le chapeau', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    expect(screen.getByText('Chapeau de l\'article test.')).toBeInTheDocument();
  });
});

// ─── Variant small ────────────────────────────────────────────────────────────

describe('ArticleCard — variant small', () => {
  it('affiche le titre', () => {
    render(<ArticleCard article={makeArticle()} variant="small" />);
    expect(screen.getByText('Titre de l\'article')).toBeInTheDocument();
  });

  it('le titre est un lien vers /article/{slug}', () => {
    render(<ArticleCard article={makeArticle()} variant="small" />);
    const link = screen.getByText('Titre de l\'article').closest('a');
    expect(link).toHaveAttribute('href', '/article/titre-article');
  });

  it('affiche la date', () => {
    render(<ArticleCard article={makeArticle()} variant="small" />);
    expect(document.querySelector('time')).toBeInTheDocument();
  });

  it('affiche le nom de la rubrique', () => {
    render(<ArticleCard article={makeArticle()} variant="small" />);
    expect(screen.getAllByText('International').length).toBeGreaterThan(0);
  });
});

// ─── Calcul temps de lecture ──────────────────────────────────────────────────

describe('ArticleCard — temps de lecture', () => {
  it('contenu de 200 mots → 1 min de lecture', () => {
    const article = makeArticle({ content: 'mot '.repeat(200) });
    render(<ArticleCard article={article} />);
    expect(screen.getByText('1 min de lecture')).toBeInTheDocument();
  });

  it('contenu de 400 mots → 2 min de lecture', () => {
    const article = makeArticle({ content: 'mot '.repeat(400) });
    render(<ArticleCard article={article} />);
    expect(screen.getByText('2 min de lecture')).toBeInTheDocument();
  });

  it('contenu vide → 1 min de lecture (minimum)', () => {
    const article = makeArticle({ content: '' });
    render(<ArticleCard article={article} />);
    expect(screen.getByText('1 min de lecture')).toBeInTheDocument();
  });

  it('contenu d\'un seul mot → 1 min de lecture', () => {
    const article = makeArticle({ content: 'mot' });
    render(<ArticleCard article={article} />);
    expect(screen.getByText('1 min de lecture')).toBeInTheDocument();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('ArticleCard — edge cases', () => {
  it('excerpt vide → rendu sans erreur', () => {
    expect(() => render(<ArticleCard article={makeArticle({ excerpt: '' })} />)).not.toThrow();
  });

  it('titre avec caractères spéciaux HTML → affiché correctement', () => {
    render(<ArticleCard article={makeArticle({ title: 'Article sur l\'IA & la <tech>' })} />);
    expect(screen.getByText('Article sur l\'IA & la <tech>')).toBeInTheDocument();
  });

  it('auteur avec accents → rendu correct', () => {
    render(<ArticleCard article={makeArticle({ author: 'Élodie Château-Ünter' })} />);
    expect(screen.getByText('Élodie Château-Ünter')).toBeInTheDocument();
  });

  it('imageAlt null avec imageUrl fourni → alt = nom de la rubrique', () => {
    const article = makeArticle({ imageUrl: 'https://img.test/photo.jpg', imageAlt: null });
    const { container } = render(<ArticleCard article={article} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'International');
  });

  it('slug avec tirets → lien correct', () => {
    render(<ArticleCard article={makeArticle({ slug: 'mon-article-complexe-2026' })} />);
    const link = screen.getByText('Titre de l\'article').closest('a');
    expect(link).toHaveAttribute('href', '/article/mon-article-complexe-2026');
  });
});
