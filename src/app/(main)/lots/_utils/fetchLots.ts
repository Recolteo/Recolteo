import { redirect } from "next/navigation";
import { cacheTag, cacheLife } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { geocodeAddress } from "@/src/lib/geocode";
import type { Lot } from "@/src/components/ui/cards/LotCard";

const LOT_FIELDS =
  "id_lot, id_commercant, name_entreprise, adresse, adresse_recup, instructions, category, nature, quantity, dlc, montant_chiffre, montant_lettre, created_at, lat, lng, horaires";

export type LotPageData =
  | { view: "docs-gate" }
  | { view: "subscription-gate" }
  | { view: "commercant"; lots: Lot[] }
  | { view: "admin"; lots: Lot[] }
  | { view: "association"; lots: Lot[]; assoCoords: { lat: number; lng: number } | null };

async function getAvailableLots(): Promise<Lot[]> {
  "use cache";
  cacheTag("lots");
  cacheLife({ stale: 30, revalidate: 60 });
  const today = new Date().toISOString().split("T")[0];
  const admin = createAdminClient();
  const { data } = await admin
    .from("lot")
    .select(LOT_FIELDS)
    .eq("statut", true)
    .or(`dlc.is.null,dlc.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(500);
  return (data ?? []) as Lot[];
}

export async function fetchLotsData(): Promise<LotPageData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    userRow
      ? supabase
          .from("commercant")
          .select("id_commercant")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isAdmin = !!adminResult.data;
  const isCommercant = !!commercantResult.data;
  const adminClient = createAdminClient();

  if (isCommercant && !isAdmin) {
    const { data: docRow } = await adminClient
      .from("document")
      .select("rib_validated, kbis_validated, piece_identite_validated")
      .eq("type_entity", "commercant")
      .eq("id_entity", commercantResult.data!.id_commercant)
      .maybeSingle();
    if (!docRow?.rib_validated || !docRow?.kbis_validated || !docRow?.piece_identite_validated)
      return { view: "docs-gate" };

    const { data: lotsData } = await supabase
      .from("lot")
      .select(LOT_FIELDS)
      .eq("statut", true)
      .eq("id_commercant", commercantResult.data!.id_commercant)
      .order("created_at", { ascending: false });

    return { view: "commercant", lots: (lotsData ?? []) as Lot[] };
  }

  const lots = await getAvailableLots();

  if (isAdmin) return { view: "admin", lots };

  if (!userRow) redirect("/profil");

  const { data: assoRow } = await supabase
    .from("association")
    .select("id_association, lat, lng, adresse")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!assoRow) redirect("/profil");

  const { data: docRow } = await adminClient
    .from("document")
    .select("rib_validated, kbis_validated, piece_identite_validated")
    .eq("type_entity", "association")
    .eq("id_entity", assoRow.id_association)
    .maybeSingle();
  if (!docRow?.rib_validated || !docRow?.kbis_validated || !docRow?.piece_identite_validated)
    return { view: "docs-gate" };

  const { data: subRow } = await adminClient
    .from("association")
    .select("stripe_subscription_status")
    .eq("id_association", assoRow.id_association)
    .maybeSingle();

  const subStatus = subRow?.stripe_subscription_status ?? "none";
  if (subStatus !== "active" && subStatus !== "trialing")
    return { view: "subscription-gate" };

  let assoCoords: { lat: number; lng: number } | null = null;
  if (assoRow.lat && assoRow.lng) {
    assoCoords = { lat: assoRow.lat, lng: assoRow.lng };
  } else if (assoRow.adresse) {
    const coords = await geocodeAddress(assoRow.adresse);
    if (coords) {
      assoCoords = coords;
      void (async () => {
        try {
          await adminClient
            .from("association")
            .update({ lat: coords.lat, lng: coords.lng })
            .eq("id_user", userRow.id_user);
        } catch (err) {
          console.error("[geocode] Échec mise en cache coordonnées:", err instanceof Error ? err.message : String(err));
        }
      })();
    }
  }

  return { view: "association", lots, assoCoords };
}
