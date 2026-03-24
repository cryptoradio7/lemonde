'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function PlausibleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (stored === 'true') {
      setConsent(true);
    }

    const handler = () => {
      const updated = localStorage.getItem('cookie_consent');
      setConsent(updated === 'true');
    };
    window.addEventListener('storage', handler);
    window.addEventListener('consent-updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('consent-updated', handler);
    };
  }, []);

  if (!consent) return null;

  return (
    <Script
      defer
      data-domain="lemonde-clone.vercel.app"
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
