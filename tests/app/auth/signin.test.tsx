/**
 * @jest-environment jsdom
 *
 * Tests — app/auth/signin/page.tsx
 * Couvre : rendu du formulaire, soumission, redirection succès, erreurs,
 *          lien "Créer un compte", état loading, message post-inscription, edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockSearchParamsGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockSearchParamsGet }),
}));

const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// ─── Import après mocks ───────────────────────────────────────────────────────

import SignInPage from '@/app/auth/signin/page';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPage() {
  return render(<SignInPage />);
}

function fillForm(email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: password } });
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParamsGet.mockReturnValue(null);
});

// ─── Structure ────────────────────────────────────────────────────────────────

describe('SignInPage — structure', () => {
  it('affiche le titre "Connexion"', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Connexion');
  });

  it('affiche le champ Email', () => {
    renderPage();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  });

  it('le champ Email a type=email', () => {
    renderPage();
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('type', 'email');
  });

  it('affiche le champ Mot de passe', () => {
    renderPage();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
  });

  it('le champ Mot de passe a type=password', () => {
    renderPage();
    expect(screen.getByLabelText(/^mot de passe$/i)).toHaveAttribute('type', 'password');
  });

  it('affiche le bouton "Se connecter"', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('affiche le lien "Créer un compte" vers /auth/signup', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /créer un compte/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/signup');
  });

  it('affiche le texte "Pas encore de compte ?"', () => {
    renderPage();
    expect(screen.getByText(/pas encore de compte/i)).toBeInTheDocument();
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

  it('aucun message d\'erreur affiché au chargement initial', () => {
    renderPage();
    const errorPara = document.querySelector('p[class*="red"]');
    expect(errorPara).not.toBeInTheDocument();
  });
});

// ─── Message post-inscription ─────────────────────────────────────────────────

describe('SignInPage — message post-inscription', () => {
  it('affiche "Compte créé, connectez-vous" si ?message=compte-cree', () => {
    mockSearchParamsGet.mockReturnValue('compte-cree');
    renderPage();
    expect(screen.getByText(/compte créé, connectez-vous/i)).toBeInTheDocument();
  });

  it('n\'affiche pas de message si pas de query param', () => {
    mockSearchParamsGet.mockReturnValue(null);
    renderPage();
    expect(screen.queryByText(/compte créé/i)).not.toBeInTheDocument();
  });
});

// ─── Soumission — succès ──────────────────────────────────────────────────────

describe('SignInPage — soumission succès', () => {
  it('appelle signIn("credentials", ...) avec email et password', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    renderPage();
    fillForm('lecteur@lemonde.fr', 'password123');
    submitForm();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          email: 'lecteur@lemonde.fr',
          password: 'password123',
          redirect: false,
        })
      );
    });
  });

  it('redirige vers /espace-perso après succès', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    renderPage();
    fillForm('lecteur@lemonde.fr', 'password123');
    submitForm();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/espace-perso');
    });
  });

  it('ne redirige PAS si signIn retourne une erreur', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    renderPage();
    fillForm('bad@example.com', 'wrongpassword');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ─── Soumission — erreur credentials ─────────────────────────────────────────

describe('SignInPage — erreur credentials', () => {
  it('affiche "Email ou mot de passe incorrect" si email inexistant', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    renderPage();
    fillForm('inexistant@example.com', 'password123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });
  });

  it('affiche "Email ou mot de passe incorrect" si mot de passe incorrect', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    renderPage();
    fillForm('lecteur@lemonde.fr', 'mauvaismdp');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });
  });

  it('même message pour email inexistant et mdp incorrect (sécurité)', async () => {
    mockSignIn
      .mockResolvedValueOnce({ error: 'CredentialsSignin' })
      .mockResolvedValueOnce({ error: 'CredentialsSignin' });

    renderPage();

    fillForm('noone@example.com', 'password123');
    submitForm();
    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'lecteur@lemonde.fr' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'wrong' } });
    submitForm();
    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });
  });
});

// ─── État loading ─────────────────────────────────────────────────────────────

describe('SignInPage — état loading', () => {
  it('affiche "Connexion..." pendant la soumission', async () => {
    mockSignIn.mockImplementationOnce(() => new Promise(() => {}));
    renderPage();
    fillForm('lecteur@lemonde.fr', 'password123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connexion\.\.\./i })).toBeInTheDocument();
    });
  });

  it('désactive le bouton pendant la soumission', async () => {
    mockSignIn.mockImplementationOnce(() => new Promise(() => {}));
    renderPage();
    fillForm('lecteur@lemonde.fr', 'password123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connexion\.\.\./i })).toBeDisabled();
    });
  });

  it('réactive le bouton après une erreur', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    renderPage();
    fillForm('lecteur@lemonde.fr', 'wrong');
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /se connecter/i })).not.toBeDisabled();
    });
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('SignInPage — edge cases', () => {
  it('efface le message d\'erreur avant une nouvelle soumission', async () => {
    mockSignIn
      .mockResolvedValueOnce({ error: 'CredentialsSignin' })
      .mockImplementationOnce(() => new Promise(() => {}));

    renderPage();
    fillForm('lecteur@lemonde.fr', 'wrong');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });

    submitForm();

    await waitFor(() => {
      expect(screen.queryByText('Email ou mot de passe incorrect')).not.toBeInTheDocument();
    });
  });
});
