"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { generateCerfa } from "@/src/lib/cerfa";
import { hashPdf, getTimestampToken } from "@/src/lib/timestamp";
import { stripe, COMMISSION_RATE, ASSOCIATION_ANNUAL_PRICE_ID } from "@/src/lib/stripe";

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
    code_retrait: string | null;
    lot: CollectLot | null;
  };

  const { data: collects } = (await admin
    .from("collect")
    .select(`id_lot, id_association, statut, date, creneau, code_retrait, lot:id_lot(${LOT_FIELDS})`)
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
    code_retrait: c.code_retrait ?? null,
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
    .select("id_collect, id_association, date, creneau, code_retrait")
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

  const { data: nextNumero } = await admin.rpc("next_cerfa_numero");
  const numeroSequentiel = nextNumero as string;

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
    const pdfHash = hashPdf(pdfBuffer);
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
        .update({ pdf: storagePath, pdf_hash: pdfHash })
        .eq("id_collect", collect.id_collect);
      const idCollect = collect.id_collect;
      after(async () => {
        const token = await getTimestampToken(pdfHash);
        if (token)
          await admin.from("document_fiscal").update({ timestamp_token: token }).eq("id_collect", idCollect);
      });
    } else {
      console.error("Erreur upload CERFA :", uploadError);
    }
  }

  const creneauLabel = formatCreneau(collect.creneau);

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

