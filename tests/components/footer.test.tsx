/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Stub fetch globalement
const mockFetch = jest.fn();
global.fetch = mockFetch;

import Footer from '@/components/Footer';

beforeEach(() => {
  mockFetch.mockReset();
});

describe('Footer — structure', () => {
  it('affiche le titre newsletter', () => {
    render(<Footer />);
    expect(screen.getByText(/Inscrivez-vous à notre newsletter/i)).toBeInTheDocument();
  });

  it('affiche le champ email et le bouton S\'inscrire', () => {
    render(<Footer />);
    expect(screen.getByRole('textbox', { name: /adresse e-mail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('affiche les 4 colonnes de liens', () => {
    render(<Footer />);
    expect(screen.getByText('Rubriques')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Légal')).toBeInTheDocument();
    // Logo colonne 1
    expect(screen.getByText('Le Monde')).toBeInTheDocument();
  });

  it('affiche les 4 icônes réseaux sociaux avec target=_blank', () => {
    render(<Footer />);
    const twitter = screen.getByRole('link', { name: /x \(twitter\)/i });
    const facebook = screen.getByRole('link', { name: /facebook/i });
    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    const instagram = screen.getByRole('link', { name: /instagram/i });

    [twitter, facebook, linkedin, instagram].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it("affiche le copyright avec l'année courante", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/tous droits réservés/i)).toBeInTheDocument();
  });

  it('affiche tous les liens de rubriques', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Politique' })).toHaveAttribute('href', '/rubrique/politique');
    expect(screen.getByRole('link', { name: 'Culture' })).toHaveAttribute('href', '/rubrique/culture');
  });
});

describe('Footer — formulaire newsletter', () => {
  it('inscrit un email valide (201) → affiche succès', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Inscription confirmée !');
    });
  });

  it('email déjà inscrit (409) → affiche message spécifique', async () => {
    mockFetch.mockResolvedValueOnce({ status: 409 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'already@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Cette adresse est déjà inscrite');
    });
  });

  it('email invalide (400) → affiche message de validation', async () => {
    mockFetch.mockResolvedValueOnce({ status: 400 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Veuillez saisir une adresse e-mail valide.');
    });
  });

  it('erreur réseau → affiche message erreur générique', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Une erreur est survenue');
    });
  });

  it('erreur serveur 500 → affiche message erreur générique', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Une erreur est survenue');
    });
  });

  it('soumet vers /api/newsletter en POST avec le body JSON', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i });
    fireEvent.change(input, { target: { value: 'user@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/newsletter',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@test.com' }),
        })
      );
    });
  });

  it('réinitialise le champ email après succès', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
