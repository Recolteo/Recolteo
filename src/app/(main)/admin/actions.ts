"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { generateCerfa } from "@/src/lib/cerfa";
const resend = new Resend(process.env.RESEND_API_KEY);

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin, nom, prenom")
    .maybeSingle();
  if (!adminRow) redirect("/");

  return { supabase, adminRow };
}

async function logAdminAction(
  idAdmin: number,
  adminPrenom: string,
  adminNom: string,
  actionType: string,
  entityType: string,
  entityName: string,
  idCollect?: number | null,
) {
  const admin = createAdminClient();
  await admin.from("historique").insert({
    id_admin: idAdmin,
    admin_prenom: adminPrenom,
    admin_nom: adminNom,
    action_type: actionType,
    entity_type: entityType,
    entity_name: entityName,
    date_don: new Date().toISOString(),
    ...(idCollect != null ? { id_collect: idCollect } : {}),
  });
}

const VALID_ENTITY_TYPES = ["commercant", "association"] as const;
const VALID_DOC_TYPES = ["rib", "kbis", "identite"] as const;
const DOC_COL_MAP = {
  rib: "rib_validated",
  kbis: "kbis_validated",
  identite: "piece_identite_validated",
} as const;

export async function approveDocument(formData: FormData) {
  const { adminRow } = await assertAdmin();

  const entityTypeRaw = formData.get("entityType");
  const entityIdRaw = formData.get("entityId");
  const docTypeRaw = formData.get("docType");

  if (!VALID_ENTITY_TYPES.includes(entityTypeRaw as never))
    throw new Error("entityType invalide");
  if (!VALID_DOC_TYPES.includes(docTypeRaw as never))
    throw new Error("docType invalide");

  const entityType = entityTypeRaw as "commercant" | "association";
  const docType = docTypeRaw as "rib" | "kbis" | "identite";
  const entityId = parseInt(entityIdRaw as string, 10);
  if (isNaN(entityId) || entityId <= 0) throw new Error("entityId invalide");

  const admin = createAdminClient();
  await admin
    .from("document")
    .update({ [DOC_COL_MAP[docType]]: true })
    .eq("type_entity", entityType)
    .eq("id_entity", entityId);

  await logAdminAction(
    adminRow.id_admin,
    adminRow.prenom,
    adminRow.nom,
    "approbation_document",
    entityType,
    `${entityType}#${entityId} — ${docType}`,
  );

  revalidatePath("/admin/structures");
}

export async function resetCagnotte(formData: FormData) {
  const { adminRow } = await assertAdmin();
  const id = parseInt(formData.get("id") as string, 10);
  const admin = createAdminClient();

  const { data: assoc } = await admin
    .from("association")
    .select("name_entreprise")
    .eq("id_association", id)
    .maybeSingle();

  await admin
    .from("association")
    .update({ cagnotte_reset_at: new Date().toISOString() })
    .eq("id_association", id);

  if (assoc) {
    await logAdminAction(
      adminRow.id_admin,
      adminRow.prenom,
      adminRow.nom,
      "reset_cagnotte",
      "association",
      assoc.name_entreprise,
    );
  }

  revalidatePath("/admin/structures");
}

export async function validateProfile(formData: FormData) {
  const { adminRow } = await assertAdmin();

  const type = formData.get("type") as "commercant" | "association";
  const id = parseInt(formData.get("id") as string, 10);

  const admin = createAdminClient();

  if (type === "commercant") {
    const { data } = await admin
      .from("commercant")
      .select("name_entreprise")
      .eq("id_commercant", id)
      .maybeSingle();
    await admin
      .from("commercant")
      .update({ is_validated: true })
      .eq("id_commercant", id);
    if (data) {
      await logAdminAction(
        adminRow.id_admin,
        adminRow.prenom,
        adminRow.nom,
        "validation",
        "commercant",
        data.name_entreprise,
      );
    }
  } else {
    const { data } = await admin
      .from("association")
      .select("name_entreprise")
      .eq("id_association", id)
      .maybeSingle();
    await admin
      .from("association")
      .update({ is_validated: true })
      .eq("id_association", id);
    if (data) {
      await logAdminAction(
        adminRow.id_admin,
        adminRow.prenom,
        adminRow.nom,
        "validation",
        "association",
        data.name_entreprise,
      );
    }
  }

  revalidatePath("/admin/validation");
}

