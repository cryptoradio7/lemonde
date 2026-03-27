/**
 * @jest-environment jsdom
 *
 * Tests QA — Story #16 : Bouton "Copier le lien"
 * Composant : src/components/articles/ShareButtons.tsx
 *
 * Critères d'acceptation testés :
 *  CA1 — Bouton "Copier le lien" présent dans la barre de partage
 *  CA2 — Icône chaîne/lien visible
 *  CA3 — Clic → copie l'URL via navigator.clipboard.writeText
 *  CA4 — Feedback "Lien copié !" pendant 2 secondes puis reset
 *  EC1 — Fallback document.execCommand si clipboard API absente
 *  EC2 — Affiche "Erreur, copiez manuellement" si copie impossible
 *  EC3 — Bouton masqué si aucune API clipboard disponible
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ShareButtons from '@/components/articles/ShareButtons';

const DEFAULT_TITLE = 'Mon article de test';

// jsdom expose window.location.href = 'http://localhost/' par défaut
const JSDOM_URL = 'http://localhost/';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setupClipboard(writeText: jest.Mock = jest.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: { writeText },
  });
  return writeText;
}

function removeClipboard() {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: undefined,
  });
}

// ─── Rendu de base (CA1) ──────────────────────────────────────────────────────

describe('articles/ShareButtons — rendu de base', () => {
  it('CA1 — affiche le label "Partager"', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    expect(screen.getByText('Partager')).toBeInTheDocument();
  });

  it('CA1 — affiche les 4 liens sociaux (X, Facebook, LinkedIn, Email)', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    expect(screen.getByLabelText(/Partager sur X/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Partager sur Facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Partager sur LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Partager sur Email/i)).toBeInTheDocument();
  });

  it('CA1 — les liens sociaux sont des <a> (pas des <button>)', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    links.forEach((link) => {
      expect(link.tagName.toLowerCase()).toBe('a');
    });
  });

  it('CA1 — affiche le bouton "Copier le lien" quand clipboard disponible', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    expect(screen.getByText('Copier le lien')).toBeInTheDocument();
  });

  it('CA2 — le bouton copier est un <button>', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const btn = screen.getByText('Copier le lien').closest('button');
    expect(btn).not.toBeNull();
    expect(btn!.tagName.toLowerCase()).toBe('button');
  });
});

// ─── Clipboard API (CA3, CA4) ─────────────────────────────────────────────────

describe('articles/ShareButtons — Clipboard API (CA3 / CA4)', () => {
  it('CA3 — clic → appelle navigator.clipboard.writeText', async () => {
    const writeText = setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('CA3 — writeText reçoit l\'URL courante de la page', async () => {
    const writeText = setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    expect(writeText).toHaveBeenCalledWith(JSDOM_URL);
  });

  it('CA4 — après copie réussie → affiche "Lien copié !"', async () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      expect(screen.getByText('Lien copié !')).toBeInTheDocument();
    });
  });

  it('CA4 — "Lien copié !" disparaît après 2 secondes → reset à "Copier le lien"', async () => {
    jest.useFakeTimers();
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    // Vérifier état "copié"
    await waitFor(() => expect(screen.getByText('Lien copié !')).toBeInTheDocument());

    // Avancer le temps de 2100ms (> 2000ms du setTimeout)
    act(() => { jest.advanceTimersByTime(2100); });

    await waitFor(() => {
      expect(screen.getByText('Copier le lien')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('CA4 — le bouton "Lien copié !" a une apparence verte (classe border-green-600)', async () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      const btn = screen.getByText('Lien copié !').closest('button')!;
      expect(btn.className).toContain('green');
    });
  });
});

// ─── Fallback execCommand (EC1) ───────────────────────────────────────────────

describe('articles/ShareButtons — Fallback execCommand (EC1)', () => {
  beforeEach(() => {
    removeClipboard();
    // Simuler un navigateur sans clipboard mais avec execCommand
    Object.defineProperty(document, 'queryCommandSupported', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue(true),
    });
    // jsdom ne définit pas execCommand — on le crée manuellement
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    // Nettoyer execCommand après chaque test
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      writable: true,
      value: undefined,
    });
  });

  it('EC1 — appelle document.execCommand("copy") quand clipboard API absente', async () => {
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  it('EC1 — execCommand réussi → affiche "Lien copié !"', async () => {
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      expect(screen.getByText('Lien copié !')).toBeInTheDocument();
    });
  });

  it('EC2 — execCommand retourne false → affiche "Erreur, copiez manuellement"', async () => {
    (document.execCommand as jest.Mock).mockReturnValue(false);
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      expect(screen.getByText('Erreur, copiez manuellement')).toBeInTheDocument();
    });
  });
});

// ─── Erreur clipboard (EC2) ───────────────────────────────────────────────────

describe('articles/ShareButtons — Erreur clipboard (EC2)', () => {
  it('EC2 — clipboard.writeText rejette → affiche "Erreur, copiez manuellement"', async () => {
    setupClipboard(jest.fn().mockRejectedValue(new Error('Permission denied')));
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      expect(screen.getByText('Erreur, copiez manuellement')).toBeInTheDocument();
    });
  });

  it('EC2 — message d\'erreur a une apparence rouge (classe border-red)', async () => {
    setupClipboard(jest.fn().mockRejectedValue(new Error('fail')));
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      const btn = screen.getByText('Erreur, copiez manuellement').closest('button')!;
      expect(btn.className).toContain('red');
    });
  });

  it('EC2 — état erreur se reset après 2 secondes', async () => {
    jest.useFakeTimers();
    setupClipboard(jest.fn().mockRejectedValue(new Error('fail')));
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => expect(screen.getByText('Erreur, copiez manuellement')).toBeInTheDocument());

    act(() => { jest.advanceTimersByTime(2100); });

    await waitFor(() => {
      expect(screen.getByText('Copier le lien')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});

// ─── Bouton masqué (EC3) ──────────────────────────────────────────────────────

describe('articles/ShareButtons — Bouton masqué si pas de clipboard (EC3)', () => {
  it('EC3 — bouton "Copier le lien" absent quand clipboard non supporté', () => {
    removeClipboard();
    Object.defineProperty(document, 'queryCommandSupported', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue(false),
    });

    render(<ShareButtons title={DEFAULT_TITLE} />);
    expect(screen.queryByText('Copier le lien')).not.toBeInTheDocument();
  });
});

// ─── URLs de partage ──────────────────────────────────────────────────────────

describe('articles/ShareButtons — URLs de partage', () => {
  it('lien X/Twitter pointe vers twitter.com', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur X/i) as HTMLAnchorElement;
    expect(link.href).toContain('twitter.com');
  });

  it('lien Twitter contient l\'URL de la page encodée', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur X/i) as HTMLAnchorElement;
    expect(link.href).toContain(encodeURIComponent(JSDOM_URL));
  });

  it('lien Facebook pointe vers facebook.com/sharer', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur Facebook/i) as HTMLAnchorElement;
    expect(link.href).toContain('facebook.com');
  });

  it('lien LinkedIn pointe vers linkedin.com', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur LinkedIn/i) as HTMLAnchorElement;
    expect(link.href).toContain('linkedin.com');
  });

  it('lien Email a un href mailto:', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur Email/i) as HTMLAnchorElement;
    expect(link.href).toContain('mailto:');
  });

  it('le titre est encodé dans le lien Twitter', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const link = screen.getByLabelText(/Partager sur X/i) as HTMLAnchorElement;
    expect(link.href).toContain(encodeURIComponent(DEFAULT_TITLE));
  });

  it('liens sociaux ouvrent dans un nouvel onglet (target=_blank, sauf Email)', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const twitter = screen.getByLabelText(/Partager sur X/i);
    const facebook = screen.getByLabelText(/Partager sur Facebook/i);
    const linkedin = screen.getByLabelText(/Partager sur LinkedIn/i);
    expect(twitter).toHaveAttribute('target', '_blank');
    expect(facebook).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('target', '_blank');
  });
});

// ─── Accessibilité ────────────────────────────────────────────────────────────

describe('articles/ShareButtons — accessibilité', () => {
  it('le bouton copier a un aria-label en état idle', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const btn = screen.getByText('Copier le lien').closest('button')!;
    expect(btn.getAttribute('aria-label')).toBe('Copier le lien');
  });

  it('l\'aria-label du bouton copier devient "Lien copié !" après succès', async () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });

    await waitFor(() => {
      const btn = screen.getByText('Lien copié !').closest('button')!;
      expect(btn.getAttribute('aria-label')).toBe('Lien copié !');
    });
  });

  it('tous les liens sociaux ont un aria-label de la forme "Partager sur X"', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('aria-label');
      expect(link.getAttribute('aria-label')).toMatch(/Partager sur/i);
    });
  });

  it('les liens sociaux ont rel="noopener noreferrer" (sauf Email)', () => {
    setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);
    const twitter = screen.getByLabelText(/Partager sur X/i);
    const facebook = screen.getByLabelText(/Partager sur Facebook/i);
    expect(twitter).toHaveAttribute('rel', 'noopener noreferrer');
    expect(facebook).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('articles/ShareButtons — edge cases', () => {
  it('titre vide → rendu sans crash', () => {
    setupClipboard();
    expect(() => render(<ShareButtons title="" />)).not.toThrow();
    expect(screen.getByText('Partager')).toBeInTheDocument();
  });

  it('titre avec accents → rendu et URL encodée correctement', () => {
    setupClipboard();
    expect(() =>
      render(<ShareButtons title="Réforme de léducation nationale" />)
    ).not.toThrow();
    const link = screen.getByLabelText(/Partager sur X/i) as HTMLAnchorElement;
    // jsdom encode les accents dans les href résolus — vérifier la présence du ré encodé
    expect(link.href).toContain('R%C3%A9forme');
  });

  it('titre avec emoji → rendu sans crash', () => {
    setupClipboard();
    expect(() => render(<ShareButtons title="Article 🎉 test" />)).not.toThrow();
  });

  it('titre très long (500 chars) → rendu sans crash', () => {
    setupClipboard();
    expect(() => render(<ShareButtons title={'A'.repeat(500)} />)).not.toThrow();
  });

  it('titre avec balise HTML → rendu sans injection XSS', () => {
    setupClipboard();
    render(<ShareButtons title='<script>alert("xss")</script>' />);
    // Le titre est passé dans encodeURIComponent, donc pas d'injection
    const link = screen.getByLabelText(/Partager sur X/i) as HTMLAnchorElement;
    expect(link.href).not.toContain('<script>');
  });

  it('double clic → writeText appelé 2 fois, état reset correct', async () => {
    jest.useFakeTimers();
    const writeText = setupClipboard();
    render(<ShareButtons title={DEFAULT_TITLE} />);

    // Premier clic
    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });
    await waitFor(() => expect(screen.getByText('Lien copié !')).toBeInTheDocument());
    act(() => { jest.advanceTimersByTime(2100); });
    await waitFor(() => expect(screen.getByText('Copier le lien')).toBeInTheDocument());

    // Deuxième clic
    await act(async () => {
      fireEvent.click(screen.getByText('Copier le lien').closest('button')!);
    });
    await waitFor(() => expect(screen.getByText('Lien copié !')).toBeInTheDocument());

    expect(writeText).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});
