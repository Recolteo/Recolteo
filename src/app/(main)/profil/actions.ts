"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { generateCerfa } from "@/src/lib/cerfa";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCreneau(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const h1 = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const h2 = new Date(d.getTime() + 2 * 3600_000).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} de ${h1} à ${h2}`;
}

async function resolveCommercant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return null;

  const { data: commercant } = await admin
    .from("commercant")
    .select(
      "id_commercant, name_entreprise, email, siret, forme_juridique, adresse, code_postal",
    )
    .eq("id_user", userRow.id_user)
    .maybeSingle();

  return commercant ?? null;
}

const LOT_FIELDS =
  "nature, name_entreprise, adresse, adresse_recup, instructions, category, quantity, dlc, montant_chiffre, montant_lettre, created_at";

export type CollectLot = {
  nature: string;
  name_entreprise: string;
  adresse: string;
  adresse_recup: string;
  instructions: string | null;
  category: string;
  quantity: number;
  dlc: string | null;
  montant_chiffre: number;
  montant_lettre: string;
  created_at: string;
};

export type CollectItem = {
  id_lot: number;
  statut: boolean;
  date: string;
  creneau: string;
  code_retrait: string | null;
  lot: CollectLot | null;
  association: { name_entreprise: string } | null;
};


export async function getCommercantCollects(): Promise<CollectItem[]> {
  const commercant = await resolveCommercant();
  if (!commercant) return [];

  const admin = createAdminClient();

  const { data: lots } = await admin
    .from("lot")
    .select("id_lot")
    .eq("id_commercant", commercant.id_commercant);
  if (!lots?.length) return [];

  const lotIds = lots.map((l) => l.id_lot);

  type RawCollect = {
    id_lot: number;
    id_association: number;
    statut: boolean;
    date: string;
    creneau: string;
    lot: CollectLot | null;
  };

  const { data: collects } = (await admin
    .from("collect")
    .select(`id_lot, id_association, statut, date, creneau, lot:id_lot(${LOT_FIELDS})`)
    .in("id_lot", lotIds)
    .order("date", { ascending: false })) as unknown as { data: RawCollect[] | null };

  if (!collects?.length) return [];

  const assocIds = [...new Set(collects.map((c) => c.id_association).filter(Boolean))];
  const { data: associations } = await admin
    .from("association")
    .select("id_association, name_entreprise")
    .in("id_association", assocIds);

  const assocMap = new Map((associations ?? []).map((a) => [a.id_association, a]));

  return collects.map((c) => ({
    id_lot: c.id_lot,
    statut: c.statut,
    date: c.date,
    creneau: c.creneau,
    code_retrait: null,
    lot: c.lot ?? null,
    association: assocMap.get(c.id_association)
      ? { name_entreprise: assocMap.get(c.id_association)!.name_entreprise }
      : null,
  }));
}

export async function getAssociationCollects(): Promise<CollectItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return [];

  const { data: assoc } = await admin
    .from("association")
    .select("id_association")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!assoc) return [];

  const { data: collects } = await admin
    .from("collect")
    .select(
      `id_lot, statut, date, creneau, code_retrait, lot:id_lot(${LOT_FIELDS})`,
    )
    .eq("id_association", assoc.id_association)
    .order("date", { ascending: false });

  return (collects ?? []) as unknown as CollectItem[];
}

export type ValiderResult =
  | { success: true }
  | { success: false; error: string };

