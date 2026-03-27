const CONSENT_KEY = 'cookie_consent';

/**
 * Lit le consentement depuis localStorage.
 * Retourne 'true' | 'false' | null (non défini) | 'unavailable' (storage inaccessible).
 */
export function getConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return 'unavailable';
  }
}

/**
 * Enregistre le consentement dans localStorage.
 * Retourne true si la sauvegarde a réussi, false sinon.
 */
export function setConsent(value: 'true' | 'false'): boolean {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Indique si le bandeau cookie doit être affiché.
 * Vrai si aucun choix n'a été enregistré ou si localStorage est inaccessible.
 */
export function shouldShowBanner(): boolean {
  const consent = getConsent();
  return consent === null || consent === 'unavailable';
}
