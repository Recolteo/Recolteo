"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { DocType } from "@/src/lib/supabase/documents-types";

const DB_COL: Record<DocType, "rib" | "kbis" | "piece_identite"> = {
  rib: "rib",
  kbis: "kbis",
  identite: "piece_identite",
};

async function getEntityContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return null;

  const [{ data: commercant }, { data: association }] = await Promise.all([
    admin.from("commercant").select("id_commercant").eq("id_user", userRow.id_user).maybeSingle(),
    admin.from("association").select("id_association").eq("id_user", userRow.id_user).maybeSingle(),
  ]);

  if (commercant) return { admin, entityId: commercant.id_commercant, entityType: "commercant" as const };
  if (association) return { admin, entityId: association.id_association, entityType: "association" as const };
  return null;
}

export async function syncDocUpload(type: DocType, path: string) {
  const ctx = await getEntityContext();
  if (!ctx) return;
  const { admin, entityId, entityType } = ctx;
  const col = DB_COL[type];

  const { data: existing, error: selectError } = await admin
    .from("document")
    .select("id_document")
    .eq("id_entity", entityId)
    .eq("type_entity", entityType)
    .maybeSingle();

  if (selectError) return;

  if (existing) {
    await admin.from("document").update({ [col]: path }).eq("id_document", existing.id_document);
  } else {
    await admin.from("document").insert({
      id_entity: entityId,
      type_entity: entityType,
      rib: col === "rib" ? path : "",
      kbis: col === "kbis" ? path : "",
      piece_identite: col === "piece_identite" ? path : "",
    });
  }
}

export async function syncDocDelete(type: DocType) {
  const ctx = await getEntityContext();
  if (!ctx) return;
  const { admin, entityId, entityType } = ctx;

  await admin
    .from("document")
    .update({ [DB_COL[type]]: "" })
    .eq("id_entity", entityId)
    .eq("type_entity", entityType);
}
