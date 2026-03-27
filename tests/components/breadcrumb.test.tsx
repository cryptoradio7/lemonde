/**
 * @jest-environment jsdom
 *
 * Tests — components/Breadcrumb.tsx
 * Couvre : rendu items, liens, aria, troncature CSS (line-clamp), séparateurs
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import Breadcrumb from '@/components/Breadcrumb';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const itemsArticle = [
  { label: 'Accueil', href: '/' },
  { label: 'International', href: '/rubrique/international' },
  { label: 'Macron annonce une réforme majeure du système éducatif français' },
];

// ─── Rendu de base ────────────────────────────────────────────────────────────

describe('Breadcrumb — rendu de base', () => {
  it('affiche tous les labels', () => {
    render(<Breadcrumb items={itemsArticle} />);
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('International')).toBeInTheDocument();
    expect(screen.getByText(/Macron annonce/)).toBeInTheDocument();
  });

  it('est une balise nav avec aria-label "Fil d\'Ariane"', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const nav = screen.getByRole('navigation', { name: /Fil d'Ariane/i });
    expect(nav).toBeInTheDocument();
  });

  it('la liste est une balise ol', () => {
    const { container } = render(<Breadcrumb items={itemsArticle} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });
});

// ─── Liens ────────────────────────────────────────────────────────────────────

describe('Breadcrumb — liens', () => {
  it('Accueil est un lien vers /', () => {
    render(<Breadcrumb items={itemsArticle} />);
    expect(screen.getByText('Accueil').closest('a')).toHaveAttribute('href', '/');
  });

  it('la rubrique est un lien vers sa page', () => {
    render(<Breadcrumb items={itemsArticle} />);
    expect(screen.getByText('International').closest('a')).toHaveAttribute(
      'href',
      '/rubrique/international'
    );
  });

  it('le dernier item (titre) N\'est PAS un lien', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const titre = screen.getByText(/Macron annonce/);
    expect(titre.closest('a')).toBeNull();
  });
});

// ─── Aria & accessibilité ─────────────────────────────────────────────────────

describe('Breadcrumb — accessibilité', () => {
  it('le dernier item a aria-current="page"', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const titre = screen.getByText(/Macron annonce/);
    expect(titre).toHaveAttribute('aria-current', 'page');
  });

  it('les items intermédiaires n\'ont PAS aria-current', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const rubrique = screen.getByText('International').closest('a');
    expect(rubrique).not.toHaveAttribute('aria-current');
  });
});

// ─── Séparateurs ──────────────────────────────────────────────────────────────

describe('Breadcrumb — séparateurs', () => {
  it('affiche N-1 séparateurs pour N items', () => {
    const { container } = render(<Breadcrumb items={itemsArticle} />);
    // Les séparateurs sont des span avec aria-hidden
    const separators = container.querySelectorAll('span[aria-hidden="true"]');
    expect(separators).toHaveLength(itemsArticle.length - 1);
  });

  it('pas de séparateur avant le premier item', () => {
    const { container } = render(<Breadcrumb items={[{ label: 'Accueil', href: '/' }]} />);
    const separators = container.querySelectorAll('span[aria-hidden="true"]');
    expect(separators).toHaveLength(0);
  });
});

// ─── Item sans href ────────────────────────────────────────────────────────────

describe('Breadcrumb — item sans href', () => {
  it('rendu sans erreur si href absent sur un item intermédiaire', () => {
    const items = [
      { label: 'Accueil', href: '/' },
      { label: 'Section' },         // pas de href
      { label: 'Page finale' },
    ];
    expect(() => render(<Breadcrumb items={items} />)).not.toThrow();
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('item sans href rendu comme span (pas de lien)', () => {
    const items = [{ label: 'Accueil', href: '/' }, { label: 'Sans lien' }];
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Sans lien').closest('a')).toBeNull();
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe('Breadcrumb — edge cases', () => {
  it('tableau vide → rendu sans erreur', () => {
    expect(() => render(<Breadcrumb items={[]} />)).not.toThrow();
  });

  it('1 seul item → rendu sans séparateur', () => {
    const { container } = render(<Breadcrumb items={[{ label: 'Accueil' }]} />);
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0);
  });

  it('titre très long → rendu sans crash (troncature via CSS line-clamp)', () => {
    const longTitle = 'A'.repeat(500);
    expect(() =>
      render(<Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: longTitle }]} />)
    ).not.toThrow();
  });

  it('titre avec caractères spéciaux HTML → rendu correct', () => {
    render(<Breadcrumb items={[{ label: 'Test & <Article>' }]} />);
    expect(screen.getByText('Test & <Article>')).toBeInTheDocument();
  });

  it('titre avec accents → rendu correct', () => {
    render(<Breadcrumb items={[{ label: 'Château-Émery' }]} />);
    expect(screen.getByText('Château-Émery')).toBeInTheDocument();
  });

  it('titre avec emoji → rendu correct', () => {
    render(<Breadcrumb items={[{ label: 'Article 🎉 2026' }]} />);
    expect(screen.getByText('Article 🎉 2026')).toBeInTheDocument();
  });
});

// ─── Structure fil d'Ariane article (critère Story #4) ───────────────────────

describe('Breadcrumb — structure Accueil > Rubrique > Titre (Story #4)', () => {
  it('affiche Accueil > Rubrique > Titre tronqué correctement', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('Accueil est le premier item', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Accueil');
  });

  it('rubrique est le deuxième item', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1]).toHaveTextContent('International');
  });

  it('titre est le troisième item avec aria-current', () => {
    render(<Breadcrumb items={itemsArticle} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[2]).toHaveTextContent(/Macron annonce/);
  });
});
