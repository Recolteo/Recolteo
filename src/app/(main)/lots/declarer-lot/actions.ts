"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

export type LotActionState = {
  error?: string;
};

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
  const categoryCustom = ((formData.get("category_custom") as string) || "").trim();
  const category = categorySelect === "autre" ? categoryCustom : categorySelect;

  const admin = createAdminClient();
  const { error } = await admin.from("lot").insert({
    id_commercant: parseInt(formData.get("id_commercant") as string, 10),
    name_entreprise: (formData.get("name_entreprise") as string).trim(),
    adresse: (formData.get("adresse") as string).trim(),
    adresse_recup: (formData.get("adresse_recup") as string).trim(),
    instructions: ((formData.get("instructions") as string) || "").trim() || null,
    category,
    nature: (formData.get("nature") as string).trim(),
    quantity: parseFloat(formData.get("quantity") as string),
    dlc: (formData.get("DLC") as string) || null,
    montant_chiffre: parseFloat(formData.get("montant_chiffre") as string),
    montant_lettre: (formData.get("montant_lettre") as string).trim(),
    statut: true,
  });

  if (error) {
    return { error: `Erreur lors de la déclaration : ${error.message}` };
  }

  redirect("/lots");
}