export async function validerCollect(
  idLot: number,
  code: string,
): Promise<ValiderResult> {
  const trimmedCode = code.trim();
  if (!trimmedCode) return { success: false, error: "Code requis." };

  const commercant = await resolveCommercant();
  if (!commercant)
    return { success: false, error: "Compte commerçant introuvable." };

  const admin = createAdminClient();

  const { data: lot } = await admin
    .from("lot")
    .select("id_lot, nature, quantity, montant_chiffre, montant_lettre")
    .eq("id_lot", idLot)
    .eq("id_commercant", commercant.id_commercant)
    .maybeSingle();
  if (!lot) return { success: false, error: "Lot introuvable." };

  const { data: collect } = await admin
    .from("collect")
    .select("id_collect, id_association, date, code_retrait")
    .eq("id_lot", idLot)
    .eq("statut", false)
    .maybeSingle();
  if (!collect)
    return { success: false, error: "Aucune collecte en attente pour ce lot." };

  if (collect.code_retrait !== trimmedCode)
    return { success: false, error: "Code incorrect." };

  const { data: association } = await admin
    .from("association")
    .select("name_entreprise, rna, adresse, code_postal, email")
    .eq("id_association", collect.id_association)
    .maybeSingle();
  if (!association)
    return { success: false, error: "Association introuvable." };

  const { count: docCount } = await admin
    .from("document_fiscal")
    .select("id_doc_fiscal", { count: "exact", head: true });
  const numeroSequentiel = String((docCount ?? 0) + 1);

  const { error: updateError } = await admin
    .from("collect")
    .update({ statut: true, code_valide_at: new Date().toISOString() })
    .eq("id_lot", idLot)
    .eq("statut", false);
  if (updateError)
    return { success: false, error: "Erreur lors de la validation." };

  const { error: insertError } = await admin.from("document_fiscal").insert({
    id_collect: collect.id_collect,
    pdf: null,
    numero_sequentiel: numeroSequentiel,
    montant_don_ht: lot.montant_chiffre,
    reduction_fiscal: parseFloat((lot.montant_chiffre * 0.6).toFixed(2)),
    signed_at: new Date().toISOString(),
  });
  if (insertError)
    console.error("Erreur insert document_fiscal :", insertError);

  const dateCollect = formatDate(collect.date);
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await generateCerfa({
      numOrdre: numeroSequentiel,
      association: {
        name_entreprise: association.name_entreprise,
        rna: association.rna ?? "",
        adresse: association.adresse ?? "",
        code_postal: association.code_postal ?? "",
      },
      commercant: {
        name_entreprise: commercant.name_entreprise,
        forme_juridique: commercant.forme_juridique ?? "",
        siret: commercant.siret ?? "",
        adresse: commercant.adresse ?? "",
        code_postal: commercant.code_postal ?? "",
      },
      lot: {
        nature: lot.nature,
        quantity: lot.quantity,
        montant_chiffre: lot.montant_chiffre,
        montant_lettre: lot.montant_lettre ?? "",
      },
      dateCollect,
    });
  } catch (e) {
    console.error("Erreur génération CERFA :", e);
  }

  if (pdfBuffer) {
    const storagePath = `${commercant.id_commercant}/${collect.id_collect}.pdf`;
    const { error: uploadError } = await admin.storage
      .from("cerfas")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      await admin
        .from("document_fiscal")
        .update({ pdf: storagePath })
        .eq("id_collect", collect.id_collect);
    } else {
      console.error("Erreur upload CERFA :", uploadError);
    }
  }

  const creneauLabel = formatCreneau(collect.date);

  await resend.emails.send({
    from: "Récoltéo <onboarding@resend.dev>",
    to: commercant.email,
    subject: `Collecte validée — CERFA fiscal n°${numeroSequentiel} — Récoltéo`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9f242;margin:0;font-size:24px;">Collecte validée !</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
          <p style="color:#374151;">Bonjour <strong>${commercant.name_entreprise}</strong>,</p>
          <p style="color:#374151;">La collecte avec l'association <strong>${association.name_entreprise}</strong> a bien été validée.</p>
          <div style="background:rgba(6,87,63,0.08);border:1px solid rgba(6,87,63,0.2);border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;font-weight:bold;color:#06573f;">Lot concerné</p>
            <p style="margin:8px 0 0;color:#374151;">${lot.nature} — Valeur : ${lot.montant_chiffre} €</p>
          </div>
          <p style="color:#374151;">Votre reçu fiscal CERFA 16216*03 (article 238 bis du CGI) est joint à cet email. Conservez-le pour votre déclaration fiscale.</p>
          <p style="color:#374151;">Vous pouvez également le télécharger depuis votre espace profil, onglet <strong>Historique</strong>.</p>
          <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
        </div>
      </div>`,
    ...(pdfBuffer
      ? {
          attachments: [
            { filename: `cerfa_${numeroSequentiel}.pdf`, content: pdfBuffer },
          ],
        }
      : {}),
  });

  if (association.email) {
    await resend.emails.send({
      from: "Récoltéo <onboarding@resend.dev>",
      to: association.email,
      subject: `Collecte confirmée par ${commercant.name_entreprise} — Récoltéo`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="color:#c9f242;margin:0;font-size:24px;">Collecte confirmée</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            <p style="color:#374151;">Bonjour <strong>${association.name_entreprise}</strong>,</p>
            <p style="color:#374151;">Le commerçant <strong>${commercant.name_entreprise}</strong> a validé la récupération du lot <strong>${lot.nature}</strong>.</p>
            <p style="color:#374151;">Créneau : ${creneauLabel}</p>
            <p style="color:#374151;">La valeur du don (<strong>${lot.montant_chiffre} €</strong>) sera prise en compte dans votre cagnotte.</p>
            <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
          </div>
        </div>`,
    });
  }

  return { success: true };
}
