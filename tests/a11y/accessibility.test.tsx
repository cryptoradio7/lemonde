/**
 * @jest-environment jsdom
 */
/**
 * Tests — Accessibilité WCAG 2.1 AA (story #19)
 * Couvre : skip-to-content, focus, ARIA, formulaires, pagination, cookie banner
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/lib/cookieConsent', () => ({
  shouldShowBanner: () => true,
  setConsent: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/rubrique/politique',
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ─── Imports composants ───────────────────────────────────────────────────────

import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import CookieBanner from '@/components/CookieBanner';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('Pagination — accessibilité', () => {
  it('a un landmark nav avec aria-label', () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/rubrique/politique" />);
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('le lien "Précédent" a un aria-label explicite', () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/rubrique/politique" />);
    expect(screen.getByRole('link', { name: /page précédente/i })).toBeInTheDocument();
  });

  it('le lien "Suivant" a un aria-label explicite', () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/rubrique/politique" />);
    expect(screen.getByRole('link', { name: /page suivante/i })).toBeInTheDocument();
  });

  it('la page courante a aria-current="page"', () => {
    render(<Pagination currentPage={2} totalPages={5} baseUrl="/rubrique/politique" />);
    const current = screen.getByLabelText(/page 2, page courante/i);
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('les liens de page ont des aria-label descriptifs', () => {
    render(<Pagination currentPage={1} totalPages={5} baseUrl="/rubrique/politique" />);
    expect(screen.getByRole('link', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 3' })).toBeInTheDocument();
  });
});

// ─── SearchBar ────────────────────────────────────────────────────────────────

describe('SearchBar — accessibilité', () => {
  it('a un role="search" sur le formulaire', () => {
    render(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('l\'input a un aria-label', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox', { name: /rechercher/i })).toBeInTheDocument();
  });

  it('le bouton submit a un texte explicite', () => {
    render(<SearchBar />);
    expect(screen.getByRole('button', { name: /rechercher/i })).toBeInTheDocument();
  });
});

// ─── CookieBanner ─────────────────────────────────────────────────────────────

describe('CookieBanner — accessibilité', () => {
  it('a role="dialog" et aria-modal="true"', () => {
    render(<CookieBanner />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('a aria-labelledby pointant vers le titre', () => {
    render(<CookieBanner />);
    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent(/gestion des cookies/i);
  });

  it('les boutons ont des textes explicites', () => {
    render(<CookieBanner />);
    expect(screen.getByRole('button', { name: /refuser/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accepter/i })).toBeInTheDocument();
  });
});

// ─── NewsletterForm ───────────────────────────────────────────────────────────

describe('NewsletterForm — accessibilité a11y', () => {
  beforeEach(() => mockFetch.mockReset());

  it('le formulaire a aria-label', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('form', { name: /newsletter/i })).toBeInTheDocument();
  });

  it('message d\'erreur a role="alert" et aria-live="assertive"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('message de succès a role="status" et aria-live="polite"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });
    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('input a aria-invalid et aria-describedby quand erreur', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'newsletter-status');
    });
  });
});
