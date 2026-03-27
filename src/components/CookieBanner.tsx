'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { shouldShowBanner, setConsent } from '@/lib/cookieConsent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShowBanner());
  }, []);

  const handleChoice = (value: 'true' | 'false') => {
    setConsent(value);
    window.dispatchEvent(new Event('consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-[#1D1D1B] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
    >
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 id="cookie-banner-title" className="text-base font-bold text-[#1D1D1B] font-sans mb-1">
              Gestion des cookies
            </h3>
            <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site, personnaliser
              le contenu et analyser notre trafic. En cliquant sur &laquo;&nbsp;Accepter&nbsp;&raquo;,
              vous consentez à l&apos;utilisation de ces cookies. Pour en savoir plus, consultez notre{' '}
              <Link
                href="/politique-de-confidentialite"
                className="text-[#E9322D] underline hover:no-underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => handleChoice('false')}
              className="min-h-[44px] px-5 py-2.5 border border-[#D5D5D5] text-[#1D1D1B] text-sm font-sans font-semibold hover:bg-[#F5F5F5] transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={() => handleChoice('true')}
              className="min-h-[44px] px-5 py-2.5 bg-[#1D1D1B] text-white text-sm font-sans font-semibold hover:bg-[#333] transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
