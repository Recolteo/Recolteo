import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { geocodeAddress } from "@/src/lib/geocode";
import type { Lot } from "@/src/components/ui/cards/LotCard";

const LOT_FIELDS =
  "id_lot, id_commercant, name_entreprise, adresse, adresse_recup, instructions, category, nature, quantity, dlc, montant_chiffre, montant_lettre, created_at, lat, lng, horaires";

export type LotPageData =
  | { view: "docs-gate" }
  | { view: "commercant"; lots: Lot[] }
  | { view: "admin"; lots: Lot[] }
  | { view: "association"; lots: Lot[]; assoCoords: { lat: number; lng: number } | null };

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

  const { data: lotsData } = await supabase
    .from("lot")
    .select(LOT_FIELDS)
    .eq("statut", true)
    .order("created_at", { ascending: false });
  const lots = (lotsData ?? []) as Lot[];

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

  let assoCoords: { lat: number; lng: number } | null = null;
  if (assoRow.lat && assoRow.lng) {
    assoCoords = { lat: assoRow.lat, lng: assoRow.lng };
  } else if (assoRow.adresse) {
    const coords = await geocodeAddress(assoRow.adresse);
    if (coords) {
      assoCoords = coords;
      await adminClient
        .from("association")
        .update({ lat: coords.lat, lng: coords.lng })
        .eq("id_user", userRow.id_user);
    }
  }

  return { view: "association", lots, assoCoords };
}
