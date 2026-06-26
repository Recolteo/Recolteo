export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const base = process.env.BAN_GEOCODE_URL;
    if (!base) return null;
    const url = `${base}?q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const [lng, lat] = feature.geometry.coordinates as [number, number];
    return { lat, lng };
  } catch {
    return null;
  }
}
