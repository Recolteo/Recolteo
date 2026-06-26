import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyAdminDocumentsReady({
  nameEntreprise,
  role,
  isModification,
}: {
  nameEntreprise: string;
  role: "commercant" | "association";
  isModification: boolean;
}) {
  const e = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const roleLabel = role === "commercant" ? "Commerçant" : "Association";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const action = isModification ? "mis à jour" : "déposés";
  const subject = isModification
    ? `[Récoltéo] Documents modifiés à re-vérifier — ${e(nameEntreprise)}`
    : `[Récoltéo] Documents à vérifier — ${e(nameEntreprise)}`;

  await resend.emails.send({
    from: "Récoltéo <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL!,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #06573f;">Documents ${action}</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 6px 0; font-weight: bold;">Type</td><td>${roleLabel}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Structure</td><td>${e(nameEntreprise)}</td></tr>
          <tr><td style="padding: 6px 0;">
            ${isModification ? "Un ou plusieurs documents ont été remplacés et nécessitent une nouvelle vérification." : "Les 3 documents ont été déposés pour la première fois."}
          </td></tr>
        </table>
        <br/>
        <a href="${appUrl}/admin/structures" style="background:#06573f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Vérifier les documents →
        </a>
      </div>
    `,
  });
}

export async function notifyAdminNewProfile({
  nom,
  email,
  role,
  nameEntreprise,
}: {
  nom: string;
  email: string;
  role: "commercant" | "association";
  nameEntreprise: string;
}) {
  const e = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const roleLabel = role === "commercant" ? "Commerçant" : "Association";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await resend.emails.send({
    from: "Récoltéo <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL!,
    subject: `[Récoltéo] Nouveau profil à valider — ${e(nameEntreprise)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #06573f;">Nouveau profil en attente de validation</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 6px 0; font-weight: bold;">Type</td><td>${roleLabel}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Nom</td><td>${e(nom)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email</td><td>${e(email)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Structure</td><td>${e(nameEntreprise)}</td></tr>
        </table>
        <br/>
        <a href="${appUrl}/admin" style="background:#06573f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Accéder à l'espace admin →
        </a>
      </div>
    `,
  });
}
