/**
 * @jest-environment jsdom
 *
 * Tests — components/TagFilter.tsx (Story #15)
 * Couvre : rendu, "Voir plus", sélection/désélection tag, "Tout voir", edge cases
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks next/navigation ────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: mockPush }),
  usePathname:     () => '/rubrique/politique',
  useSearchParams: () => new URLSearchParams(),
}));

// ─── Import après mocks ───────────────────────────────────────────────────────

import TagFilter from '@/components/TagFilter';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeTags(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `Tag${i + 1}`);
}

beforeEach(() => {
  mockPush.mockClear();
});

// ─── Rendu de base ────────────────────────────────────────────────────────────

describe('TagFilter — rendu de base', () => {
  it('retourne null si tags est vide', () => {
    const { container } = render(<TagFilter tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('affiche tous les tags si ≤ 5', () => {
    render(<TagFilter tags={makeTags(5)} />);
    expect(screen.getAllByRole('button', { name: /^Tag/ })).toHaveLength(5);
  });

  it('n\'affiche que 5 tags si > 5 (par défaut non développé)', () => {
    render(<TagFilter tags={makeTags(8)} />);
    const tagButtons = screen.getAllByRole('button', { name: /^Tag/ });
    expect(tagButtons).toHaveLength(5);
  });

  it('n\'affiche pas le bouton "Voir plus" si ≤ 5 tags', () => {
    render(<TagFilter tags={makeTags(4)} />);
    expect(screen.queryByText(/Voir plus/)).not.toBeInTheDocument();
  });
});

// ─── Bouton "Voir plus" ───────────────────────────────────────────────────────

describe('TagFilter — bouton Voir plus', () => {
  it('affiche "Voir plus ▼" si > 5 tags', () => {
    render(<TagFilter tags={makeTags(6)} />);
    expect(screen.getByText(/Voir plus/)).toBeInTheDocument();
  });

  it('développe tous les tags au clic sur "Voir plus"', () => {
    render(<TagFilter tags={makeTags(8)} />);
    fireEvent.click(screen.getByText(/Voir plus/));
    const tagButtons = screen.getAllByRole('button', { name: /^Tag/ });
    expect(tagButtons).toHaveLength(8);
  });

  it('affiche "Voir moins ▲" après développement', () => {
    render(<TagFilter tags={makeTags(6)} />);
    fireEvent.click(screen.getByText(/Voir plus/));
    expect(screen.getByText(/Voir moins/)).toBeInTheDocument();
    expect(screen.queryByText(/Voir plus/)).not.toBeInTheDocument();
  });

  it('referme la liste au clic sur "Voir moins"', () => {
    render(<TagFilter tags={makeTags(8)} />);
    fireEvent.click(screen.getByText(/Voir plus/));
    fireEvent.click(screen.getByText(/Voir moins/));
    const tagButtons = screen.getAllByRole('button', { name: /^Tag/ });
    expect(tagButtons).toHaveLength(5);
  });
});

// ─── Sélection d'un tag ───────────────────────────────────────────────────────

describe('TagFilter — sélection de tag', () => {
  it('appelle router.push avec ?tag= au clic sur un tag inactif', () => {
    render(<TagFilter tags={['Politique', 'Économie']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Politique' }));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush.mock.calls[0][0]).toContain('tag=Politique');
  });

  it('supprime le paramètre page lors de la sélection (reset pagination)', () => {
    jest.resetModules();
    // Simule une URL avec page=2
    jest.mock('next/navigation', () => ({
      useRouter:       () => ({ push: mockPush }),
      usePathname:     () => '/rubrique/politique',
      useSearchParams: () => new URLSearchParams('page=2'),
    }));
    // Re-render avec les nouveaux mocks appliqués
    render(<TagFilter tags={['Politique']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Politique' }));
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).not.toContain('page=');
  });

  it('marque le tag actif avec aria-pressed=true', () => {
    render(<TagFilter tags={['Politique', 'Économie']} activeTag="Politique" />);
    const activeBtn = screen.getByRole('button', { name: 'Politique' });
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('marque les tags inactifs avec aria-pressed=false', () => {
    render(<TagFilter tags={['Politique', 'Économie']} activeTag="Politique" />);
    const inactiveBtn = screen.getByRole('button', { name: 'Économie' });
    expect(inactiveBtn).toHaveAttribute('aria-pressed', 'false');
  });
});

// ─── Désélection d'un tag actif ───────────────────────────────────────────────

describe('TagFilter — désélection du tag actif', () => {
  it('supprime le paramètre tag au clic sur le tag actif', () => {
    render(<TagFilter tags={['Politique']} activeTag="Politique" />);
    fireEvent.click(screen.getByRole('button', { name: 'Politique' }));
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).not.toContain('tag=');
  });
});

// ─── Bouton "Tout voir" ───────────────────────────────────────────────────────

describe('TagFilter — bouton Tout voir', () => {
  it('affiche "Tout voir" si un tag est actif', () => {
    render(<TagFilter tags={['Politique', 'Économie']} activeTag="Politique" />);
    expect(screen.getByRole('button', { name: /Tout voir/i })).toBeInTheDocument();
  });

  it('n\'affiche pas "Tout voir" si aucun tag n\'est actif', () => {
    render(<TagFilter tags={['Politique', 'Économie']} />);
    expect(screen.queryByRole('button', { name: /Tout voir/i })).not.toBeInTheDocument();
  });

  it('supprime le paramètre tag au clic sur "Tout voir"', () => {
    render(<TagFilter tags={['Politique']} activeTag="Politique" />);
    fireEvent.click(screen.getByRole('button', { name: /Tout voir/i }));
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).not.toContain('tag=');
  });
});

// ─── Edge cases sécurité / robustesse ─────────────────────────────────────────

describe('TagFilter — edge cases', () => {
  it('encode correctement les tags avec caractères spéciaux', () => {
    render(<TagFilter tags={['Budget 2026']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Budget 2026' }));
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain('tag=Budget+2026');
  });

  it('encode les tags avec caractères accentués', () => {
    render(<TagFilter tags={['Assemblée nationale']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Assemblée nationale' }));
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain('tag=');
    expect(pushedUrl).toContain('nationale');
  });

  it('gère un seul tag (pas de "Voir plus")', () => {
    render(<TagFilter tags={['Unique']} />);
    expect(screen.getByRole('button', { name: 'Unique' })).toBeInTheDocument();
    expect(screen.queryByText(/Voir plus/)).not.toBeInTheDocument();
  });

  it('affiche exactement 5 tags visibles avec 6 tags (1 caché)', () => {
    render(<TagFilter tags={makeTags(6)} />);
    const tagButtons = screen.getAllByRole('button', { name: /^Tag/ });
    expect(tagButtons).toHaveLength(5); // Tag1 à Tag5 visibles
    expect(screen.queryByText('Tag6')).not.toBeInTheDocument();
  });
});