export async function rejectProfile(formData: FormData) {
  const { adminRow } = await assertAdmin();

  const type = formData.get("type") as "commercant" | "association";
  const id = parseInt(formData.get("id") as string, 10);
  const admin = createAdminClient();

  if (type === "commercant") {
    const { data } = await admin
      .from("commercant")
      .select("id_user, name_entreprise")
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
      await logAdminAction(
        adminRow.id_admin,
        adminRow.prenom,
        adminRow.nom,
        "rejet",
        "commercant",
        data.name_entreprise,
      );
    }
  } else {
    const { data } = await admin
      .from("association")
      .select("id_user, name_entreprise")
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
      await logAdminAction(
        adminRow.id_admin,
        adminRow.prenom,
        adminRow.nom,
        "rejet",
        "association",
        data.name_entreprise,
      );
    }
  }

  revalidatePath("/admin/validation");
}

export type CollectAdminItem = {
  id_collect: number;
  statut: boolean;
  code_retrait: string;
  creneau: string;
  lot: {
    nature: string;
    quantity: number;
    montant_chiffre: number;
    adresse_recup: string;
  } | null;
  commercant: {
    name_entreprise: string;
    email: string;
    adresse: string | null;
  } | null;
  association: {
    name_entreprise: string;
    email: string | null;
    tel: string | null;
    adresse: string | null;
  } | null;
};

export async function getPendingCollects(): Promise<CollectAdminItem[]> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: collects } = await admin
    .from("collect")
    .select("id_collect, id_lot, id_association, code_retrait, creneau")
    .eq("statut", false)
    .order("creneau", { ascending: true });

  if (!collects?.length) return [];

  const lotIds = [...new Set(collects.map((c) => c.id_lot))];
  const assocIds = [...new Set(collects.map((c) => c.id_association))];

  const { data: lots } = await admin
    .from("lot")
    .select("id_lot, id_commercant, nature, quantity, montant_chiffre, adresse_recup")
    .in("id_lot", lotIds);

  const commercantIds = [...new Set((lots ?? []).map((l) => l.id_commercant))];

  const [{ data: associations }, { data: commercants }] = await Promise.all([
    admin
      .from("association")
      .select("id_association, name_entreprise, email, tel, rna, adresse")
      .in("id_association", assocIds),
    admin
      .from("commercant")
      .select("id_commercant, name_entreprise, email, adresse")
      .in("id_commercant", commercantIds),
  ]);

  const lotMap = new Map((lots ?? []).map((l) => [l.id_lot, l]));
  const assocMap = new Map(
    (associations ?? []).map((a) => [a.id_association, a]),
  );
  const commercantMap = new Map(
    (commercants ?? []).map((c) => [c.id_commercant, c]),
  );

  return collects.map((c) => {
    const lot = lotMap.get(c.id_lot) ?? null;
    return {
      id_collect: c.id_collect,
      statut: false,
      id_lot: c.id_lot,
      code_retrait: c.code_retrait ?? "",
      creneau: c.creneau ?? "",
      lot: lot
        ? {
          nature: lot.nature,
          quantity: lot.quantity,
          montant_chiffre: lot.montant_chiffre,
          adresse_recup: lot.adresse_recup,
        }
        : null,
      commercant: lot ? (commercantMap.get(lot.id_commercant) ?? null) : null,
      association: assocMap.get(c.id_association) ?? null,
    };
  });
}

export async function getAllCollectsAdmin(): Promise<CollectAdminItem[]> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: collects } = await admin
    .from("collect")
    .select("id_collect, id_lot, id_association, code_retrait, creneau, statut")
    .order("creneau", { ascending: false });

  if (!collects?.length) return [];

  const lotIds = [...new Set(collects.map((c) => c.id_lot))];
  const assocIds = [...new Set(collects.map((c) => c.id_association))];

  const { data: lots } = await admin
    .from("lot")
    .select("id_lot, id_commercant, nature, quantity, montant_chiffre, adresse_recup")
    .in("id_lot", lotIds);

  const commercantIds = [...new Set((lots ?? []).map((l) => l.id_commercant))];

  const [{ data: associations }, { data: commercants }] = await Promise.all([
    admin
      .from("association")
      .select("id_association, name_entreprise, email, tel, rna, adresse")
      .in("id_association", assocIds),
    admin
      .from("commercant")
      .select("id_commercant, name_entreprise, email, adresse")
      .in("id_commercant", commercantIds),
  ]);

  const lotMap = new Map((lots ?? []).map((l) => [l.id_lot, l]));
  const assocMap = new Map(
    (associations ?? []).map((a) => [a.id_association, a]),
  );
  const commercantMap = new Map(
    (commercants ?? []).map((c) => [c.id_commercant, c]),
  );

  return collects.map((c) => {
    const lot = lotMap.get(c.id_lot) ?? null;
    return {
      id_collect: c.id_collect,
      statut: c.statut ?? false,
      code_retrait: c.code_retrait ?? "",
      creneau: c.creneau ?? "",
      lot: lot
        ? {
          nature: lot.nature,
          quantity: lot.quantity,
          montant_chiffre: lot.montant_chiffre,
          adresse_recup: lot.adresse_recup,
        }
        : null,
      commercant: lot ? (commercantMap.get(lot.id_commercant) ?? null) : null,
      association: assocMap.get(c.id_association) ?? null,
    };
  });
}

