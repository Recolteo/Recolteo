import "server-only";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Non autorisé", { status: 401 });

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  const empty = {
    rib: false, kbis: false, identite: false,
    rib_validated: false, kbis_validated: false, piece_identite_validated: false,
    notification_sent: false,
  };
  if (!userRow) return Response.json(empty);

  const [{ data: com }, { data: asso }] = await Promise.all([
    admin.from("commercant").select("id_commercant").eq("id_user", userRow.id_user).maybeSingle(),
    admin.from("association").select("id_association").eq("id_user", userRow.id_user).maybeSingle(),
  ]);

  const entityId = com?.id_commercant ?? asso?.id_association;
  const entityType = com ? "commercant" : asso ? "association" : null;
  if (!entityId || !entityType) return Response.json(empty);

  const { data: doc } = await admin
    .from("document")
    .select("rib, kbis, piece_identite, rib_validated, kbis_validated, piece_identite_validated, notification_sent")
    .eq("id_entity", entityId)
    .eq("type_entity", entityType)
    .maybeSingle();

  return Response.json({
    rib: !!doc?.rib,
    kbis: !!doc?.kbis,
    identite: !!doc?.piece_identite,
    rib_validated: doc?.rib_validated ?? false,
    kbis_validated: doc?.kbis_validated ?? false,
    piece_identite_validated: doc?.piece_identite_validated ?? false,
    notification_sent: doc?.notification_sent ?? false,
  });
}
