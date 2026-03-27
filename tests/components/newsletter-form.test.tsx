/**
 * @jest-environment jsdom
 */
/**
 * Tests — src/components/newsletter/NewsletterForm.tsx
 * Couvre : rendu, soumission succès, email déjà inscrit, erreur,
 *          vidage après succès, trim des espaces
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFetch = jest.fn();
global.fetch = mockFetch;

import NewsletterForm from '@/components/newsletter/NewsletterForm';

beforeEach(() => {
  mockFetch.mockReset();
});

describe('NewsletterForm — rendu', () => {
  it('affiche le champ email et le bouton S\'inscrire', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('textbox', { name: /adresse e-mail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('le champ email a l\'attribut required', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('textbox', { name: /adresse e-mail/i })).toBeRequired();
  });

  it('n\'affiche pas de message de statut au départ', () => {
    render(<NewsletterForm />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('NewsletterForm — soumission', () => {
  it('succès 201 → affiche "Inscription confirmée !"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Inscription confirmée !');
    });
  });

  it('succès 201 → vide le champ email', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox', { name: /adresse e-mail/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('409 → affiche "Cette adresse est déjà inscrite"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 409 });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'already@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Cette adresse est déjà inscrite');
    });
  });

  it('400 → affiche message de validation (email invalide côté API)', async () => {
    mockFetch.mockResolvedValueOnce({ status: 400 });

    // Soumettre le formulaire directement (simule un contournement de la validation navigateur,
    // ex: appel API direct ou test d'intégration) pour tester la gestion du 400 serveur.
    const { container } = render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'invalid' },
    });
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Veuillez saisir une adresse e-mail valide.');
    });
  });

  it('500 → affiche "Une erreur est survenue"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Une erreur est survenue');
    });
  });

  it('erreur réseau → affiche "Une erreur est survenue"', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Une erreur est survenue');
    });
  });

  it('envoie le fetch vers /api/newsletter en POST avec JSON', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: 'user@test.com' },
    });
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

  it('trim les espaces autour de l\'email avant envoi', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByRole('textbox', { name: /adresse e-mail/i }), {
      target: { value: '  test@example.com  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/newsletter',
        expect.objectContaining({
          body: JSON.stringify({ email: 'test@example.com' }),
        })
      );
    });
  });
});
