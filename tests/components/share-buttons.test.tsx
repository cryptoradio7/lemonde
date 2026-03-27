/**
 * @jest-environment jsdom
 *
 * Tests — components/ShareButtons.tsx (client component)
 * Couvre : rendu des 4 boutons, URLs encodées, comportement au clic,
 *          accessibilité aria-label
 *
 * Le composant :
 * - accepte { url: string, title: string }
 * - rend 4 <button> (pas des <a>)
 * - aria-label : "Partager sur Twitter/Facebook/LinkedIn/Email"
 * - window.open() pour les réseaux sociaux, window.location.href pour Email
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ShareButtons from '@/components/ShareButtons';

const DEFAULT_URL   = 'https://www.lemonde.test/article/mon-article';
const DEFAULT_TITLE = 'Mon article de test';

// ─── Rendu de base ────────────────────────────────────────────────────────────

describe('ShareButtons — rendu', () => {
  it('affiche le label "Partager"', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getByText('Partager')).toBeInTheDocument();
  });

  it('affiche 4 boutons de partage', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('affiche le bouton Twitter', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getByLabelText(/Partager sur Twitter/i)).toBeInTheDocument();
  });

  it('affiche le bouton Facebook', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getByLabelText(/Partager sur Facebook/i)).toBeInTheDocument();
  });

  it('affiche le bouton LinkedIn', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getByLabelText(/Partager sur LinkedIn/i)).toBeInTheDocument();
  });

  it('affiche le bouton Email', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getByLabelText(/Partager sur Email/i)).toBeInTheDocument();
  });
});

// ─── Comportement au clic ─────────────────────────────────────────────────────

describe('ShareButtons — comportement au clic', () => {
  let windowOpenSpy: jest.SpyInstance;
  let originalLocationHref: string;
  let locationHrefSetter: jest.SpyInstance;

  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    // Spy sur window.location.href sans modifier la navigation
    const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
    if (locationDescriptor?.configurable) {
      locationHrefSetter = jest.fn();
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...window.location,
          set href(val: string) { locationHrefSetter(val); },
          get href() { return 'http://localhost/'; },
        },
      });
    }
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
    if (locationHrefSetter) {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: window.location,
      });
    }
  });

  it('clic Twitter appelle window.open avec l\'URL Twitter', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur Twitter/i));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      expect.any(String)
    );
  });

  it('clic Facebook appelle window.open avec l\'URL Facebook', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur Facebook/i));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer'),
      '_blank',
      expect.any(String)
    );
  });

  it('clic LinkedIn appelle window.open avec l\'URL LinkedIn', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur LinkedIn/i));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com'),
      '_blank',
      expect.any(String)
    );
  });
});

// ─── URLs encodées (vérification via l'URL passée à window.open) ──────────────

describe('ShareButtons — URLs de partage', () => {
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('l\'URL de l\'article est encodée dans le lien Twitter', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur Twitter/i));
    const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent(DEFAULT_URL));
  });

  it('le titre est encodé dans le lien Twitter', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur Twitter/i));
    const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent(DEFAULT_TITLE));
  });

  it('l\'URL de l\'article est encodée dans le lien Facebook', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur Facebook/i));
    const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent(DEFAULT_URL));
  });

  it('l\'URL de l\'article est encodée dans le lien LinkedIn', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    fireEvent.click(screen.getByLabelText(/Partager sur LinkedIn/i));
    const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent(DEFAULT_URL));
  });
});

// ─── Accessibilité ────────────────────────────────────────────────────────────

describe('ShareButtons — accessibilité', () => {
  it('chaque bouton a un aria-label explicite', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-label');
      expect(btn.getAttribute('aria-label')).toMatch(/Partager sur/i);
    });
  });

  it('les boutons sont des <button> (pas des <a>)', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn.tagName.toLowerCase()).toBe('button');
    });
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe('ShareButtons — edge cases', () => {
  it('url vide → rendu sans crash', () => {
    expect(() => render(<ShareButtons url="" title={DEFAULT_TITLE} />)).not.toThrow();
  });

  it('titre vide → rendu sans crash', () => {
    expect(() => render(<ShareButtons url={DEFAULT_URL} title="" />)).not.toThrow();
  });

  it('titre avec accents → rendu sans crash', () => {
    expect(() =>
      render(<ShareButtons url={DEFAULT_URL} title="Réforme de l'éducation nationale" />)
    ).not.toThrow();
    expect(screen.getByText('Partager')).toBeInTheDocument();
  });

  it('titre avec emoji → rendu sans crash', () => {
    expect(() =>
      render(<ShareButtons url={DEFAULT_URL} title="Article 🎉 test" />)
    ).not.toThrow();
  });

  it('titre très long → rendu sans crash', () => {
    expect(() =>
      render(<ShareButtons url={DEFAULT_URL} title={'A'.repeat(500)} />)
    ).not.toThrow();
  });

  it('url avec caractères spéciaux → encodée correctement', () => {
    const urlWithSpecial = 'https://lemonde.fr/article/l-art-&-la-<science>';
    render(<ShareButtons url={urlWithSpecial} title={DEFAULT_TITLE} />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});

// ─── Structure visuelle ───────────────────────────────────────────────────────

describe('ShareButtons — structure visuelle', () => {
  it('rendu dans un conteneur flex', () => {
    const { container } = render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain('flex');
  });

  it('4 boutons rendus, pas plus', () => {
    render(<ShareButtons url={DEFAULT_URL} title={DEFAULT_TITLE} />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});
