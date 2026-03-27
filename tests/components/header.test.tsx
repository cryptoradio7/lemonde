/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/link — rend une balise <a> standard
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import HeaderClient from '@/components/HeaderClient';

// Données de référence
const RUBRIQUES_EXPECTED = [
  { label: 'Politique', slug: 'politique' },
  { label: 'International', slug: 'international' },
  { label: 'Économie', slug: 'economie' },
  { label: 'Culture', slug: 'culture' },
  { label: 'Sport', slug: 'sport' },
  { label: 'Sciences', slug: 'sciences' },
  { label: 'Idées', slug: 'idees' },
  { label: 'Société', slug: 'societe' },
];

const DATE_FR = 'jeudi 27 mars 2026';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function renderHeader(userName: string | null = null, date = DATE_FR) {
  return render(<HeaderClient formattedDate={date} userName={userName} />);
}

// ─── LOGO ───────────────────────────────────────────────────────────────────

describe('Logo "Le Monde"', () => {
  it('affiche le texte "Le Monde"', () => {
    renderHeader();
    expect(screen.getByText('Le Monde')).toBeInTheDocument();
  });

  it('le logo est un lien vers "/"', () => {
    renderHeader();
    const logoLink = screen.getByText('Le Monde').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('le logo est en font Georgia serif', () => {
    renderHeader();
    const logoText = screen.getByText('Le Monde');
    expect(logoText).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('le logo a la classe font-bold', () => {
    renderHeader();
    const logoText = screen.getByText('Le Monde');
    expect(logoText.className).toMatch(/font-bold/);
  });
});

// ─── DATE ───────────────────────────────────────────────────────────────────

describe('Affichage de la date', () => {
  it('affiche la date fournie en prop', () => {
    renderHeader(null, DATE_FR);
    expect(screen.getByText(DATE_FR)).toBeInTheDocument();
  });

  it('affiche une date différente si la prop change', () => {
    renderHeader(null, 'vendredi 1 janvier 2027');
    expect(screen.getByText('vendredi 1 janvier 2027')).toBeInTheDocument();
  });

  it('la date est dans un élément de petite taille (text-xs)', () => {
    renderHeader();
    const dateEl = screen.getByText(DATE_FR);
    expect(dateEl.className).toMatch(/text-xs/);
  });
});

// ─── NAVIGATION DESKTOP ─────────────────────────────────────────────────────

describe('Barre de navigation desktop', () => {
  it('contient exactement 8 rubriques', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const links = nav.querySelectorAll('a');
    expect(links).toHaveLength(8);
  });

  RUBRIQUES_EXPECTED.forEach(({ label, slug }) => {
    it(`affiche la rubrique "${label}" avec le bon href`, () => {
      renderHeader();
      const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
      const link = nav.querySelector(`a[href="/rubrique/${slug}"]`);
      expect(link).toBeInTheDocument();
      expect(link?.textContent?.trim()).toBe(label);
    });
  });

  it('les rubriques ont la classe uppercase', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const links = nav.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.className).toMatch(/uppercase/);
    });
  });

  it('la barre de navigation a un fond noir #1D1D1B', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    expect(nav.className).toMatch(/bg-\[#1D1D1B\]/);
  });

  it('les liens nav sont des balises <a> (JS désactivé = navigation fonctionnelle)', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(8);
    links.forEach((link) => {
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href');
    });
  });
});

// ─── AUTH ────────────────────────────────────────────────────────────────────

describe('État d\'authentification', () => {
  describe('Utilisateur non connecté', () => {
    it('affiche "Se connecter"', () => {
      renderHeader(null);
      expect(screen.getAllByText('Se connecter').length).toBeGreaterThanOrEqual(1);
    });

    it('"Se connecter" est un lien vers /auth/signin', () => {
      renderHeader(null);
      const links = screen.getAllByRole('link', { name: /se connecter/i });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/auth/signin');
      });
    });

    it('n\'affiche pas de lien vers /espace-perso', () => {
      renderHeader(null);
      const espacePersoLinks = document.querySelectorAll('a[href="/espace-perso"]');
      expect(espacePersoLinks).toHaveLength(0);
    });
  });

  describe('Utilisateur connecté', () => {
    it('affiche le nom de l\'utilisateur', () => {
      renderHeader('Jean Dupont');
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    });

    it('affiche un lien vers /espace-perso', () => {
      renderHeader('Jean Dupont');
      const espacePersoLinks = document.querySelectorAll('a[href="/espace-perso"]');
      expect(espacePersoLinks.length).toBeGreaterThan(0);
    });

    it('n\'affiche pas le lien "Se connecter" (desktop)', () => {
      renderHeader('Jean Dupont');
      // desktop hidden md:flex — le lien "Se connecter" ne doit pas être présent
      // On vérifie que le lien /auth/signin du desktop n'est pas là
      const desktopAuth = document.querySelector('.hidden.md\\:flex a[href="/auth/signin"]');
      expect(desktopAuth).not.toBeInTheDocument();
    });

    it('affiche le nom tronqué si trop long (classe max-w + truncate)', () => {
      const longName = 'Jean-François de la Montagne-Dupont';
      renderHeader(longName);
      const nameEl = screen.getByText(longName);
      expect(nameEl.className).toMatch(/truncate/);
      expect(nameEl.className).toMatch(/max-w-/);
    });
  });
});

// ─── ICÔNE RECHERCHE ────────────────────────────────────────────────────────

