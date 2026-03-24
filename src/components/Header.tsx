'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const rubriques = [
  { label: 'Politique', href: '/rubrique/politique' },
  { label: 'International', href: '/rubrique/international' },
  { label: 'Économie', href: '/rubrique/economie' },
  { label: 'Culture', href: '/rubrique/culture' },
  { label: 'Sport', href: '/rubrique/sport' },
  { label: 'Sciences', href: '/rubrique/sciences' },
  { label: 'Idées', href: '/rubrique/idees' },
  { label: 'Société', href: '/rubrique/societe' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header
      className={`w-full bg-white border-b border-[#D5D5D5] z-50 transition-shadow duration-200 ${
        isSticky ? 'fixed top-0 left-0 shadow-md' : 'relative'
      }`}
    >
      {/* Top bar */}
      <div className="border-b border-[#D5D5D5]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-[#6B6B6B] font-sans capitalize hidden sm:block">
            {formattedDate}
          </span>

          <Link href="/" className="mx-auto sm:mx-0">
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1B]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Le Monde
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/recherche"
              className="text-[#1D1D1B] hover:text-[#E9322D] transition-colors"
              aria-label="Rechercher"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            <button
              className="md:hidden text-[#1D1D1B] hover:text-[#E9322D] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:block bg-[#1D1D1B]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-0">
            {rubriques.map((rubrique) => (
              <li key={rubrique.href}>
                <Link
                  href={rubrique.href}
                  className="block px-4 py-3 text-sm font-sans text-white hover:text-[#E9322D] transition-colors tracking-wide uppercase"
                >
                  {rubrique.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#1D1D1B] border-t border-[#333]">
          <ul className="flex flex-col">
            {rubriques.map((rubrique) => (
              <li key={rubrique.href} className="border-b border-[#333] last:border-b-0">
                <Link
                  href={rubrique.href}
                  className="block px-6 py-3 text-sm font-sans text-white hover:text-[#E9322D] hover:bg-[#2a2a28] transition-colors tracking-wide uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {rubrique.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
