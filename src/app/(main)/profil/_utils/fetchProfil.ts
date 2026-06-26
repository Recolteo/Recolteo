import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { EntityInfo } from "../_components/tabs/InfoTab";

export async function fetchProfilData(): Promise<EntityInfo> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("nom, prenom")
    .maybeSingle();

  if (adminRow) return { role: "admin", nom: adminRow.nom, prenom: adminRow.prenom };

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) redirect("/");

  const [{ data: commercant }, { data: association }] = await Promise.all([
    supabase
      .from("commercant")
      .select("name_entreprise, email, tel, siret, type_activity, forme_juridique, adresse, code_postal")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
    supabase
      .from("association")
      .select("name_entreprise, email, tel, rna, type_asso, adresse, code_postal")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
  ]);

  if (commercant) return { role: "commercant", ...commercant };

  if (association) {
    const admin = createAdminClient();
    const { data: assocRow } = await admin
      .from("association")
      .select("id_association, cagnotte_reset_at")
      .eq("id_user", userRow.id_user)
      .maybeSingle();

    let cagnotte = 0;
    if (assocRow) {
      const { data: collects } = await admin
        .from("collect")
        .select("code_valide_at, lot:id_lot(montant_chiffre)")
        .eq("id_association", assocRow.id_association)
        .eq("statut", true);
      const resetAt = assocRow.cagnotte_reset_at;
      cagnotte = (collects ?? []).reduce((sum, c) => {
        const validatedAt = (c as { code_valide_at?: string | null }).code_valide_at ?? null;
        if (resetAt && validatedAt && validatedAt <= resetAt) return sum;
        return sum + (((c.lot as unknown as { montant_chiffre: number } | null)?.montant_chiffre ?? 0) * 0.02);
      }, 0);
    }

    return { role: "association", ...association, cagnotte };
  }

  redirect("/");
}
