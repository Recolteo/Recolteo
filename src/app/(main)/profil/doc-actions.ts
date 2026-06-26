"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { notifyAdminDocumentsReady } from "@/src/lib/email";

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

export async function notifyDocumentsModified(): Promise<{ success: boolean; error?: string }> {
  const ctx = await getEntityContext();
  if (!ctx) return { success: false, error: "Contexte introuvable." };
  const { admin, entityId, entityType } = ctx;

  const { data: doc } = await admin
    .from("document")
    .select("rib, kbis, piece_identite, notification_sent")
    .eq("id_entity", entityId)
    .eq("type_entity", entityType)
    .maybeSingle();

  if (!doc?.rib || !doc.kbis || !doc.piece_identite)
    return { success: false, error: "Les 3 documents doivent être déposés avant de confirmer." };

  if (doc.notification_sent)
    return { success: false, error: "L'équipe a déjà été notifiée." };

  const { data: entityData } = await (entityType === "commercant"
    ? admin.from("commercant").select("name_entreprise").eq("id_commercant", entityId).maybeSingle()
    : admin.from("association").select("name_entreprise").eq("id_association", entityId).maybeSingle());

  await notifyAdminDocumentsReady({
    nameEntreprise: entityData?.name_entreprise ?? `${entityType}#${entityId}`,
    role: entityType,
    isModification: true,
  });

  await admin
    .from("document")
    .update({ notification_sent: true })
    .eq("id_entity", entityId)
    .eq("type_entity", entityType);

  return { success: true };
}
