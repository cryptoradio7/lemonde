'use client';

import Link from 'next/link';

const rubriquesLinks = [
  { label: 'Politique', href: '/rubrique/politique' },
  { label: 'International', href: '/rubrique/international' },
  { label: 'Économie', href: '/rubrique/economie' },
  { label: 'Culture', href: '/rubrique/culture' },
  { label: 'Sport', href: '/rubrique/sport' },
  { label: 'Sciences', href: '/rubrique/sciences' },
  { label: 'Idées', href: '/rubrique/idees' },
  { label: 'Société', href: '/rubrique/societe' },
];

const aProposLinks = [
  { label: 'Qui sommes-nous', href: '/a-propos' },
  { label: 'Contactez-nous', href: '/contact' },
  { label: 'Publicité', href: '/publicite' },
  { label: 'Emploi', href: '/emploi' },
];

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
  { label: 'Conditions d\'utilisation', href: '/conditions-utilisation' },
  { label: 'Gestion des cookies', href: '/gestion-cookies' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1D1D1B] text-white">
      {/* Newsletter section */}
      <div className="border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto text-center">
            <h3
              className="text-xl mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Inscrivez-vous à notre newsletter
            </h3>
            <p className="text-sm text-[#999] mb-4 font-sans">
              Recevez chaque matin l&apos;essentiel de l&apos;actualité.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="flex-1 px-4 py-2.5 bg-[#2a2a28] border border-[#444] text-white text-sm font-sans placeholder-[#888] focus:outline-none focus:border-[#E9322D] transition-colors"
                aria-label="Adresse e-mail"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E9322D] text-white text-sm font-sans font-semibold hover:bg-[#c72a26] transition-colors uppercase tracking-wide"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links columns */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo column */}
          <div>
            <Link href="/">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Le Monde
              </span>
            </Link>
            <p className="text-sm text-[#999] mt-3 font-sans leading-relaxed">
              Le site d&apos;information en ligne de référence en France et dans le monde francophone.
            </p>
            {/* Social media icons */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://twitter.com/lemondefr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/lemonde.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/le-monde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/lemondefr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Rubriques */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider mb-4 text-[#ccc]">
              Rubriques
            </h4>
            <ul className="space-y-2">
              {rubriquesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[#999] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider mb-4 text-[#ccc]">
              À propos
            </h4>
            <ul className="space-y-2">
              {aProposLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[#999] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider mb-4 text-[#ccc]">
              Légal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[#999] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-[#666] font-sans">
            &copy; {new Date().getFullYear()} Le Monde. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
