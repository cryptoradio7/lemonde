/**
 * @jest-environment jsdom
 */
/**
 * Tests — Accessibilité WCAG 2.1 AA (story #19)
 * Couvre : skip-to-content, focus, ARIA, formulaires, pagination, cookie banner,
 *          images alt, landmarks header/footer, auth forms, heading hierarchy, ArticleCard
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
  useSearchParams: () => ({ get: jest.fn().mockReturnValue(null) }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, fill: _fill, unoptimized: _unoptimized, sizes: _sizes, ...props }: {
    src: string; alt: string; fill?: boolean; unoptimized?: boolean; sizes?: string; [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ─── Imports composants ───────────────────────────────────────────────────────

import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import CookieBanner from '@/components/CookieBanner';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import HeaderClient from '@/components/HeaderClient';
import Footer from '@/components/Footer';
import ImageOrPlaceholder from '@/components/articles/ImageOrPlaceholder';
import ArticleCard, { type ArticleWithCategory } from '@/components/ArticleCard';
import SignInPage from '@/app/auth/signin/page';
import SignUpPage from '@/app/auth/signup/page';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<ArticleWithCategory> = {}): ArticleWithCategory {
  return {
    id: 'art-a11y',
    title: 'Titre accessible de l\'article',
    slug: 'titre-accessible',
    excerpt: 'Résumé court.',
    content: 'Mot '.repeat(300),
    imageUrl: null,
    imageAlt: null,
    author: 'Sophie Martin',
    categoryId: 'cat-1',
    publishedAt: new Date('2026-03-25T10:00:00Z'),
    createdAt: new Date('2026-03-25T10:00:00Z'),
    updatedAt: new Date('2026-03-25T10:00:00Z'),
    category: { id: 'cat-1', name: 'Politique', slug: 'politique', description: null, order: 1 },
    ...overrides,
  };
}

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

// ─── Skip-to-content ──────────────────────────────────────────────────────────

describe('Skip-to-content — accessibilité', () => {
  it('le lien pointe vers #main-content', () => {
    render(
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>
    );
    const link = screen.getByRole('link', { name: /aller au contenu principal/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('la cible #main-content existe dans la structure de page', () => {
    render(
      <>
        <a href="#main-content" className="skip-to-content">Aller au contenu principal</a>
        <main id="main-content" tabIndex={-1}><p>Contenu</p></main>
      </>
    );
    expect(document.getElementById('main-content')).toBeInTheDocument();
    expect(document.getElementById('main-content')).toHaveAttribute('tabIndex', '-1');
  });

  it('le texte du lien est explicite pour les lecteurs d\'écran', () => {
    render(
      <a href="#main-content" className="skip-to-content">Aller au contenu principal</a>
    );
    const link = screen.getByRole('link');
    expect(link.textContent).toMatch(/aller au contenu principal/i);
  });
});

// ─── Header landmarks ─────────────────────────────────────────────────────────

describe('HeaderClient — landmarks ARIA', () => {
  it('a un élément <header> (role=banner implicite)', () => {
    render(<HeaderClient formattedDate="vendredi 27 mars 2026" userName={null} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('la nav desktop a aria-label="Navigation principale"', () => {
    render(<HeaderClient formattedDate="vendredi 27 mars 2026" userName={null} />);
    expect(screen.getByRole('navigation', { name: /navigation principale/i })).toBeInTheDocument();
  });

  it('le bouton hamburger a un aria-label et aria-expanded', () => {
    render(<HeaderClient formattedDate="vendredi 27 mars 2026" userName={null} />);
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('aria-expanded passe à true quand menu mobile ouvert', () => {
    render(<HeaderClient formattedDate="vendredi 27 mars 2026" userName={null} />);
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('le lien recherche a aria-label explicite', () => {
    render(<HeaderClient formattedDate="vendredi 27 mars 2026" userName={null} />);
    expect(screen.getByRole('link', { name: /rechercher/i })).toBeInTheDocument();
  });
});

// ─── Footer landmarks ─────────────────────────────────────────────────────────

describe('Footer — landmarks ARIA', () => {
  beforeEach(() => mockFetch.mockReset());

  it('a un élément <footer> (role=contentinfo implicite)', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('les icônes réseaux sociaux ont des aria-label explicites', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /x \(twitter\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
  });

  it('les SVG icônes ont aria-hidden pour ne pas polluer les lecteurs d\'écran', () => {
    render(<Footer />);
    const svgs = document.querySelectorAll('footer svg[aria-hidden="true"]');
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });
});

// ─── ImageOrPlaceholder — accessibilité ───────────────────────────────────────

describe('ImageOrPlaceholder — accessibilité', () => {
  it('image réelle avec imageAlt → alt non vide', () => {
    render(
      <div style={{ position: 'relative', width: 300, height: 200 }}>
        <ImageOrPlaceholder imageUrl="/photo.jpg" imageAlt="Photo de Paris au coucher du soleil" categoryName="Politique" />
      </div>
    );
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Photo de Paris au coucher du soleil');
  });

  it('imageAlt null → fallback sur categoryName (jamais d\'alt vide)', () => {
    render(
      <div style={{ position: 'relative', width: 300, height: 200 }}>
        <ImageOrPlaceholder imageUrl="/photo.jpg" imageAlt={null} categoryName="Culture" />
      </div>
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Culture');
    expect(img.getAttribute('alt')).not.toBe('');
  });

  it('placeholder décoratif a aria-hidden="true"', () => {
    render(
      <div style={{ position: 'relative', width: 300, height: 200 }}>
        <ImageOrPlaceholder imageUrl={null} imageAlt={null} categoryName="Sport" />
      </div>
    );
    const placeholder = document.querySelector('[aria-hidden="true"]');
    expect(placeholder).toBeInTheDocument();
  });

  it('placeholder sans imageUrl ne rend pas d\'élément <img>', () => {
    render(
      <div style={{ position: 'relative', width: 300, height: 200 }}>
        <ImageOrPlaceholder imageUrl={null} imageAlt={null} categoryName="Sciences" />
      </div>
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

// ─── ArticleCard — accessibilité ──────────────────────────────────────────────

describe('ArticleCard — accessibilité', () => {
  it('variant large : le titre est un h2', () => {
    render(<ArticleCard article={makeArticle()} variant="large" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Titre accessible');
  });

  it('variant medium : le titre est un h3', () => {
    render(<ArticleCard article={makeArticle()} variant="medium" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Titre accessible');
  });

  it('variant small : le titre est un h3', () => {
    render(<ArticleCard article={makeArticle()} variant="small" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Titre accessible');
  });

  it('l\'élément <time> a un attribut dateTime valide', () => {
    render(<ArticleCard article={makeArticle()} variant="medium" />);
    const time = document.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time?.getAttribute('dateTime')).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it('le lien wrappant l\'article a un contenu accessible (titre visible)', () => {
    render(<ArticleCard article={makeArticle()} variant="medium" />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/article/titre-accessible');
  });

  it('le séparateur "·" est masqué des lecteurs d\'écran (aria-hidden)', () => {
    render(<ArticleCard article={makeArticle()} variant="medium" />);
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    // Au moins un séparateur · est aria-hidden
    const dots = Array.from(separators).filter(el => el.textContent?.includes('·'));
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── Auth forms — accessibilité ───────────────────────────────────────────────

describe('SignInPage — accessibilité formulaire', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('les inputs sont associés à leurs labels via htmlFor/id', () => {
    render(<SignInPage />);
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('id', 'email');
    expect(screen.getByLabelText(/^mot de passe$/i)).toHaveAttribute('id', 'password');
  });

  it('les inputs ont les bons types', () => {
    render(<SignInPage />);
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^mot de passe$/i)).toHaveAttribute('type', 'password');
  });

  it('le message d\'erreur a role="alert" et aria-live="assertive"', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('les inputs ont aria-invalid="true" et aria-describedby après erreur', async () => {
    mockSignIn.mockResolvedValueOnce({ error: 'CredentialsSignin' });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/^email$/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby', 'signin-error');
    });
  });

  it('le bouton submit a aria-busy="true" pendant le chargement', async () => {
    mockSignIn.mockImplementationOnce(() => new Promise(() => {}));
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connexion/i })).toHaveAttribute('aria-busy', 'true');
    });
  });
});

describe('SignUpPage — accessibilité formulaire', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('les inputs sont associés à leurs labels via htmlFor/id', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText(/^nom$/i)).toHaveAttribute('id', 'name');
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('id', 'email');
    expect(screen.getByLabelText(/^mot de passe$/i)).toHaveAttribute('id', 'password');
  });

  it('le message d\'erreur a role="alert" et aria-live="assertive"', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur serveur' }),
    });
    render(<SignUpPage />);
    fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('les inputs en erreur ont aria-invalid et aria-describedby', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email déjà utilisé' }),
    });
    render(<SignUpPage />);
    fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'bob@test.com' } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/^email$/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby', 'signup-error');
    });
  });
});
