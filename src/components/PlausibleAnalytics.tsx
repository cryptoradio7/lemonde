'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getConsent } from '@/lib/cookieConsent';

export default function PlausibleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(getConsent() === 'true');

    const handler = () => {
      setConsent(getConsent() === 'true');
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
