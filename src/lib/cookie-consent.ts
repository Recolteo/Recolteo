export interface CookieConsent {
  analytiques: boolean;
  fonctionnels: boolean;
  geolocalisation: boolean;
  consented: boolean;
  consentedAt: string | null;
}

export const DEFAULT_CONSENT: CookieConsent = {
  analytiques: false,
  fonctionnels: false,
  geolocalisation: false,
  consented: false,
  consentedAt: null,
};

const KEY = "_rc";

// 12 mois (CNIL : maximum 13 mois)
const MAX_AGE = 365 * 24 * 60 * 60;

function parseRawCookie(raw: string): string | null {
  for (const part of document.cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === raw) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function isValidConsent(value: unknown): value is CookieConsent {
  const v = value as Record<string, unknown>;
  return (
    typeof value === "object" &&
    value !== null &&
    typeof v.analytiques === "boolean" &&
    typeof v.fonctionnels === "boolean" &&
    typeof v.geolocalisation === "boolean" &&
    typeof v.consented === "boolean"
  );
}

export function readCookieConsent(): CookieConsent {
  try {
    const raw = parseRawCookie(KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidConsent(parsed)) return DEFAULT_CONSENT;
    return {
      analytiques: parsed.analytiques,
      fonctionnels: parsed.fonctionnels,
      geolocalisation: parsed.geolocalisation,
      consented: parsed.consented,
      consentedAt: typeof parsed.consentedAt === "string" ? parsed.consentedAt : null,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

const CONSENT_CHANGE_EVENT =
  process.env.NEXT_PUBLIC_CONSENT_EVENT ?? "cc_change";

export function onConsentChange(callback: () => void): void {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
}

export function offConsentChange(callback: () => void): void {
  window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

let _openPanel: (() => void) | null = null;

export function registerOpenPanel(fn: () => void): () => void {
  _openPanel = fn;
  return () => { _openPanel = null; };
}

export function openCookiePanel(): void {
  _openPanel?.();
}

export function writeCookieConsent(consent: CookieConsent): void {
  const value = encodeURIComponent(
    JSON.stringify({
      analytiques: consent.analytiques,
      fonctionnels: consent.fonctionnels,
      geolocalisation: consent.geolocalisation,
      consented: consent.consented,
      consentedAt: new Date().toISOString(),
    })
  );
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${KEY}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Strict${secure}`;
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
