import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { entreprise, email, message } = await req.json();
  if (!entreprise || !email || !message) {
    return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Recolteo <contact@recolteo.app>",
      to: "lorys3006@gmail.com",
      subject: `Nouveau message de ${entreprise}`,
      html: `<p><strong>Entreprise :</strong> ${entreprise}</p><p><strong>Email :</strong> ${email}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, "<br />")}</p>`,
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Échec de l'envoi" }), { status: 500 });
  }
}
