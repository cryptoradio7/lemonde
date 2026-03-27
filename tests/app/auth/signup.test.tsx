/**
 * @jest-environment jsdom
 *
 * Tests — app/auth/signup/page.tsx
 * Couvre : rendu du formulaire, soumission, redirection succès, erreurs (409, réseau),
 *          lien "Déjà un compte", état loading, edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ─── Import après mocks ───────────────────────────────────────────────────────

import SignUpPage from '@/app/auth/signup/page';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPage() {
  return render(<SignUpPage />);
}

function fillForm(name: string, email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: password } });
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Structure ────────────────────────────────────────────────────────────────

describe('SignUpPage — structure', () => {
  it('affiche le titre "Créer un compte"', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Créer un compte');
  });

  it('affiche le champ Nom', () => {
    renderPage();
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
  });

  it('affiche le champ Email', () => {
    renderPage();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  });

  it('affiche le champ Mot de passe', () => {
    renderPage();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
  });

  it('affiche le bouton "Créer mon compte"', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeInTheDocument();
  });

  it('le champ Nom a minLength=2', () => {
    renderPage();
    const input = screen.getByLabelText(/^nom$/i);
    expect(input).toHaveAttribute('minLength', '2');
  });

  it('le champ Mot de passe a minLength=8', () => {
    renderPage();
    const input = screen.getByLabelText(/^mot de passe$/i);
    expect(input).toHaveAttribute('minLength', '8');
  });

  it('le champ Email a type=email', () => {
    renderPage();
    const input = screen.getByLabelText(/^email$/i);
    expect(input).toHaveAttribute('type', 'email');
  });

  it('le champ Mot de passe a type=password', () => {
    renderPage();
    const input = screen.getByLabelText(/^mot de passe$/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('affiche le lien "Se connecter" vers /auth/signin', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /se connecter/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/signin');
  });

  it('affiche le texte "Déjà un compte ?"', () => {
    renderPage();
    expect(screen.getByText(/déjà un compte/i)).toBeInTheDocument();
  });

  it('le conteneur principal a max-width 400px', () => {
    renderPage();
    const main = screen.getByRole('main');
    expect(main.className).toContain('max-w-[400px]');
  });

  it('le conteneur est centré (mx-auto)', () => {
    renderPage();
    const main = screen.getByRole('main');
    expect(main.className).toContain('mx-auto');
  });
});

// ─── Soumission — succès ──────────────────────────────────────────────────────

describe('SignUpPage — soumission succès (201)', () => {
  it('soumet en POST vers /api/auth/signup', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 201 });
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/signup',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('envoie le Content-Type application/json', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 201 });
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/signup',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('envoie name, email, password dans le body JSON', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 201 });
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body).toEqual({
        name: 'Alice Dupont',
        email: 'alice@example.com',
        password: 'secret123',
      });
    });
  });

  it('redirige vers /auth/signin?message=compte-cree après succès', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 201 });
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin?message=compte-cree');
    });
  });
});

// ─── Soumission — erreur 409 (email existant) ─────────────────────────────────

describe('SignUpPage — email déjà utilisé (409)', () => {
  it('affiche "Un compte existe déjà avec cet email"', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Un compte existe déjà avec cet email' }),
    });
    renderPage();
    fillForm('Alice Dupont', 'existing@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Un compte existe déjà avec cet email')).toBeInTheDocument();
    });
  });

  it('ne redirige PAS si email déjà utilisé', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Un compte existe déjà avec cet email' }),
    });
    renderPage();
    fillForm('Alice Dupont', 'existing@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Un compte existe déjà avec cet email')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ─── Soumission — erreur 400 (validation) ────────────────────────────────────

describe('SignUpPage — erreur de validation (400)', () => {
  it('affiche le message d\'erreur retourné par l\'API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Données invalides' }),
    });
    renderPage();
    fillForm('A', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Données invalides')).toBeInTheDocument();
    });
  });
});

// ─── Erreur réseau ────────────────────────────────────────────────────────────

describe('SignUpPage — erreur réseau', () => {
  it('affiche un message générique si la requête échoue (fetch throw)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText('Une erreur est survenue. Veuillez réessayer.')
      ).toBeInTheDocument();
    });
  });

  it('ne redirige PAS en cas d\'erreur réseau', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText('Une erreur est survenue. Veuillez réessayer.')
      ).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ─── État loading ─────────────────────────────────────────────────────────────

describe('SignUpPage — état loading', () => {
  it('affiche "Création..." pendant la soumission', async () => {
    // fetch ne résout jamais → reste en loading
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /création\.\.\./i })).toBeInTheDocument();
    });
  });

  it('désactive le bouton pendant la soumission', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    renderPage();
    fillForm('Alice Dupont', 'alice@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /création\.\.\./i })).toBeDisabled();
    });
  });

  it('réactive le bouton après une erreur', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Un compte existe déjà avec cet email' }),
    });
    renderPage();
    fillForm('Alice Dupont', 'existing@example.com', 'secret123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /créer mon compte/i })).not.toBeDisabled();
    });
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('SignUpPage — edge cases', () => {
  it('aucun message d\'erreur affiché au chargement initial', () => {
    renderPage();
    // Pas de paragraphe d'erreur visible
    const errorPara = document.querySelector('p[class*="red"]');
    expect(errorPara).not.toBeInTheDocument();
  });

  it('efface le message d\'erreur précédent avant une nouvelle soumission', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'Un compte existe déjà avec cet email' }),
      })
      .mockImplementationOnce(() => new Promise(() => {}));

    renderPage();
    fillForm('Alice Dupont', 'existing@example.com', 'secret123');
    submitForm();

    // Attendre premier message d'erreur
    await waitFor(() => {
      expect(screen.getByText('Un compte existe déjà avec cet email')).toBeInTheDocument();
    });

    // Resubmettre
    submitForm();

    // L'erreur précédente doit avoir disparu (setError("") avant fetch)
    await waitFor(() => {
      expect(screen.queryByText('Un compte existe déjà avec cet email')).not.toBeInTheDocument();
    });
  });
});
