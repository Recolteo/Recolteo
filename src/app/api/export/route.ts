import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Non autorisé", { status: 401 });

  const admin = createAdminClient();

  const { data: userRow } = await admin
    .from("user")
    .select("id_user, email, nom")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!userRow) return new Response("Profil introuvable", { status: 404 });

  const [{ data: commercant }, { data: association }] = await Promise.all([
    admin.from("commercant")
      .select("name_entreprise, tel, adresse, siret, forme_juridique, type_activity, is_validated")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
    admin.from("association")
      .select("name_entreprise, tel, adresse, rna, type_asso, is_validated")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
  ]);

  const commercantRow = commercant
    ? (await admin.from("commercant").select("id_commercant").eq("id_user", userRow.id_user).maybeSingle()).data
    : null;
  const assoRow = association
    ? (await admin.from("association").select("id_association").eq("id_user", userRow.id_user).maybeSingle()).data
    : null;

  const [{ data: lots }, { data: collects }] = await Promise.all([
    commercantRow
      ? admin.from("lot").select("nature, category, quantity, montant_chiffre, montant_lettre, adresse_recup, date_mise_en_ligne, statut").eq("id_commercant", commercantRow.id_commercant)
      : Promise.resolve({ data: [] }),
    assoRow
      ? admin.from("collect").select("date, creneau, statut").eq("id_association", assoRow.id_association)
      : Promise.resolve({ data: [] }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    base_legale: "Article 20 du Règlement (UE) 2016/679 (RGPD) — Droit à la portabilité",
    responsable: "Récoltéo",
    compte: {
      email: userRow.email,
      nom: userRow.nom,
    },
    structure: commercant ?? association ?? null,
    lots: lots ?? [],
    reservations: collects ?? [],
  };

  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="recolteo-mes-donnees-${date}.json"`,
      "Cache-Control": "no-store, no-cache",
    },
  });
}
