/**
 * Tests — lib/cookieConsent.ts
 * Couvre : getConsent, setConsent, shouldShowBanner
 */

import { getConsent, setConsent, shouldShowBanner } from '@/lib/cookieConsent';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

// ─── getConsent ───────────────────────────────────────────────────────────────

describe('getConsent', () => {
  it('retourne null si aucun consentement enregistré', () => {
    expect(getConsent()).toBeNull();
  });

  it('retourne "true" après acceptation', () => {
    localStorageMock.setItem('cookie_consent', 'true');
    expect(getConsent()).toBe('true');
  });

  it('retourne "false" après refus', () => {
    localStorageMock.setItem('cookie_consent', 'false');
    expect(getConsent()).toBe('false');
  });

  it('retourne "unavailable" si localStorage lance une erreur', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('SecurityError'); });
    expect(getConsent()).toBe('unavailable');
  });
});

// ─── setConsent ───────────────────────────────────────────────────────────────

describe('setConsent', () => {
  it('enregistre "true" et retourne true', () => {
    const result = setConsent('true');
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cookie_consent', 'true');
  });

  it('enregistre "false" et retourne true', () => {
    const result = setConsent('false');
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cookie_consent', 'false');
  });

  it('retourne false si localStorage lance une erreur', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('QuotaExceededError'); });
    const result = setConsent('true');
    expect(result).toBe(false);
  });
});

// ─── shouldShowBanner ─────────────────────────────────────────────────────────

describe('shouldShowBanner', () => {
  it('retourne true si aucun consentement enregistré', () => {
    expect(shouldShowBanner()).toBe(true);
  });

  it('retourne false si consentement = "true"', () => {
    localStorageMock.setItem('cookie_consent', 'true');
    expect(shouldShowBanner()).toBe(false);
  });

  it('retourne false si consentement = "false"', () => {
    localStorageMock.setItem('cookie_consent', 'false');
    expect(shouldShowBanner()).toBe(false);
  });

  it('retourne true si localStorage est inaccessible', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('SecurityError'); });
    expect(shouldShowBanner()).toBe(true);
  });
});
