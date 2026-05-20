export interface CookieConsent {
  analytiques: boolean;
  fonctionnels: boolean;
  consented: boolean;
}

export const DEFAULT_CONSENT: CookieConsent = {
  analytiques: false,
  fonctionnels: false,
  consented: false,
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
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).analytiques === "boolean" &&
    typeof (value as Record<string, unknown>).fonctionnels === "boolean" &&
    typeof (value as Record<string, unknown>).consented === "boolean"
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
      consented: parsed.consented,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function writeCookieConsent(consent: CookieConsent): void {
  const value = encodeURIComponent(
    JSON.stringify({
      analytiques: consent.analytiques,
      fonctionnels: consent.fonctionnels,
      consented: consent.consented,
    })
  );
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${KEY}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Strict${secure}`;
}