export async function validerCollectsParCode(code: string): Promise<ValiderResult> {
  const trimmedCode = code.trim();
  if (trimmedCode.length !== 8) return { success: false, error: "Code invalide." };

  const commercant = await resolveCommercant();
  if (!commercant) return { success: false, error: "Compte commerçant introuvable." };

  const admin = createAdminClient();

  const { data: commercantStripe } = await admin
    .from("commercant")
    .select("stripe_customer_id, stripe_payment_method_id")
    .eq("id_commercant", commercant.id_commercant)
    .maybeSingle();

  if (!commercantStripe?.stripe_payment_method_id)
    return { success: false, error: "Veuillez configurer votre moyen de paiement dans l'onglet Paiement." };

  const { data: lots } = await admin
    .from("lot")
    .select("id_lot")
    .eq("id_commercant", commercant.id_commercant);
  if (!lots?.length) return { success: false, error: "Aucun lot trouvé." };

  type RawGroupCollect = {
    id_collect: number;
    id_lot: number;
    id_association: number;
    date: string;
    lot: { nature: string; quantity: number; montant_chiffre: number; montant_lettre: string } | null;
  };

  const { data: collects } = (await admin
    .from("collect")
    .select("id_collect, id_lot, id_association, date, lot:id_lot(nature, quantity, montant_chiffre, montant_lettre)")
    .in("id_lot", lots.map((l) => l.id_lot))
    .eq("statut", false)
    .eq("code_retrait", trimmedCode)) as unknown as { data: RawGroupCollect[] | null };

  if (!collects?.length) return { success: false, error: "Code incorrect ou déjà validé." };

  const { data: association } = await admin
    .from("association")
    .select("id_association, name_entreprise, rna, adresse, code_postal, email")
    .eq("id_association", collects[0].id_association)
    .maybeSingle();
  if (!association) return { success: false, error: "Association introuvable." };

  const totalMontant = collects.reduce((sum, c) => sum + (c.lot?.montant_chiffre ?? 0), 0);
  const stripeAmount = Math.round(totalMontant * COMMISSION_RATE * 100);
  const now = new Date().toISOString();
  const collectIds = collects.map((c) => c.id_collect);

  // Atomic claim: prevents duplicate processing under concurrent requests
  const { data: claimed } = await admin
    .from("collect")
    .update({ statut: true, code_valide_at: now })
    .in("id_collect", collectIds)
    .eq("statut", false)
    .select("id_collect");

  if (!claimed?.length)
    return { success: false, error: "Ces collectes ont déjà été validées." };

  if (stripeAmount > 0) {
    const idempotencyKey = `commission-${collectIds.slice().sort().join("-")}`;
    try {
      const pi = await stripe.paymentIntents.create(
        {
          amount: stripeAmount,
          currency: "eur",
          customer: commercantStripe.stripe_customer_id ?? undefined,
          payment_method: commercantStripe.stripe_payment_method_id,
          confirm: true,
          off_session: true,
          description: `Commission Récoltéo — ${new Date().toLocaleDateString("fr-FR")}`,
          metadata: {
            id_commercant: String(commercant.id_commercant),
            collect_ids: collectIds.join(","),
          },
        },
        { idempotencyKey },
      );
      if (pi.status !== "succeeded" && pi.status !== "processing") {
        await admin.from("collect").update({ statut: false, code_valide_at: null }).in("id_collect", collectIds);
        return { success: false, error: "Le paiement a échoué. Vérifiez votre moyen de paiement." };
      }
    } catch {
      await admin.from("collect").update({ statut: false, code_valide_at: null }).in("id_collect", collectIds);
      return { success: false, error: "Erreur lors du paiement. Veuillez réessayer." };
    }
  }

  for (const collect of collects) {
    if (!collect.lot) continue;

    const { count: alreadyProcessed } = await admin
      .from("document_fiscal")
      .select("id_doc_fiscal", { count: "exact", head: true })
      .eq("id_collect", collect.id_collect);
    if (alreadyProcessed && alreadyProcessed > 0) continue;

    const { data: nextNumero } = await admin.rpc("next_cerfa_numero");
    const numeroSequentiel = nextNumero as string;

    await admin.from("document_fiscal").insert({
      id_collect: collect.id_collect,
      pdf: null,
      numero_sequentiel: numeroSequentiel,
      montant_don_ht: collect.lot.montant_chiffre,
      reduction_fiscal: parseFloat((collect.lot.montant_chiffre * 0.6).toFixed(2)),
      signed_at: now,
    });

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
          nature: collect.lot.nature,
          quantity: collect.lot.quantity,
          montant_chiffre: collect.lot.montant_chiffre,
          montant_lettre: collect.lot.montant_lettre ?? "",
        },
        dateCollect: formatDate(collect.date),
      });
    } catch (e) {
      console.error("Erreur génération CERFA :", e);
    }

    if (pdfBuffer) {
      const pdfHash = hashPdf(pdfBuffer);
      const storagePath = `${commercant.id_commercant}/${collect.id_collect}.pdf`;
      const { error: uploadError } = await admin.storage
        .from("cerfas")
        .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: true });
      if (!uploadError) {
        await admin
          .from("document_fiscal")
          .update({ pdf: storagePath, pdf_hash: pdfHash })
          .eq("id_collect", collect.id_collect);
        const idCollect = collect.id_collect;
        after(async () => {
          const token = await getTimestampToken(pdfHash);
          if (token)
            await admin.from("document_fiscal").update({ timestamp_token: token }).eq("id_collect", idCollect);
        });
      }
    }
  }

  const lotsLabel = collects
    .map((c) => `${c.lot?.nature ?? "lot"} (${c.lot?.montant_chiffre ?? 0} €)`)
    .join(", ");
  const commissionLabel = (totalMontant * COMMISSION_RATE).toFixed(2);

  await resend.emails.send({
    from: "Récoltéo <onboarding@resend.dev>",
    to: commercant.email,
    subject: `Collecte validée — ${collects.length} lot${collects.length > 1 ? "s" : ""} — Récoltéo`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:#c9f242;margin:0;font-size:24px;">Collecte validée !</h1>
      </div>
      <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
        <p style="color:#374151;">Bonjour <strong>${commercant.name_entreprise}</strong>,</p>
        <p style="color:#374151;">Collecte validée avec <strong>${association.name_entreprise}</strong>.</p>
        <div style="background:rgba(6,87,63,0.08);border:1px solid rgba(6,87,63,0.2);border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;font-weight:bold;color:#06573f;">Lots collectés</p>
          <p style="margin:8px 0 0;color:#374151;">${lotsLabel}</p>
          <p style="margin:8px 0 0;color:#374151;">Commission : <strong>${commissionLabel} €</strong></p>
        </div>
        <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
      </div>
    </div>`,
  });

  if (association.email) {
    await resend.emails.send({
      from: "Récoltéo <onboarding@resend.dev>",
      to: association.email,
      subject: `Collecte confirmée par ${commercant.name_entreprise} — Récoltéo`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9f242;margin:0;font-size:24px;">Collecte confirmée</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
          <p style="color:#374151;">Bonjour <strong>${association.name_entreprise}</strong>,</p>
          <p style="color:#374151;"><strong>${commercant.name_entreprise}</strong> a validé votre collecte : ${lotsLabel}.</p>
          <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
        </div>
      </div>`,
    });
  }

  return { success: true };
}

