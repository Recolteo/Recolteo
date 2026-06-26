/** Returns "YYYY-MM-DD" in Europe/Paris timezone. */
export function parisDateStr(date: Date): string {
  const p = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return `${p.find((x) => x.type === "year")!.value}-${p.find((x) => x.type === "month")!.value}-${p.find((x) => x.type === "day")!.value}`;
}

/**
 * Converts a date+slot (both in Europe/Paris local time) to an unambiguous UTC
 * ISO string, e.g. "2026-06-22T10:00:00+02:00".
 * @param dateStr "YYYY-MM-DD"
 * @param slot    "HH:MM"
 */
export function toParisISOString(dateStr: string, slot: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const noon = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  const tz =
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      timeZoneName: "shortOffset",
    })
      .formatToParts(noon)
      .find((p) => p.type === "timeZoneName")?.value ?? "UTC+1";
  const offH = parseInt(tz.replace("UTC", "") || "1");
  const sign = offH >= 0 ? "+" : "-";
  return `${dateStr}T${slot}:00${sign}${String(Math.abs(offH)).padStart(2, "0")}:00`;
}

/**
 * Formats a créneau ISO string for display in French (Europe/Paris timezone).
 * Returns e.g. "lundi 22 juin 2026 de 10:00 à 12:00"
 */
export function formatCreneauParis(iso: string): string {
  const date = new Date(iso);
  const dateStr = date.toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const h1 = date.toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });
  const h2 = new Date(date.getTime() + 2 * 3600_000).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} de ${h1} à ${h2}`;
}
