import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { generateCerfa } from "@/src/lib/cerfa";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ idLot: string }> },
) {
  const { idLot: idLotStr } = await params;
  const idLot = parseInt(idLotStr, 10);
  if (isNaN(idLot)) return new Response("ID invalide", { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Non authentifié", { status: 401 });

  const admin = createAdminClient();

  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return new Response("Utilisateur introuvable", { status: 404 });

  const { data: commercant } = await admin
    .from("commercant")
    .select("id_commercant, name_entreprise, forme_juridique, siret, adresse")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!commercant)
    return new Response("Profil commerçant introuvable", { status: 403 });

  const { data: lot } = await admin
    .from("lot")
    .select("id_lot, nature, quantity, montant_chiffre, montant_lettre")
    .eq("id_lot", idLot)
    .eq("id_commercant", commercant.id_commercant)
    .maybeSingle();
  if (!lot) return new Response("Lot introuvable", { status: 404 });

  const { data: collect } = await admin
    .from("collect")
    .select("id_collect, id_association, date")
    .eq("id_lot", idLot)
    .eq("statut", true)
    .maybeSingle();
  if (!collect)
    return new Response("Aucune collecte validée pour ce lot", { status: 404 });

  const { data: association } = await admin
    .from("association")
    .select("name_entreprise, rna, adresse")
    .eq("id_association", collect.id_association)
    .maybeSingle();
  if (!association)
    return new Response("Association introuvable", { status: 404 });

  const { data: doc } = await admin
    .from("document_fiscal")
    .select("pdf, numero_sequentiel")
    .eq("id_collect", collect.id_collect)
    .maybeSingle();

  if (doc?.pdf) {
    const { data: file } = await admin.storage.from("cerfas").download(doc.pdf);
    if (file) {
      const buffer = await file.arrayBuffer();
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="cerfa_${doc.numero_sequentiel}.pdf"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  }

  const numOrdre = doc?.numero_sequentiel ?? idLot;
  const dateCollect = new Date(collect.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const buffer = await generateCerfa({
    numOrdre,
    association: {
      name_entreprise: association.name_entreprise,
      rna: association.rna ?? "",
      adresse: association.adresse ?? "",
    },
    commercant: {
      name_entreprise: commercant.name_entreprise,
      forme_juridique: commercant.forme_juridique ?? "",
      siret: commercant.siret ?? "",
      adresse: commercant.adresse ?? "",
    },
    lot: {
      nature: lot.nature,
      quantity: lot.quantity,
      montant_chiffre: lot.montant_chiffre,
      montant_lettre: lot.montant_lettre ?? "",
    },
    dateCollect,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cerfa_${numOrdre}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
