"use server";

import { Resend } from "resend";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export type BreachSeverity = "low" | "high" | "critical";

export type BreachState = { error?: string; success?: boolean; detectedAt?: string };

export async function notifyBreach(
  _: BreachState,
  formData: FormData
): Promise<BreachState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase.from("administrateur").select("id_admin").maybeSingle();
  if (!adminRow) redirect("/");

  const description = (formData.get("description") as string ?? "").trim().slice(0, 2000);
  const severity = formData.get("severity") as BreachSeverity;
  const affectedData = (formData.get("affected_data") as string ?? "").trim().slice(0, 500);
  const notifyUsers = formData.get("notify_users") === "on";

  if (!description || !affectedData || !["low", "high", "critical"].includes(severity)) {
    return { error: "Tous les champs sont obligatoires." };
  }

  const detectedAt = new Date().toISOString();
  const severityLabel = { low: "Faible", high: "Élevée", critical: "Critique" }[severity];

  await resend.emails.send({
    from: "Récoltéo Sécurité <noreply@recolteo.fr>",
    to: ADMIN_EMAIL,
    subject: `[VIOLATION DONNÉES ${severityLabel.toUpperCase()}] Récoltéo — ${detectedAt.slice(0, 10)}`,
    html: `
      <h1>Notification de violation de données personnelles</h1>
      <table cellpadding="8" border="1" style="border-collapse:collapse">
        <tr><th>Détecté le</th><td>${detectedAt}</td></tr>
        <tr><th>Sévérité</th><td><strong>${severityLabel}</strong></td></tr>
        <tr><th>Données concernées</th><td>${affectedData}</td></tr>
      </table>
      <h2>Description</h2>
      <p>${description.replace(/\n/g, "<br>")}</p>
      <hr>
      <h2>Obligations légales (RGPD)</h2>
      <ul>
        <li><strong>Art. 33</strong> — Notifier la CNIL dans les <strong>72 heures</strong> si risque pour les personnes :
          <a href="https://notifications.cnil.fr">notifications.cnil.fr</a></li>
        <li><strong>Art. 33</strong> — Documenter la violation dans le registre interne (même si pas de notification CNIL)</li>
        ${severity === "critical" ? "<li><strong>Art. 34</strong> — Notifier <em>sans délai</em> les personnes concernées (déjà envoyé si case cochée)</li>" : ""}
      </ul>
    `,
  });

  if (notifyUsers && (severity === "high" || severity === "critical")) {
    const admin = createAdminClient();
    const [{ data: commercants }, { data: associations }] = await Promise.all([
      admin.from("commercant").select("email"),
      admin.from("association").select("email"),
    ]);

    const emails = [
      ...(commercants ?? []).map((c) => c.email as string),
      ...(associations ?? []).map((a) => a.email as string),
    ].filter(Boolean);

    // Envoi par lots de 100 (limite Resend)
    for (let i = 0; i < emails.length; i += 100) {
      await resend.batch.send(
        emails.slice(i, i + 100).map((to) => ({
          from: "Récoltéo <noreply@recolteo.fr>",
          to,
          subject: "Information importante concernant votre compte Récoltéo",
          html: `
            <h1>Information importante</h1>
            <p>Nous vous informons qu'une violation de données a été détectée sur la plateforme Récoltéo le ${detectedAt.slice(0, 10)}.</p>
            <p><strong>Données potentiellement concernées :</strong> ${affectedData}</p>
            <p>Nous prenons cet incident très au sérieux et avons mis en place les mesures correctives nécessaires.
            Si vous constatez une activité suspecte sur votre compte, changez votre mot de passe immédiatement.</p>
            <p>Pour toute question : <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
            <hr>
            <p><small>Notification envoyée conformément à l'article 34 du RGPD.</small></p>
          `,
        }))
      );
    }
  }

  return { success: true, detectedAt };
}