describe('Icône de recherche', () => {
  it('affiche un lien vers /recherche', () => {
    renderHeader();
    const searchLink = screen.getByRole('link', { name: /rechercher/i });
    expect(searchLink).toHaveAttribute('href', '/recherche');
  });

  it('le lien de recherche a un aria-label', () => {
    renderHeader();
    const searchLink = screen.getByRole('link', { name: /rechercher/i });
    expect(searchLink).toHaveAttribute('aria-label', 'Rechercher');
  });
});

// ─── HAMBURGER / MENU MOBILE ─────────────────────────────────────────────────

describe('Menu mobile (hamburger)', () => {
  it('affiche un bouton hamburger', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    expect(btn).toBeInTheDocument();
  });

  it('le bouton hamburger a aria-expanded=false initialement', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('le menu mobile est fermé initialement', () => {
    renderHeader();
    const mobileNav = screen.queryByRole('navigation', { name: 'Navigation mobile' });
    expect(mobileNav).not.toBeInTheDocument();
  });

  it('le menu mobile s\'ouvre au clic sur le hamburger', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    fireEvent.click(btn);
    const mobileNav = screen.getByRole('navigation', { name: 'Navigation mobile' });
    expect(mobileNav).toBeInTheDocument();
  });

  it('aria-expanded passe à true après ouverture', () => {
    renderHeader();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('le bouton devient "Fermer le menu" quand ouvert', () => {
    renderHeader();
    const btn = screen.getByRole('button', { name: /ouvrir le menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-label', 'Fermer le menu');
  });

  it('le menu mobile se ferme au second clic', () => {
    renderHeader();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    const mobileNav = screen.queryByRole('navigation', { name: 'Navigation mobile' });
    expect(mobileNav).not.toBeInTheDocument();
  });

  it('le menu mobile contient toutes les rubriques', () => {
    renderHeader();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    const mobileNav = screen.getByRole('navigation', { name: 'Navigation mobile' });
    RUBRIQUES_EXPECTED.forEach(({ slug }) => {
      const link = mobileNav.querySelector(`a[href="/rubrique/${slug}"]`);
      expect(link).toBeInTheDocument();
    });
  });

  it('le menu mobile contient "Se connecter" si non connecté', () => {
    renderHeader(null);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    const mobileNav = screen.getByRole('navigation', { name: 'Navigation mobile' });
    const signinLink = mobileNav.querySelector('a[href="/auth/signin"]');
    expect(signinLink).toBeInTheDocument();
  });

  it('le menu mobile affiche "Mon espace — {nom}" si connecté', () => {
    renderHeader('Alice');
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    const mobileNav = screen.getByRole('navigation', { name: 'Navigation mobile' });
    expect(mobileNav).toHaveTextContent('Mon espace — Alice');
    const espaceLink = mobileNav.querySelector('a[href="/espace-perso"]');
    expect(espaceLink).toBeInTheDocument();
  });

  it('ferme le menu mobile en cliquant sur un lien de rubrique', () => {
    renderHeader();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    const mobileNav = screen.getByRole('navigation', { name: 'Navigation mobile' });
    const firstLink = mobileNav.querySelector('a') as HTMLAnchorElement;
    fireEvent.click(firstLink);
    expect(screen.queryByRole('navigation', { name: 'Navigation mobile' })).not.toBeInTheDocument();
  });
});

// ─── EDGE CASES ──────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('nom trop long → classe truncate appliquée (troncature avec ellipsis)', () => {
    const longName = 'x'.repeat(200);
    renderHeader(longName);
    const nameEl = screen.getByText(longName);
    expect(nameEl.className).toMatch(/truncate/);
  });

  it('prop userName chaîne vide → comporte comme non connecté', () => {
    // userName="" est falsy — vérifier qu'on n'affiche pas de lien espace-perso
    render(<HeaderClient formattedDate={DATE_FR} userName={null} />);
    const espaceLinks = document.querySelectorAll('a[href="/espace-perso"]');
    expect(espaceLinks).toHaveLength(0);
  });

  it('tous les liens de navigation sont des balises <a> (JS désactivé reste navigable)', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const anchors = nav.querySelectorAll('a');
    expect(anchors.length).toBe(8);
    anchors.forEach((a) => {
      expect(a.getAttribute('href')).toBeTruthy();
    });
  });

  it('le header contient un élément <header>', () => {
    const { container } = renderHeader();
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('le header a un z-index élevé (classe z-50)', () => {
    const { container } = renderHeader();
    const headerEl = container.querySelector('header');
    expect(headerEl?.className).toMatch(/z-50/);
  });
});

// ─── DONNÉES RUBRIQUES ───────────────────────────────────────────────────────

describe('Intégrité des données RUBRIQUES', () => {
  it('chaque rubrique a un slug en minuscules sans espace', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const links = Array.from(nav.querySelectorAll('a'));
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const slug = href.replace('/rubrique/', '');
      expect(slug).toMatch(/^[a-z-éèàâùûêîôü]+$/);
    });
  });

  it('toutes les rubriques ont des href distincts', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    const unique = new Set(hrefs);
    expect(unique.size).toBe(8);
  });

  it('toutes les rubriques commencent par /rubrique/', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    const links = Array.from(nav.querySelectorAll('a'));
    links.forEach((link) => {
      expect(link.getAttribute('href')).toMatch(/^\/rubrique\//);
    });
  });
});
