"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState = {
  success?: boolean;
  error?: string;
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const nom = (formData.get("nom") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const entreprise = (formData.get("entreprise") as string)?.trim();
  const telephone = (formData.get("telephone") as string)?.trim();
  const type_demande = (formData.get("type_demande") as string)?.trim();
  const sujet = (formData.get("sujet") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const rgpd = formData.get("rgpd");

  if (!nom || !email || !type_demande || !message) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (!rgpd) {
    return { error: "Vous devez accepter la politique de confidentialité pour envoyer votre message." };
  }

  const typeLabels: Record<string, string> = {
    technique: "Problème technique",
    facturation: "Facturation",
    compte: "Mon compte",
    partenariat: "Partenariat",
    autre: "Autre",
  };

  try {
    await resend.emails.send({
      from: "Récoltéo <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `[${typeLabels[type_demande] ?? type_demande}] ${sujet || "Nouveau message"} — ${esc(nom)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px;">
          <h2 style="color: #06573f;">Nouveau message de contact</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Nom</td><td>${esc(nom)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email</td><td>${esc(email)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Entreprise</td><td>${esc(entreprise || "—")}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Téléphone</td><td>${esc(telephone || "—")}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Type</td><td>${esc(typeLabels[type_demande] ?? type_demande)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Sujet</td><td>${esc(sujet || "—")}</td></tr>
          </table>
          <p style="margin-top: 16px; font-weight: bold; color: #06573f;">Message :</p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px; color: #333;">${esc(message)}</p>
          <p style="margin-top: 16px; color: #888; font-size: 12px;">Répondre directement à : ${esc(email)}</p>
        </div>
      `,
    });

    return { success: true };
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
  }
}
