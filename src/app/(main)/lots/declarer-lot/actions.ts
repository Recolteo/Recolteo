"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { geocodeAddress } from "@/src/lib/geocode";
import type { Horaire } from "@/src/components/ui/cards/LotCard";

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
  horaires: Horaire[];
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
          .select("id_commercant, name_entreprise, adresse")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!adminResult.data && !commercantResult.data) {
    return { error: "Accès refusé." };
  }

  if (rows.length > 200) {
    return { error: "Maximum 200 lots par import." };
  }

  const id =
    adminResult.data && commercantId
      ? commercantId
      : commercantResult.data?.id_commercant;

  if (!id) return { error: "Commerçant introuvable." };

  const admin = createAdminClient();

  let name = commercantResult.data?.name_entreprise ?? "";
  let adresse = commercantResult.data?.adresse ?? "";

  if (adminResult.data && commercantId) {
    const { data: targetCommercant } = await admin
      .from("commercant")
      .select("name_entreprise, adresse")
      .eq("id_commercant", commercantId)
      .maybeSingle();
    name = targetCommercant?.name_entreprise ?? "";
    adresse = targetCommercant?.adresse ?? "";
  }

  const { data: inserted, error } = await admin
    .from("lot")
    .insert(
      rows.map((row) => ({
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
        horaires: row.horaires,
        statut: true,
      })),
    )
    .select("id_lot, adresse_recup");

  if (error || !inserted?.length) {
    return { error: "Erreur lors de l'import des lots." };
  }

  revalidateTag("lots", "max");

  after(async () => {
    const BATCH_SIZE = 10;
    for (let i = 0; i < inserted.length; i += BATCH_SIZE) {
      await Promise.all(
        inserted.slice(i, i + BATCH_SIZE).map(async (lot) => {
          const coords = await geocodeAddress(lot.adresse_recup);
          if (coords) {
            await admin.from("lot").update({ lat: coords.lat, lng: coords.lng }).eq("id_lot", lot.id_lot);
          }
        }),
      );
    }
  });

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
          .select("id_commercant, name_entreprise, adresse")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
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

  const quantityRaw = parseFloat(formData.get("quantity") as string);
  const montantRaw = parseFloat(formData.get("montant_chiffre") as string);
  if (isNaN(quantityRaw) || quantityRaw <= 0) return { error: "Quantité invalide." };
  if (isNaN(montantRaw) || montantRaw < 0) return { error: "Montant invalide." };

  let horaires: Horaire[] = [];
  try {
    horaires = JSON.parse((formData.get("horaires") as string) || "[]") as Horaire[];
  } catch {
    horaires = [];
  }

  const isAdmin = !!adminResult.data;
  const idCommercant = isAdmin
    ? parseInt(formData.get("id_commercant") as string, 10)
    : commercantResult.data!.id_commercant;
  const nameEntreprise = isAdmin
    ? (formData.get("name_entreprise") as string).trim()
    : (commercantResult.data as { id_commercant: number; name_entreprise: string; adresse: string }).name_entreprise;
  const adresseEntreprise = isAdmin
    ? (formData.get("adresse") as string).trim()
    : (commercantResult.data as { id_commercant: number; name_entreprise: string; adresse: string }).adresse;

  const admin = createAdminClient();
  const { data: inserted, error } = await admin
    .from("lot")
    .insert({
      id_commercant: idCommercant,
      name_entreprise: nameEntreprise,
      adresse: adresseEntreprise,
      adresse_recup,
      instructions:
        ((formData.get("instructions") as string) || "").trim() || null,
      category,
      nature: (formData.get("nature") as string).trim(),
      quantity: quantityRaw,
      dlc: (formData.get("DLC") as string) || null,
      montant_chiffre: montantRaw,
      montant_lettre: (formData.get("montant_lettre") as string).trim(),
      horaires,
      statut: true,
    })
    .select("id_lot")
    .single();

  if (error || !inserted) {
    return { error: "Erreur lors de la déclaration du lot." };
  }

  revalidateTag("lots", "max");

  after(async () => {
    const coords = await geocodeAddress(adresse_recup);
    if (coords) {
      await admin
        .from("lot")
        .update({ lat: coords.lat, lng: coords.lng })
        .eq("id_lot", inserted.id_lot);
    }
  });

  redirect("/lots");
}