type ValiderCollectAdminResult =
  | { success: true }
  | { success: false; error: string };

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

export async function validerCollectAdmin(
  idCollect: number,
  code: string,
): Promise<ValiderCollectAdminResult> {
  const trimmedCode = code.trim();
  if (!trimmedCode) return { success: false, error: "Code requis." };

  const { adminRow } = await assertAdmin();
  const admin = createAdminClient();

  const { data: collect } = await admin
    .from("collect")
    .select(
      "id_collect, id_lot, id_association, date, creneau, code_retrait, statut",
    )
    .eq("id_collect", idCollect)
    .eq("statut", false)
    .maybeSingle();
  if (!collect)
    return { success: false, error: "Collecte introuvable ou déjà validée." };

  if (collect.code_retrait !== trimmedCode)
    return { success: false, error: "Code incorrect." };

  const { data: lot } = await admin
    .from("lot")
    .select(
      "id_lot, nature, quantity, montant_chiffre, montant_lettre, id_commercant",
    )
    .eq("id_lot", collect.id_lot)
    .maybeSingle();
  if (!lot) return { success: false, error: "Lot introuvable." };

  const [{ data: association }, { data: commercant }] = await Promise.all([
    admin
      .from("association")
      .select("name_entreprise, rna, adresse, code_postal, email")
      .eq("id_association", collect.id_association)
      .maybeSingle(),
    admin
      .from("commercant")
      .select(
        "id_commercant, name_entreprise, email, siret, forme_juridique, adresse, code_postal",
      )
      .eq("id_commercant", lot.id_commercant)
      .maybeSingle(),
  ]);
  if (!association)
    return { success: false, error: "Association introuvable." };
  if (!commercant) return { success: false, error: "Commerçant introuvable." };

  const { count: docCount } = await admin
    .from("document_fiscal")
    .select("id_doc_fiscal", { count: "exact", head: true });
  const numeroSequentiel = String((docCount ?? 0) + 1);

  const { error: updateError } = await admin
    .from("collect")
    .update({ statut: true, code_valide_at: new Date().toISOString() })
    .eq("id_collect", idCollect);
  if (updateError)
    return { success: false, error: "Erreur lors de la validation." };

  await admin.from("document_fiscal").insert({
    id_collect: collect.id_collect,
    pdf: null,
    numero_sequentiel: numeroSequentiel,
    montant_don_ht: lot.montant_chiffre,
    reduction_fiscal: parseFloat((lot.montant_chiffre * 0.6).toFixed(2)),
    signed_at: new Date().toISOString(),
  });

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
    }
  }

  const creneauLabel = formatCreneau(collect.creneau);

  await Promise.all([
    resend.emails.send({
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
            <p style="color:#374151;">La collecte avec l'association <strong>${association.name_entreprise}</strong> a bien été validée par l'équipe Récoltéo.</p>
            <div style="background:rgba(6,87,63,0.08);border:1px solid rgba(6,87,63,0.2);border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0;font-weight:bold;color:#06573f;">Lot concerné</p>
              <p style="margin:8px 0 0;color:#374151;">${lot.nature} — Valeur : ${lot.montant_chiffre} €</p>
            </div>
            <p style="color:#374151;">Votre reçu fiscal CERFA 16216*03 est joint à cet email.</p>
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
    }),
    association.email
      ? resend.emails.send({
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
      })
      : Promise.resolve(),
  ]);

  await logAdminAction(
    adminRow.id_admin,
    adminRow.prenom,
    adminRow.nom,
    "validation_collecte",
    "commercant",
    commercant.name_entreprise,
    collect.id_collect,
  );

  revalidatePath("/admin/collectes");
  return { success: true };
}
