import "server-only";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/src/lib/stripe";
import { Resend } from "resend";
import type Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

function emailHtml(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#06573f;padding:24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#c9f242;margin:0;font-size:22px;">${title}</h1>
    </div>
    <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
      ${body}
      <p style="margin-top:24px;color:#374151;">L'équipe <strong>Récoltéo</strong></p>
    </div>
  </div>`;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const admin = createAdminClient();
  const { data: asso } = await admin
    .from("association")
    .select("id_association")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!asso) return;

  await admin
    .from("association")
    .update({
      stripe_subscription_status: sub.status,
      subscription_current_period_end: new Date(
        (sub.trial_end ?? sub.items.data[0]?.current_period_end ?? 0) * 1000,
      ).toISOString(),
    })
    .eq("id_association", asso.id_association);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const admin = createAdminClient();
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const { data: asso } = await admin
    .from("association")
    .select("id_association")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (!asso) return;

  await admin
    .from("association")
    .update({
      stripe_subscription_status: "active",
      renewal_reminder_30_sent: false,
      renewal_reminder_7_sent: false,
    })
    .eq("id_association", asso.id_association);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const admin = createAdminClient();
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const { data: asso, error: dbErr } = await admin
    .from("association")
    .select("id_association, email, name_entreprise")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (dbErr) throw new Error(`DB lookup failed: ${dbErr.message}`);
  if (!asso?.email) return;

  try {
    await resend.emails.send({
      from: "Récoltéo <onboarding@resend.dev>",
      to: asso.email,
      subject: "Échec de paiement de votre abonnement Récoltéo",
      html: emailHtml(
        "Échec de paiement",
        `<p style="color:#374151;">Bonjour <strong>${asso.name_entreprise}</strong>,</p>
         <p style="color:#374151;">Le prélèvement de votre abonnement annuel a échoué. Mettez à jour votre moyen de paiement dans votre profil pour conserver l'accès.</p>`,
      ),
    });
  } catch (emailErr) {
    console.error("[stripe-webhook] Email échec paiement non envoyé à", asso.email, ":", emailErr);
  }
}

async function handleUpcomingInvoice(invoice: Stripe.Invoice) {
  const admin = createAdminClient();
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const { data: asso } = await admin
    .from("association")
    .select("id_association, email, name_entreprise, subscription_current_period_end, renewal_reminder_30_sent, renewal_reminder_7_sent")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (!asso?.email) return;

  const periodEnd = asso.subscription_current_period_end
    ? new Date(asso.subscription_current_period_end)
    : null;

  const daysUntilRenewal = periodEnd
    ? Math.ceil((periodEnd.getTime() - Date.now()) / 86_400_000)
    : null;

  const renewalDate = periodEnd
    ? periodEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const amountLabel = invoice.amount_due
    ? `${(invoice.amount_due / 100).toLocaleString("fr-FR")} €`
    : "";

  if (!asso.renewal_reminder_7_sent && daysUntilRenewal !== null && daysUntilRenewal <= 7) {
    const { error: updateErr } = await admin
      .from("association")
      .update({ renewal_reminder_7_sent: true })
      .eq("id_association", asso.id_association);
    if (updateErr) throw new Error(`DB update reminder_7 failed: ${updateErr.message}`);
    try {
      await resend.emails.send({
        from: "Récoltéo <onboarding@resend.dev>",
        to: asso.email,
        subject: "Votre abonnement Récoltéo sera renouvelé dans 7 jours",
        html: emailHtml(
          "Renouvellement dans 7 jours",
          `<p style="color:#374151;">Bonjour <strong>${asso.name_entreprise}</strong>,</p>
           <p style="color:#374151;">Votre abonnement annuel Récoltéo${amountLabel ? ` (${amountLabel})` : ""} sera renouvelé automatiquement le <strong>${renewalDate}</strong>.</p>
           <p style="color:#374151;">Si vous ne souhaitez pas renouveler, rendez-vous dans votre profil onglet <strong>Abonnement</strong> avant cette date.</p>`,
        ),
      });
    } catch (emailErr) {
      console.error("[stripe-webhook] Email rappel 7j non envoyé à", asso.email, ":", emailErr);
    }
    return;
  }

  if (!asso.renewal_reminder_30_sent) {
    const { error: updateErr } = await admin
      .from("association")
      .update({ renewal_reminder_30_sent: true })
      .eq("id_association", asso.id_association);
    if (updateErr) throw new Error(`DB update reminder_30 failed: ${updateErr.message}`);
    try {
      await resend.emails.send({
        from: "Récoltéo <onboarding@resend.dev>",
        to: asso.email,
        subject: "Votre abonnement Récoltéo sera renouvelé dans 30 jours",
        html: emailHtml(
          "Renouvellement dans 30 jours",
          `<p style="color:#374151;">Bonjour <strong>${asso.name_entreprise}</strong>,</p>
           <p style="color:#374151;">Votre abonnement annuel Récoltéo${amountLabel ? ` (${amountLabel})` : ""} sera renouvelé automatiquement le <strong>${renewalDate}</strong>.</p>
           <p style="color:#374151;">Si vous ne souhaitez pas renouveler, rendez-vous dans votre profil onglet <strong>Abonnement</strong> avant cette date.</p>`,
        ),
      });
    } catch (emailErr) {
      console.error("[stripe-webhook] Email rappel 30j non envoyé à", asso.email, ":", emailErr);
    }
  }
}

async function handleTrialWillEnd(sub: Stripe.Subscription) {
  const admin = createAdminClient();
  const { data: asso } = await admin
    .from("association")
    .select("id_association, email, name_entreprise")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!asso?.email) return;

  const trialEnd = sub.trial_end
    ? new Date(sub.trial_end * 1000).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const priceAmount = sub.items.data[0]?.price?.unit_amount;
  const amountLabel = priceAmount ? `${(priceAmount / 100).toLocaleString("fr-FR")} €` : "";

  try {
    await resend.emails.send({
      from: "Récoltéo <onboarding@resend.dev>",
      to: asso.email,
      subject: "Votre période d'essai Récoltéo se termine bientôt",
      html: emailHtml(
        "Fin de période d'essai",
        `<p style="color:#374151;">Bonjour <strong>${asso.name_entreprise}</strong>,</p>
         <p style="color:#374151;">Votre période d'essai gratuite se termine le <strong>${trialEnd}</strong>. Votre abonnement annuel${amountLabel ? ` (${amountLabel})` : ""} sera prélevé automatiquement à cette date.</p>
         <p style="color:#374151;">Vérifiez que votre moyen de paiement est à jour dans votre profil.</p>`,
      ),
    });
  } catch (emailErr) {
    console.error("[stripe-webhook] Email fin d'essai non envoyé à", asso.email, ":", emailErr);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "invoice.upcoming":
        await handleUpcomingInvoice(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[stripe-webhook] Échec de traitement pour ${event.type}: ${message}`);
    return new Response(`Erreur temporaire — ${message}`, { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
