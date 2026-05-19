"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();
  if (!adminRow) redirect("/");

  return supabase;
}

export async function validateProfile(formData: FormData) {
  await assertAdmin();

  const type = formData.get("type") as "commercant" | "association";
  const id = parseInt(formData.get("id") as string, 10);

  const admin = createAdminClient();

  if (type === "commercant") {
    await admin
      .from("commercant")
      .update({ is_validated: true })
      .eq("id_commercant", id);
  } else {
    await admin
      .from("association")
      .update({ is_validated: true })
      .eq("id_association", id);
  }

  revalidatePath("/admin");
}

export async function rejectProfile(formData: FormData) {
  await assertAdmin();

  const type = formData.get("type") as "commercant" | "association";
  const id = parseInt(formData.get("id") as string, 10);
  const admin = createAdminClient();

  if (type === "commercant") {
    const { data } = await admin
      .from("commercant")
      .select("id_user")
      .eq("id_commercant", id)
      .single();
    if (data) {
      await admin.from("commercant").delete().eq("id_commercant", id);
      const { data: userRow } = await admin
        .from("user")
        .select("auth_id")
        .eq("id_user", data.id_user)
        .single();
      if (userRow?.auth_id) {
        await admin.auth.admin.deleteUser(userRow.auth_id);
      }
      await admin.from("user").delete().eq("id_user", data.id_user);
    }
  } else {
    const { data } = await admin
      .from("association")
      .select("id_user")
      .eq("id_association", id)
      .single();
    if (data) {
      await admin.from("association").delete().eq("id_association", id);
      const { data: userRow } = await admin
        .from("user")
        .select("auth_id")
        .eq("id_user", data.id_user)
        .single();
      if (userRow?.auth_id) {
        await admin.auth.admin.deleteUser(userRow.auth_id);
      }
      await admin.from("user").delete().eq("id_user", data.id_user);
    }
  }

  revalidatePath("/admin");
}
