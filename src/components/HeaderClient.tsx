'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const RUBRIQUES_FEATURED = [
  { label: 'Guerres au Proche-Orient', href: '/rubrique/proche-orient' },
  { label: 'Guerre en Ukraine', href: '/rubrique/ukraine' },
];

const RUBRIQUES = [
  { label: 'International', href: '/rubrique/international' },
  { label: 'Planète', href: '/rubrique/planete' },
  { label: 'Politique', href: '/rubrique/politique' },
  { label: 'Société', href: '/rubrique/societe' },
  { label: 'Économie', href: '/rubrique/economie' },
  { label: 'Idées', href: '/rubrique/idees' },
  { label: 'Culture', href: '/rubrique/culture' },
  { label: 'Le Goût du Monde', href: '/rubrique/gout-du-monde' },
  { label: 'Sciences', href: '/rubrique/sciences' },
  { label: 'Sport', href: '/rubrique/sport' },
  { label: 'Pixels', href: '/rubrique/pixels' },
];

const ALL_RUBRIQUES = [...RUBRIQUES_FEATURED, ...RUBRIQUES];

interface HeaderClientProps {
  formattedDate: string;
  userName: string | null;
}

export default function HeaderClient({ formattedDate, userName }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowShadow(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 sticky top-0 transition-shadow duration-200 ${
        showShadow ? 'shadow-md' : ''
      }`}
    >
      {/* ── Top bar — fond sombre avec logo ── */}
      <div className="bg-[#1D1D1B]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 grid grid-cols-3 items-center">

          {/* Gauche : Le journal + Services */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-[#999] hover:text-white transition-colors"
              aria-label="Le journal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-[10px] leading-none hidden sm:block">Le journal</span>
            </Link>
            <button
              className="flex flex-col items-center gap-0.5 text-[#999] hover:text-white transition-colors"
              aria-label="Services"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="19" cy="5" r="1.5" fill="currentColor" />
                <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                <circle cx="5" cy="19" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                <circle cx="19" cy="19" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-[10px] leading-none hidden sm:block">Services</span>
            </button>
          </div>

          {/* Centre : Logo Le Monde */}
          <Link href="/" className="flex justify-center">
            <span
              className="text-[28px] sm:text-[34px] md:text-[40px] font-normal tracking-tight text-white leading-none"
              style={{ fontFamily: "var(--font-playfair), Georgia, 'Times New Roman', serif", fontWeight: 400 }}
            >
              Le Monde
            </span>
          </Link>

          {/* Droite : FR/EN + S'abonner + compte */}
          <div className="flex items-center gap-2 justify-end">
            {/* Langues — desktop */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-[#999]">
              <span className="text-white font-semibold">FR</span>
              <span className="text-[#666]">EN</span>
            </div>

            {/* S'abonner */}
            <Link
              href="/auth/signin"
              className="hidden sm:inline-flex items-center px-3 py-1.5 bg-[#E9322D] text-white text-xs font-bold rounded-sm hover:bg-[#d12a25] transition-colors tracking-wide"
            >
              S&apos;abonner
            </Link>

            {/* Compte utilisateur */}
            <Link
              href={userName ? '/espace-perso' : '/auth/signin'}
              className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] text-[#999] hover:text-white transition-colors"
              aria-label={userName ? `Espace de ${userName}` : 'Se connecter'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Barre de navigation — fond noir ── */}
      <nav className="bg-[#2A2A2A] border-t border-[#3a3a3a]" aria-label="Navigation principale">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center">
            {/* Hamburger Menu */}
            <button
              className="flex items-center gap-1.5 py-2.5 pr-3 text-white hover:text-[#E9322D] transition-colors border-r border-[#444] mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
              <span className="text-sm font-medium hidden sm:inline">Menu</span>
            </button>

            {/* Recherche */}
            <Link
              href="/recherche"
              className="flex items-center justify-center py-2.5 pr-3 text-white hover:text-[#E9322D] transition-colors border-r border-[#444] mr-1"
              aria-label="Rechercher"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            {/* Rubriques à la une (surlignées) — desktop */}
            <div className="hidden lg:flex items-center">
              {RUBRIQUES_FEATURED.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="px-2.5 py-2.5 text-[13px] text-[#FFD700] hover:text-white transition-colors whitespace-nowrap font-medium"
                >
                  {r.label}
                </Link>
              ))}
              <span className="w-px h-4 bg-[#444] mx-1" aria-hidden="true" />
            </div>

            {/* Rubriques classiques — desktop */}
            <ul className="hidden md:flex items-center overflow-x-auto scrollbar-hide">
              {RUBRIQUES.map((rubrique) => (
                <li key={rubrique.href}>
                  <Link
                    href={rubrique.href}
                    className="block px-2.5 py-2.5 text-[13px] text-white hover:text-[#E9322D] transition-colors whitespace-nowrap"
                  >
                    {rubrique.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Bandeau live / fil info ── */}
      <div className="bg-white border-b border-[#D5D5D5]">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#6B6B6B]">{formattedDate}</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9322D] animate-pulse" />
                <span className="text-[11px] font-bold text-[#E9322D] uppercase tracking-wide">Live en cours</span>
              </span>
            </div>
            <p className="text-sm text-[#1D1D1B] truncate">
              Suivez l&apos;actualité en direct sur Le Monde
            </p>
            <Link
              href="/"
              className="shrink-0 ml-auto text-xs text-[#1D1D1B] border border-[#D5D5D5] rounded px-3 py-1.5 hover:bg-[#F5F5F5] transition-colors whitespace-nowrap font-medium"
            >
              Voir plus &rsaquo;
            </Link>
          </div>
        </div>
      </div>

      {/* ── Menu mobile déroulant ── */}
      {mobileMenuOpen && (
        <nav id="mobile-menu" className="md:hidden bg-[#1D1D1B] border-t border-[#333] absolute w-full z-50" aria-label="Navigation mobile">
          <ul className="flex flex-col max-h-[70vh] overflow-y-auto">
            {ALL_RUBRIQUES.map((rubrique, i) => (
              <li key={rubrique.href} className={`border-b border-[#333] ${i === RUBRIQUES_FEATURED.length - 1 ? 'border-b-2 border-[#444]' : ''}`}>
                <Link
                  href={rubrique.href}
                  className={`block px-6 py-3 text-sm transition-colors tracking-wide ${
                    i < RUBRIQUES_FEATURED.length
                      ? 'text-[#FFD700] hover:text-white font-medium'
                      : 'text-white hover:text-[#E9322D]'
                  } hover:bg-[#2a2a28]`}
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon espace — {userName}
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-6 py-3 text-sm text-[#E9322D] hover:bg-[#2a2a28] transition-colors tracking-wide uppercase"
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