export type SubscriptionInfo = {
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasPaymentMethod: boolean;
  paymentMethodType: string | null;
  paymentMethodLast4: string | null;
  annualPrice: number | null;
};

export async function getAssociationSubscription(): Promise<SubscriptionInfo> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) redirect("/profil");

  const { data: asso } = await admin
    .from("association")
    .select("stripe_subscription_id, stripe_subscription_status, subscription_current_period_end, stripe_payment_method_id")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!asso) redirect("/profil");

  let cancelAtPeriodEnd = false;
  let annualPrice: number | null = null;
  let paymentMethodType: string | null = null;
  let paymentMethodLast4: string | null = null;

  const [subResult, priceResult, pmResult] = await Promise.allSettled([
    asso.stripe_subscription_id
      ? stripe.subscriptions.retrieve(asso.stripe_subscription_id)
      : Promise.reject(),
    stripe.prices.retrieve(ASSOCIATION_ANNUAL_PRICE_ID),
    asso.stripe_payment_method_id
      ? stripe.paymentMethods.retrieve(asso.stripe_payment_method_id)
      : Promise.reject(),
  ]);

  if (subResult.status === "fulfilled") {
    cancelAtPeriodEnd = subResult.value.cancel_at_period_end;
  }
  if (priceResult.status === "fulfilled" && priceResult.value.unit_amount) {
    annualPrice = priceResult.value.unit_amount / 100;
  }
  if (pmResult.status === "fulfilled") {
    paymentMethodType = pmResult.value.type;
    paymentMethodLast4 =
      pmResult.value.type === "card"
        ? pmResult.value.card?.last4 ?? null
        : pmResult.value.type === "sepa_debit"
          ? pmResult.value.sepa_debit?.last4 ?? null
          : null;
  }

  return {
    status: asso.stripe_subscription_status ?? "none",
    currentPeriodEnd: asso.subscription_current_period_end ?? null,
    cancelAtPeriodEnd,
    hasPaymentMethod: !!asso.stripe_payment_method_id,
    paymentMethodType,
    paymentMethodLast4,
    annualPrice,
  };
}

export type PaymentMethodInfo = {
  hasPaymentMethod: boolean;
  type: string | null;
  last4: string | null;
};

export async function getCommercantPaymentMethod(): Promise<PaymentMethodInfo> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) redirect("/profil");

  const { data: commercant } = await admin
    .from("commercant")
    .select("stripe_payment_method_id")
    .eq("id_user", userRow.id_user)
    .maybeSingle();

  const pmId = commercant?.stripe_payment_method_id;
  if (!pmId) return { hasPaymentMethod: false, type: null, last4: null };

  try {
    const pm = await stripe.paymentMethods.retrieve(pmId);
    const type = pm.type;
    const last4 =
      pm.type === "card"
        ? pm.card?.last4 ?? null
        : pm.type === "sepa_debit"
          ? pm.sepa_debit?.last4 ?? null
          : null;
    return { hasPaymentMethod: true, type, last4 };
  } catch {
    return { hasPaymentMethod: false, type: null, last4: null };
  }
}

export async function saveCommercantPaymentMethod(
  paymentMethodId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!paymentMethodId || typeof paymentMethodId !== "string" || !paymentMethodId.startsWith("pm_"))
    return { success: false, error: "Moyen de paiement invalide." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié." };

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return { success: false, error: "Introuvable." };

  const { data: commercantRow } = await admin
    .from("commercant")
    .select("id_user, stripe_customer_id")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!commercantRow) return { success: false, error: "Compte commerçant introuvable." };

  if (commercantRow.stripe_customer_id) {
    try {
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
      if (pm.customer !== commercantRow.stripe_customer_id)
        return { success: false, error: "Ce moyen de paiement n'appartient pas à votre compte." };
    } catch {
      return { success: false, error: "Moyen de paiement introuvable." };
    }
  }

  const { error } = await admin
    .from("commercant")
    .update({ stripe_payment_method_id: paymentMethodId })
    .eq("id_user", userRow.id_user);

  return error ? { success: false, error: error.message } : { success: true };
}
