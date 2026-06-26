"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { Horaire } from "@/src/components/ui/cards/LotCard";

export type LotEditState = {
  error?: string;
};

export async function modifierLot(
  id: number,
  _prev: LotEditState,
  formData: FormData,
): Promise<LotEditState> {
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

  const adminClient = createAdminClient();

  const categorySelect = formData.get("category_select") as string;
  const categoryCustom = (
    (formData.get("category_custom") as string) || ""
  ).trim();
  const category = categorySelect === "autre" ? categoryCustom : categorySelect;

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

  let updateQuery = adminClient
    .from("lot")
    .update({
      adresse_recup: (formData.get("adresse_recup") as string).trim(),
      instructions:
        ((formData.get("instructions") as string) || "").trim() || null,
      category,
      nature: (formData.get("nature") as string).trim(),
      quantity: quantityRaw,
      dlc: (formData.get("DLC") as string) || null,
      montant_chiffre: montantRaw,
      montant_lettre: (formData.get("montant_lettre") as string).trim(),
      horaires,
    })
    .eq("id_lot", id);

  if (commercantResult.data && !adminResult.data) {
    updateQuery = updateQuery.eq(
      "id_commercant",
      commercantResult.data.id_commercant,
    );
  }

  const { error } = await updateQuery;

  if (error) {
    return { error: `Erreur lors de la modification : ${error.message}` };
  }

  redirect("/lots");
}
