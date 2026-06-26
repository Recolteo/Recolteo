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

type CollectRow = {
  id_collect: number;
  id_lot: number;
  id_association: number;
  date: string;
  creneau: string;
  lot: { nature: string; quantity: number; montant_chiffre: number; montant_lettre: string; id_commercant: number } | null;
  doc: { pdf: string | null; numero_sequentiel: string } | null;
};

async function appendPdf(merged: PDFDocument, pdfBytes: Uint8Array | ArrayBuffer) {
  const src = await PDFDocument.load(pdfBytes);
  const pages = await merged.copyPages(src, src.getPageIndices());
  pages.forEach((p) => merged.addPage(p));
}

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Non authentifié", { status: 401 });

  const admin = createAdminClient();

  const { data: userRow } = await admin.from("user").select("id_user").eq("auth_id", user.id).maybeSingle();
  if (!userRow) return new Response("Utilisateur introuvable", { status: 404 });

  const { data: adminRow } = await supabase.from("administrateur").select("id_admin").maybeSingle();
  const isAdmin = !!adminRow;

  let collects: CollectRow[] = [];

  if (isAdmin) {
    const { data } = await admin
      .from("collect")
      .select("id_collect, id_lot, id_association, date, creneau, lot:id_lot(nature, quantity, montant_chiffre, montant_lettre, id_commercant), document_fiscal!id_collect(pdf, numero_sequentiel)")
      .eq("statut", true)
      .order("date", { ascending: false })
      .limit(300);
    collects = (data ?? []).map((c: unknown) => {
      const r = c as Record<string, unknown>;
      const docArr = r["document_fiscal"] as { pdf: string | null; numero_sequentiel: string }[] | null;
      return { ...r, doc: docArr?.[0] ?? null } as CollectRow;
    });
  } else {
    const { data: commercant } = await admin
      .from("commercant")
      .select("id_commercant")
      .eq("id_user", userRow.id_user)
      .maybeSingle();

    const { data: asso } = await admin
      .from("association")
      .select("id_association")
      .eq("id_user", userRow.id_user)
      .maybeSingle();

    if (commercant) {
      const { data: lots } = await admin.from("lot").select("id_lot").eq("id_commercant", commercant.id_commercant);
      const lotIds = (lots ?? []).map((l) => l.id_lot);
      if (lotIds.length > 0) {
        const { data } = await admin
          .from("collect")
          .select("id_collect, id_lot, id_association, date, creneau, lot:id_lot(nature, quantity, montant_chiffre, montant_lettre, id_commercant), document_fiscal!id_collect(pdf, numero_sequentiel)")
          .in("id_lot", lotIds)
          .eq("statut", true)
          .order("date", { ascending: false });
        collects = (data ?? []).map((c: unknown) => {
          const r = c as Record<string, unknown>;
          const docArr = r["document_fiscal"] as { pdf: string | null; numero_sequentiel: string }[] | null;
          return { ...r, doc: docArr?.[0] ?? null } as CollectRow;
        });
      }
    } else if (asso) {
      const { data } = await admin
        .from("collect")
        .select("id_collect, id_lot, id_association, date, creneau, lot:id_lot(nature, quantity, montant_chiffre, montant_lettre, id_commercant), document_fiscal!id_collect(pdf, numero_sequentiel)")
        .eq("id_association", asso.id_association)
        .eq("statut", true)
        .order("date", { ascending: false });
      collects = (data ?? []).map((c: unknown) => {
        const r = c as Record<string, unknown>;
        const docArr = r["document_fiscal"] as { pdf: string | null; numero_sequentiel: string }[] | null;
        return { ...r, doc: docArr?.[0] ?? null } as CollectRow;
      });
    }
  }

  if (!collects.length) return new Response("Aucune collecte à exporter", { status: 404 });

  const idCommerçants = [...new Set(collects.map((c) => c.lot?.id_commercant).filter(Boolean))] as number[];
  const idAssos = [...new Set(collects.map((c) => c.id_association).filter(Boolean))] as number[];

  const [{ data: commercantsData }, { data: assosData }] = await Promise.all([
    admin.from("commercant").select("id_commercant, name_entreprise, forme_juridique, siret, adresse, code_postal").in("id_commercant", idCommerçants),
    admin.from("association").select("id_association, name_entreprise, rna, adresse, code_postal").in("id_association", idAssos),
  ]);

  const commercantMap = new Map((commercantsData ?? []).map((c) => [c.id_commercant, c]));
  const assoMap = new Map((assosData ?? []).map((a) => [a.id_association, a]));

  const merged = await PDFDocument.create();

  for (const collect of collects) {
    const lot = collect.lot;
    if (!lot) continue;
    const commercant = commercantMap.get(lot.id_commercant);
    const asso = assoMap.get(collect.id_association);
    if (!commercant || !asso) continue;

    const dateCollect = formatDate(collect.date);
    const numOrdre = collect.doc?.numero_sequentiel ?? collect.id_lot;

    let cerfaBytes: Uint8Array | null = null;
    if (collect.doc?.pdf) {
      const { data: file } = await admin.storage.from("cerfas").download(collect.doc.pdf);
      if (file) cerfaBytes = new Uint8Array(await file.arrayBuffer());
    }
    if (!cerfaBytes) {
      try {
        const buf = await generateCerfa({
          numOrdre,
          association: { name_entreprise: asso.name_entreprise, rna: asso.rna ?? "", adresse: asso.adresse ?? "", code_postal: asso.code_postal ?? "" },
          commercant: { name_entreprise: commercant.name_entreprise, forme_juridique: commercant.forme_juridique ?? "", siret: commercant.siret ?? "", adresse: commercant.adresse ?? "", code_postal: commercant.code_postal ?? "" },
          lot: { nature: lot.nature, quantity: lot.quantity, montant_chiffre: lot.montant_chiffre, montant_lettre: lot.montant_lettre ?? "" },
          dateCollect,
        });
        cerfaBytes = new Uint8Array(buf);
      } catch { continue; }
    }

    const recapBuf = await generateRecap({
      numeroSequentiel: numOrdre,
      date: dateCollect,
      creneau: formatCreneau(collect.creneau),
      commercant: { name_entreprise: commercant.name_entreprise, adresse: commercant.adresse ?? "" },
      association: { name_entreprise: asso.name_entreprise, adresse: asso.adresse ?? "" },
      lot: { nature: lot.nature, quantity: lot.quantity, montant_chiffre: lot.montant_chiffre, montant_lettre: lot.montant_lettre ?? "" },
    });

    await appendPdf(merged, cerfaBytes);
    await appendPdf(merged, new Uint8Array(recapBuf));
  }

  if (merged.getPageCount() === 0) return new Response("Aucun document généré", { status: 500 });

  const mergedBytes = await merged.save();
  const date = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(mergedBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="historique-recolteo-${date}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
