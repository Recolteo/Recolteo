"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { geocodeAddress } from "@/src/lib/geocode";

export type LotActionState = {
  error?: string;
};

export type LotImportRow = {
  nature: string;
  category: string;
  quantity: number;
  dlc: string | null;
  montant_chiffre: number;
  montant_lettre: string;
  adresse_recup: string;
  instructions: string | null;
};

export async function importerLots(
  rows: LotImportRow[],
  commercantId?: number,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    supabase
      .from("commercant")
      .select("id_commercant, name_entreprise, adresse")
      .eq("is_validated", true)
      .maybeSingle(),
  ]);

  if (!adminResult.data && !commercantResult.data) {
    return { error: "Accès refusé." };
  }

  const id =
    adminResult.data && commercantId
      ? commercantId
      : commercantResult.data?.id_commercant;
  const name = commercantResult.data?.name_entreprise ?? "";
  const adresse = commercantResult.data?.adresse ?? "";

  if (!id) return { error: "Commerçant introuvable." };

  const admin = createAdminClient();

  for (const row of rows) {
    const { data: inserted, error } = await admin
      .from("lot")
      .insert({
        id_commercant: id,
        name_entreprise: name,
        adresse,
        adresse_recup: row.adresse_recup,
        instructions: row.instructions,
        category: row.category,
        nature: row.nature,
        quantity: row.quantity,
        dlc: row.dlc,
        montant_chiffre: row.montant_chiffre,
        montant_lettre: row.montant_lettre,
        statut: true,
      })
      .select("id_lot")
      .single();

    if (error || !inserted) {
      return { error: `Erreur sur le lot "${row.nature}" : ${error?.message}` };
    }

    const coords = await geocodeAddress(row.adresse_recup);
    if (coords) {
      await admin
        .from("lot")
        .update({ lat: coords.lat, lng: coords.lng })
        .eq("id_lot", inserted.id_lot);
    }
  }

  return {};
}

export async function declarerLot(
  _prev: LotActionState,
  formData: FormData,
): Promise<LotActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    supabase
      .from("commercant")
      .select("id_commercant")
      .eq("is_validated", true)
      .maybeSingle(),
  ]);

  if (!adminResult.data && !commercantResult.data) {
    return { error: "Accès refusé." };
  }

  const categorySelect = formData.get("category_select") as string;
  const categoryCustom = (
    (formData.get("category_custom") as string) || ""
  ).trim();
  const category = categorySelect === "autre" ? categoryCustom : categorySelect;

  const adresse_recup = (formData.get("adresse_recup") as string).trim();
  const admin = createAdminClient();
  const { data: inserted, error } = await admin
    .from("lot")
    .insert({
      id_commercant: parseInt(formData.get("id_commercant") as string, 10),
      name_entreprise: (formData.get("name_entreprise") as string).trim(),
      adresse: (formData.get("adresse") as string).trim(),
      adresse_recup,
      instructions:
        ((formData.get("instructions") as string) || "").trim() || null,
      category,
      nature: (formData.get("nature") as string).trim(),
      quantity: parseFloat(formData.get("quantity") as string),
      dlc: (formData.get("DLC") as string) || null,
      montant_chiffre: parseFloat(formData.get("montant_chiffre") as string),
      montant_lettre: (formData.get("montant_lettre") as string).trim(),
      statut: true,
    })
    .select("id_lot")
    .single();

  if (error || !inserted) {
    return { error: `Erreur lors de la déclaration : ${error?.message}` };
  }

  const coords = await geocodeAddress(adresse_recup);
  if (coords) {
    await admin
      .from("lot")
      .update({ lat: coords.lat, lng: coords.lng })
      .eq("id_lot", inserted.id_lot);
  }

  redirect("/lots");
}
