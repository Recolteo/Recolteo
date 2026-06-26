"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export type MerchantCode = {
  id_commercant: number;
  name_entreprise: string;
  adresse_recup: string;
  lots: { id_lot: number; nature: string }[];
  code: string;
  creneau: string;
};

export type ReservationResult =
  | {
      success: true;
      merchantCodes: MerchantCode[];
      emailErrors?: string[];
    }
  | { success: false; error: string };

function generateCode(): string {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

function formatCreneau(creneauIso: string): string {
  const date = new Date(creneauIso);
  const dateStr = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const heureDebut = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const heureFin = new Date(
    date.getTime() + 2 * 60 * 60 * 1000,
  ).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} de ${heureDebut} à ${heureFin}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function reserverLots(
  lotIds: number[],
  creneaux: Record<number, string>,
): Promise<ReservationResult> {
  if (!lotIds.length)
    return { success: false, error: "Aucun lot sélectionné." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 14);

  for (const iso of Object.values(creneaux)) {
    const d = new Date(iso);
    if (isNaN(d.getTime()) || d <= now || d > maxDate) {
      return { success: false, error: "Un créneau sélectionné est invalide." };
    }
  }

  const admin = createAdminClient();

  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .single();
  if (!userRow) return { success: false, error: "Utilisateur introuvable." };

  const { data: assoc } = await admin
    .from("association")
    .select("id_association, name_entreprise, email")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!assoc)
    return { success: false, error: "Compte association introuvable." };

  const { data: docRow } = await admin
    .from("document")
    .select("rib_validated, kbis_validated, piece_identite_validated")
    .eq("type_entity", "association")
    .eq("id_entity", assoc.id_association)
    .maybeSingle();
  const docsApproved =
    docRow?.rib_validated && docRow?.kbis_validated && docRow?.piece_identite_validated;
  if (!docsApproved)
    return { success: false, error: "Vos documents doivent être approuvés par l'équipe Récoltéo avant de pouvoir réserver des lots." };

  const assocEmail = assoc.email ?? user.email;
  if (!assocEmail)
    return { success: false, error: "Email association introuvable." };

  const { data: lots, error: lotsError } = await admin
    .from("lot")
    .select(
      "id_lot, nature, name_entreprise, adresse_recup, id_commercant, category, quantity, dlc, montant_chiffre, montant_lettre, instructions",
    )
    .in("id_lot", lotIds)
    .eq("statut", true);

  if (lotsError || !lots?.length) {
    return { success: false, error: "Impossible de récupérer les lots." };
  }

  const commercantIds = [...new Set(lots.map((l) => l.id_commercant))];
  const { data: commercants } = await admin
    .from("commercant")
    .select("id_commercant, email, name_entreprise")
    .in("id_commercant", commercantIds);

  const commercantMap = new Map(
    (commercants ?? []).map((c) => [c.id_commercant, c]),
  );

  type LotRow = (typeof lots)[0];
  const byCommercant: Record<number, LotRow[]> = {};
  for (const lot of lots) {
    if (!byCommercant[lot.id_commercant]) byCommercant[lot.id_commercant] = [];
    byCommercant[lot.id_commercant].push(lot);
  }

  const merchantGroups = Object.entries(byCommercant).map(
    ([idStr, groupLots]) => {
      const id_commercant = Number(idStr);
      return {
        id_commercant,
        lots: groupLots,
        code: generateCode(),
        creneauIso: creneaux[id_commercant] ?? Object.values(creneaux)[0],
      };
    },
  );

  const collectRows = merchantGroups.flatMap(
    ({ lots: groupLots, code, creneauIso }) =>
      groupLots.map((lot) => ({
        id_lot: lot.id_lot,
        id_association: assoc.id_association,
        statut: false,
        date: now.toISOString(),
        creneau: creneauIso,
        code_retrait: code,
      })),
  );

  const { error: collectError } = await admin
    .from("collect")
    .insert(collectRows);
  if (collectError) {
    return {
      success: false,
      error: "Erreur lors de la réservation : " + collectError.message,
    };
  }

  const emailErrors: string[] = [];

  const assocLotsHtml = merchantGroups
    .map(({ lots: groupLots, code, creneauIso }) => {
      const creneauLabel = formatCreneau(creneauIso);
      const lotsRows = groupLots
        .map((lot) => {
          const dlcLabel = lot.dlc
            ? new Date(lot.dlc).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : null;
          return `
          <tr style="background:#fff;">
            <td colspan="2" style="padding:14px 14px 4px;border-top:1px solid #e5e7eb;">
              <span style="font-weight:bold;color:#06573f;font-size:15px;">${esc(lot.nature)}</span>
              <span style="color:#6b7280;font-size:13px;"> — ${esc(lot.category)}</span>
            </td>
          </tr>
          <tr style="background:#fff;">
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Commerçant :</strong> ${esc(lot.name_entreprise)}</td>
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Quantité :</strong> ${lot.quantity}</td>
          </tr>
          <tr style="background:#fff;">
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Adresse :</strong> ${esc(lot.adresse_recup)}</td>
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Valeur :</strong> ${lot.montant_chiffre} €</td>
          </tr>
          ${dlcLabel ? `<tr style="background:#fff;"><td colspan="2" style="padding:2px 14px;color:#374151;font-size:13px;"><strong>DLC :</strong> ${dlcLabel}</td></tr>` : ""}
          ${lot.instructions ? `<tr style="background:#fff;"><td colspan="2" style="padding:2px 14px 8px;color:#374151;font-size:13px;"><strong>Instructions :</strong> ${esc(lot.instructions)}</td></tr>` : ""}`;
        })
        .join("");
      return `
        <tr style="background:#f0fdf4;">
          <td colspan="2" style="padding:12px 14px 4px;">
            <p style="margin:0;font-weight:bold;color:#06573f;font-size:13px;">Créneau : ${esc(creneauLabel)}</p>
          </td>
        </tr>
        ${lotsRows}
        <tr style="background:#f9fafb;">
          <td colspan="2" style="padding:10px 14px 14px;">
            <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Code de retrait</span><br/>
            <span style="font-weight:bold;letter-spacing:4px;font-size:24px;color:#06573f;">${esc(code)}</span>
          </td>
        </tr>`;
    })
    .join("");

  const { error: assocEmailError } = await resend.emails.send({
    from: "Récoltéo <onboarding@resend.dev>",
    to: assocEmail,
    subject: "Votre réservation est confirmée — Récoltéo",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9f242;margin:0;font-size:24px;">Réservation confirmée !</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
          <p style="color:#374151;">Bonjour <strong>${esc(assoc.name_entreprise)}</strong>,</p>
          <p style="color:#374151;">Votre réservation de <strong>${lots.length} lot(s)</strong> a bien été enregistrée.</p>
          <p style="color:#374151;font-weight:bold;margin-top:24px;">Détail de vos lots et codes de retrait :</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tbody>${assocLotsHtml}</tbody>
          </table>
          <p style="color:#6b7280;font-size:13px;margin-top:24px;">Présentez le code de retrait au commerçant lors de la récupération.</p>
          <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
        </div>
      </div>`,
  });

  if (assocEmailError) {
    emailErrors.push(
      `Association (${assocEmail}) : ${assocEmailError.message}`,
    );
  }

  await Promise.all(
    merchantGroups.map(
      async ({ id_commercant, lots: groupLots, creneauIso }) => {
        const commercant = commercantMap.get(id_commercant);
        if (!commercant?.email) return;

        const creneauLabel = formatCreneau(creneauIso);
        const merchantLotsHtml = groupLots
          .map((lot) => {
            const dlcLabel = lot.dlc
              ? new Date(lot.dlc).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : null;
            return `
          <tr style="background:#fff;">
            <td colspan="2" style="padding:14px 14px 4px;border-top:1px solid #e5e7eb;">
              <span style="font-weight:bold;color:#06573f;font-size:15px;">${esc(lot.nature)}</span>
              <span style="color:#6b7280;font-size:13px;"> — ${esc(lot.category)}</span>
            </td>
          </tr>
          <tr style="background:#fff;">
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Quantité :</strong> ${lot.quantity}</td>
            <td style="padding:2px 14px;color:#374151;font-size:13px;"><strong>Valeur :</strong> ${lot.montant_chiffre} €</td>
          </tr>
          ${dlcLabel ? `<tr style="background:#fff;"><td colspan="2" style="padding:2px 14px 8px;color:#374151;font-size:13px;"><strong>DLC :</strong> ${dlcLabel}</td></tr>` : ""}
          ${lot.instructions ? `<tr style="background:#fff;"><td colspan="2" style="padding:2px 14px 8px;color:#374151;font-size:13px;"><strong>Instructions :</strong> ${esc(lot.instructions)}</td></tr>` : ""}`;
          })
          .join("");

        const { error: commercantEmailError } = await resend.emails.send({
          from: "Récoltéo <onboarding@resend.dev>",
          to: commercant.email,
          subject: `Réservation de lot par ${esc(assoc.name_entreprise)} — Récoltéo`,
          html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:#c9f242;margin:0;font-size:24px;">Réservation de lot</h1>
            </div>
            <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
              <p style="color:#374151;">Bonjour <strong>${esc(commercant.name_entreprise)}</strong>,</p>
              <p style="color:#374151;">L'association <strong>${esc(assoc.name_entreprise)}</strong> a réservé votre/vos lot(s).</p>
              <div style="background:rgba(6,87,63,0.08);border:1px solid rgba(6,87,63,0.2);border-radius:8px;padding:16px;margin:16px 0;">
                <p style="margin:0;font-weight:bold;color:#06573f;">Créneau prévu</p>
                <p style="margin:8px 0 0;color:#374151;font-size:16px;">${esc(creneauLabel)}</p>
              </div>
              <p style="color:#374151;font-weight:bold;margin-top:24px;">Détail des lots réservés :</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tbody>${merchantLotsHtml}</tbody>
              </table>
              <p style="color:#6b7280;font-size:13px;margin-top:24px;">Pour valider la collecte, demandez le code de retrait à l'association et saisissez-le dans votre espace profil.</p>
              <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
            </div>
          </div>`,
        });

        if (commercantEmailError) {
          emailErrors.push(
            `Commerçant (${commercant.email}) : ${commercantEmailError.message}`,
          );
        }
      },
    ),
  );

  await admin.from("lot").update({ statut: false }).in("id_lot", lotIds);

  return {
    success: true,
    merchantCodes: merchantGroups.map(
      ({ id_commercant, lots: groupLots, code, creneauIso }) => ({
        id_commercant,
        name_entreprise: groupLots[0].name_entreprise,
        adresse_recup: groupLots[0].adresse_recup,
        lots: groupLots.map((l) => ({ id_lot: l.id_lot, nature: l.nature })),
        code,
        creneau: formatCreneau(creneauIso),
      }),
    ),
    ...(emailErrors.length > 0 && { emailErrors }),
  };
}
