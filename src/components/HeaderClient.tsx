'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const RUBRIQUES = [
  { label: 'Politique', href: '/rubrique/politique' },
  { label: 'International', href: '/rubrique/international' },
  { label: 'Économie', href: '/rubrique/economie' },
  { label: 'Culture', href: '/rubrique/culture' },
  { label: 'Sport', href: '/rubrique/sport' },
  { label: 'Sciences', href: '/rubrique/sciences' },
  { label: 'Idées', href: '/rubrique/idees' },
  { label: 'Société', href: '/rubrique/societe' },
];

interface HeaderClientProps {
  formattedDate: string;
  userName: string | null;
}

export default function HeaderClient({ formattedDate, userName }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full bg-white border-b border-[#D5D5D5] z-50 transition-shadow duration-200 ${
        isSticky ? 'fixed top-0 left-0 shadow-md' : 'relative'
      }`}
    >
      {/* Top bar */}
      <div className="border-b border-[#D5D5D5]">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between gap-4">

          {/* Date — gauche */}
          <span className="text-xs text-[#6B6B6B] hidden sm:block min-w-0 truncate" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            {formattedDate}
          </span>

          {/* Logo — centré */}
          <Link href="/" className="flex-shrink-0">
            <span
              className="text-3xl md:text-[32px] font-bold tracking-tight text-[#1D1D1B] leading-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Le Monde
            </span>
          </Link>

          {/* Actions — droite */}
          <div className="flex items-center gap-3 justify-end min-w-0">

            {/* Recherche */}
            <Link
              href="/recherche"
              className="text-[#1D1D1B] hover:text-[#E9322D] transition-colors flex-shrink-0"
              aria-label="Rechercher"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center">
              {userName ? (
                <Link
                  href="/espace-perso"
                  className="text-xs font-semibold text-[#1D1D1B] hover:text-[#E9322D] transition-colors uppercase tracking-wide truncate max-w-[120px]"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                  title={userName}
                >
                  {userName}
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="text-xs font-semibold text-[#1D1D1B] hover:text-[#E9322D] transition-colors uppercase tracking-wide"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                >
                  Se connecter
                </Link>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden text-[#1D1D1B] hover:text-[#E9322D] transition-colors flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barre de navigation desktop */}
      <nav className="hidden md:block bg-[#1D1D1B]" aria-label="Navigation principale">
        <div className="max-w-[1200px] mx-auto px-4">
          <ul className="flex items-center justify-center">
            {RUBRIQUES.map((rubrique) => (
              <li key={rubrique.href}>
                <Link
                  href={rubrique.href}
                  className="block px-4 py-3 text-sm text-white hover:text-[#E9322D] transition-colors tracking-wide uppercase truncate"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                >
                  {rubrique.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#1D1D1B] border-t border-[#333]" aria-label="Navigation mobile">
          <ul className="flex flex-col">
            {RUBRIQUES.map((rubrique) => (
              <li key={rubrique.href} className="border-b border-[#333] last:border-b-0">
                <Link
                  href={rubrique.href}
                  className="block px-6 py-3 text-sm text-white hover:text-[#E9322D] hover:bg-[#2a2a28] transition-colors tracking-wide uppercase truncate"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {rubrique.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-[#444] mt-1">
              {userName ? (
                <Link
                  href="/espace-perso"
                  className="block px-6 py-3 text-sm text-[#E9322D] hover:bg-[#2a2a28] transition-colors tracking-wide truncate"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon espace — {userName}
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-6 py-3 text-sm text-[#E9322D] hover:bg-[#2a2a28] transition-colors tracking-wide uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
