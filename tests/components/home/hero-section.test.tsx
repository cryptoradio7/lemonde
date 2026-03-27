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

import HeroSection from '@/components/home/HeroSection';
import type { ArticleWithCategory } from '@/components/ArticleCard';

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<ArticleWithCategory> = {}): ArticleWithCategory {
  return {
    id: 'art-1',
    title: 'Titre de l\'article principal',
    slug: 'titre-article-principal',
    excerpt: 'Chapeau de l\'article principal en format court.',
    content: 'Contenu complet de l\'article.',
    imageUrl: null,
    imageAlt: null,
    author: 'Jean Dupont',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-25T10:00:00Z'),
    createdAt: new Date('2026-03-25T10:00:00Z'),
    updatedAt: new Date('2026-03-25T10:00:00Z'),
    category: {
      id: 'cat-1',
      name: 'Politique',
      slug: 'politique',
      description: null,
      order: 1,
    },
    ...overrides,
  };
}

function makeSidebarArticles(): ArticleWithCategory[] {
  return [
    makeArticle({ id: 'art-2', title: 'Article sidebar 1', slug: 'sidebar-1', publishedAt: new Date('2026-03-24T09:00:00Z') }),
    makeArticle({ id: 'art-3', title: 'Article sidebar 2', slug: 'sidebar-2', publishedAt: new Date('2026-03-23T08:00:00Z') }),
    makeArticle({ id: 'art-4', title: 'Article sidebar 3', slug: 'sidebar-3', publishedAt: new Date('2026-03-22T07:00:00Z') }),
  ];
}

// ─── Tests article principal ──────────────────────────────────────────────────

describe('HeroSection — article principal', () => {
  it('affiche le titre de l\'article principal', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    expect(screen.getByText('Titre de l\'article principal')).toBeInTheDocument();
  });

  it('le titre est un lien vers /article/{slug}', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const titleLink = screen.getByText('Titre de l\'article principal').closest('a');
    expect(titleLink).toHaveAttribute('href', '/article/titre-article-principal');
  });

  it('le titre a le style serif Georgia', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const title = screen.getByText('Titre de l\'article principal');
    expect(title).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('le titre a la classe font-bold', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const title = screen.getByText('Titre de l\'article principal');
    expect(title.className).toMatch(/font-bold/);
  });

  it('affiche le chapeau (excerpt)', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    expect(screen.getByText('Chapeau de l\'article principal en format court.')).toBeInTheDocument();
  });

  it('le chapeau a le style serif Georgia', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const excerpt = screen.getByText('Chapeau de l\'article principal en format court.');
    expect(excerpt).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('affiche l\'auteur', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  it('affiche la date dans un élément <time>', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const times = document.querySelectorAll('time');
    expect(times.length).toBeGreaterThan(0);
    const mainTime = times[0];
    expect(mainTime).toHaveAttribute('dateTime', '2026-03-25T10:00:00.000Z');
  });

  it('affiche le nom de la rubrique de l\'article principal', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    // La rubrique apparaît en badge dans l'article principal et dans les articles sidebar
    const politiqueEls = screen.getAllByText('Politique');
    expect(politiqueEls.length).toBeGreaterThan(0);
  });
});

// ─── Tests layout 2 colonnes ──────────────────────────────────────────────────

describe('HeroSection — layout 2 colonnes', () => {
  it('affiche une section principale et une sidebar', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  it('la colonne principale a la classe md:w-[65%]', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const mainCol = container.querySelector('.md\\:w-\\[65\\%\\]');
    expect(mainCol).toBeInTheDocument();
  });

  it('la sidebar a la classe md:w-[35%]', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toMatch(/md:w-\[35%\]/);
  });

  it('la section est dans une balise <section>', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// ─── Tests sidebar ────────────────────────────────────────────────────────────

describe('HeroSection — sidebar', () => {
  it('affiche 3 articles en sidebar', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    expect(screen.getByText('Article sidebar 1')).toBeInTheDocument();
    expect(screen.getByText('Article sidebar 2')).toBeInTheDocument();
    expect(screen.getByText('Article sidebar 3')).toBeInTheDocument();
  });

  it('chaque article sidebar est un lien vers /article/{slug}', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const link1 = screen.getByText('Article sidebar 1').closest('a');
    expect(link1).toHaveAttribute('href', '/article/sidebar-1');
    const link2 = screen.getByText('Article sidebar 2').closest('a');
    expect(link2).toHaveAttribute('href', '/article/sidebar-2');
  });

  it('les articles sidebar ont une date affichée', () => {
    render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const times = document.querySelectorAll('time');
    // 1 pour l'article principal + 3 pour la sidebar
    expect(times.length).toBe(4);
  });

  it('les articles sidebar sont séparés par des lignes <hr>', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={makeSidebarArticles()} />);
    const aside = container.querySelector('aside');
    const hrs = aside?.querySelectorAll('hr');
    // 3 articles → 2 séparateurs
    expect(hrs?.length).toBe(2);
  });

  it('sidebar avec 0 article → pas de <hr>', () => {
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={[]} />);
    const aside = container.querySelector('aside');
    const hrs = aside?.querySelectorAll('hr');
    expect(hrs?.length).toBe(0);
  });

  it('sidebar avec 1 article → pas de <hr>', () => {
    const single = [makeArticle({ id: 'art-2', slug: 'sidebar-1', title: 'Un seul article' })];
    const { container } = render(<HeroSection mainArticle={makeArticle()} sidebarArticles={single} />);
    const aside = container.querySelector('aside');
    const hrs = aside?.querySelectorAll('hr');
    expect(hrs?.length).toBe(0);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('HeroSection — edge cases', () => {
  it('excerpt vide → ne plante pas', () => {
    const article = makeArticle({ excerpt: '' });
    expect(() => render(<HeroSection mainArticle={article} sidebarArticles={makeSidebarArticles()} />)).not.toThrow();
  });

  it('titre très long → affiché sans troncature forcée dans le h1', () => {
    const longTitle = 'A'.repeat(200);
    render(<HeroSection mainArticle={makeArticle({ title: longTitle })} sidebarArticles={makeSidebarArticles()} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('sidebar vide → rendu sans erreur', () => {
    expect(() =>
      render(<HeroSection mainArticle={makeArticle()} sidebarArticles={[]} />)
    ).not.toThrow();
  });

  it('auteur avec caractères spéciaux → rendu correct', () => {
    render(<HeroSection mainArticle={makeArticle({ author: 'Élodie Ünterberg-Château' })} sidebarArticles={[]} />);
    expect(screen.getByText('Élodie Ünterberg-Château')).toBeInTheDocument();
  });
});
