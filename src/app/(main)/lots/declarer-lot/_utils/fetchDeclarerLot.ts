import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { LotFormProps } from "../_components/types";

export async function fetchDeclarerLotData(): Promise<LotFormProps> {
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

  if (!adminResult.data && !commercantResult.data) redirect("/");

  if (commercantResult.data && !adminResult.data) {
    const adminClient = createAdminClient();
    const { data: docRow } = await adminClient
      .from("document")
      .select("rib_validated, kbis_validated, piece_identite_validated")
      .eq("type_entity", "commercant")
      .eq("id_entity", commercantResult.data.id_commercant)
      .maybeSingle();
    const docsApproved =
      docRow?.rib_validated &&
      docRow?.kbis_validated &&
      docRow?.piece_identite_validated;
    if (!docsApproved) redirect("/lots");
  }

  if (adminResult.data) {
    const { data: merchants } = await supabase
      .from("commercant")
      .select("id_commercant, name_entreprise, adresse")
      .eq("is_validated", true)
      .order("name_entreprise");

    return {
      mode: "admin",
      merchants: (merchants ?? []).map((m) => ({
        id: m.id_commercant,
        name: m.name_entreprise,
        adresse: m.adresse,
      })),
    };
  }

  const { id_commercant, name_entreprise, adresse } = commercantResult.data!;
  return {
    mode: "commercant",
    id: id_commercant,
    name: name_entreprise,
    adresse,
  };
}
