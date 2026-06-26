"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

export async function supprimerLot(id: number): Promise<void> {
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
          .select("id_commercant")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!adminResult.data && !commercantResult.data) redirect("/lots");

  const adminClient = createAdminClient();

  let deleteQuery = adminClient.from("lot").delete().eq("id_lot", id);
  if (commercantResult.data && !adminResult.data) {
    deleteQuery = deleteQuery.eq(
      "id_commercant",
      commercantResult.data.id_commercant,
    );
  }
  await deleteQuery;
  revalidateTag("lots", "max");
  redirect("/lots");
}
