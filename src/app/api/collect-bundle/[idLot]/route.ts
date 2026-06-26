import "server-only";
import type { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { generateCerfa } from "@/src/lib/cerfa";
import { generateRecap } from "@/src/lib/recap";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCreneau(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const h1 = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const h2 = new Date(d.getTime() + 2 * 3600_000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date} de ${h1} à ${h2}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ idLot: string }> },
) {
  const { idLot: idLotStr } = await params;
  const idLot = parseInt(idLotStr, 10);
  if (isNaN(idLot)) return new Response("ID invalide", { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Non authentifié", { status: 401 });

  const admin = createAdminClient();

  const { data: userRow } = await admin.from("user").select("id_user").eq("auth_id", user.id).maybeSingle();
  if (!userRow) return new Response("Utilisateur introuvable", { status: 404 });

  const { data: adminRow } = await supabase.from("administrateur").select("id_admin").maybeSingle();
  const isAdmin = !!adminRow;

  const { data: lot } = await admin
    .from("lot")
    .select("id_lot, nature, quantity, montant_chiffre, montant_lettre, id_commercant")
    .eq("id_lot", idLot)
    .maybeSingle();
  if (!lot) return new Response("Lot introuvable", { status: 404 });

  const { data: collect } = await admin
    .from("collect")
    .select("id_collect, id_association, date, creneau")
    .eq("id_lot", idLot)
    .eq("statut", true)
    .maybeSingle();
  if (!collect) return new Response("Aucune collecte validée pour ce lot", { status: 404 });

  if (!isAdmin) {
    const { data: commercantCheck } = await admin
      .from("commercant")
      .select("id_commercant")
      .eq("id_user", userRow.id_user)
      .eq("id_commercant", lot.id_commercant)
      .maybeSingle();

    if (!commercantCheck) {
      const { data: assoCheck } = await admin
        .from("association")
        .select("id_association")
        .eq("id_user", userRow.id_user)
        .eq("id_association", collect.id_association)
        .maybeSingle();
      if (!assoCheck) return new Response("Accès refusé", { status: 403 });
    }
  }

  const [{ data: commercant }, { data: association }, { data: doc }] = await Promise.all([
    admin.from("commercant").select("name_entreprise, forme_juridique, siret, adresse, code_postal").eq("id_commercant", lot.id_commercant).maybeSingle(),
    admin.from("association").select("name_entreprise, rna, adresse, code_postal").eq("id_association", collect.id_association).maybeSingle(),
    admin.from("document_fiscal").select("pdf, numero_sequentiel").eq("id_collect", collect.id_collect).maybeSingle(),
  ]);
  if (!commercant) return new Response("Commerçant introuvable", { status: 404 });
  if (!association) return new Response("Association introuvable", { status: 404 });

  const numOrdre = doc?.numero_sequentiel ?? idLot;
  const dateCollect = formatDate(collect.date);

  let cerfaBytes: Uint8Array | null = null;
  if (doc?.pdf) {
    const { data: file } = await admin.storage.from("cerfas").download(doc.pdf);
    if (file) cerfaBytes = new Uint8Array(await file.arrayBuffer());
  }
  if (!cerfaBytes) {
    const buf = await generateCerfa({
      numOrdre,
      association: { name_entreprise: association.name_entreprise, rna: association.rna ?? "", adresse: association.adresse ?? "", code_postal: association.code_postal ?? "" },
      commercant: { name_entreprise: commercant.name_entreprise, forme_juridique: commercant.forme_juridique ?? "", siret: commercant.siret ?? "", adresse: commercant.adresse ?? "", code_postal: commercant.code_postal ?? "" },
      lot: { nature: lot.nature, quantity: lot.quantity, montant_chiffre: lot.montant_chiffre, montant_lettre: lot.montant_lettre ?? "" },
      dateCollect,
    });
    cerfaBytes = new Uint8Array(buf);
  }

  const recapBuf = await generateRecap({
    numeroSequentiel: numOrdre,
    date: dateCollect,
    creneau: formatCreneau(collect.creneau),
    commercant: { name_entreprise: commercant.name_entreprise, adresse: commercant.adresse ?? "" },
    association: { name_entreprise: association.name_entreprise, adresse: association.adresse ?? "" },
    lot: { nature: lot.nature, quantity: lot.quantity, montant_chiffre: lot.montant_chiffre, montant_lettre: lot.montant_lettre ?? "" },
  });

  const merged = await PDFDocument.create();

  async function append(src: Uint8Array) {
    const srcDoc = await PDFDocument.load(src);
    const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  await append(cerfaBytes);
  await append(new Uint8Array(recapBuf));

  const mergedBytes = await merged.save();
  return new Response(new Uint8Array(mergedBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="collecte_${numOrdre}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
