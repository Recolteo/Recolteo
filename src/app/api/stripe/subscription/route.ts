import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { stripe, ASSOCIATION_ANNUAL_PRICE_ID, TRIAL_DAYS } from "@/src/lib/stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const paymentMethodId = typeof body?.paymentMethodId === "string" ? body.paymentMethodId : "";
  if (!paymentMethodId.startsWith("pm_"))
    return Response.json({ error: "paymentMethodId invalide" }, { status: 400 });

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return Response.json({ error: "Introuvable" }, { status: 404 });

  const { data: asso } = await admin
    .from("association")
    .select("id_association, stripe_customer_id, stripe_subscription_id")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!asso) return Response.json({ error: "Association introuvable" }, { status: 404 });
  if (!asso.stripe_customer_id)
    return Response.json({ error: "Client Stripe non initialisé" }, { status: 400 });

  try {
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (pm.customer !== asso.stripe_customer_id)
      return Response.json({ error: "Ce moyen de paiement n'appartient pas à votre compte" }, { status: 400 });
  } catch {
    return Response.json({ error: "Moyen de paiement introuvable" }, { status: 400 });
  }

  if (asso.stripe_subscription_id) {
    const existing = await stripe.subscriptions.retrieve(asso.stripe_subscription_id);
    if (["active", "trialing"].includes(existing.status)) {
      await stripe.subscriptions.update(asso.stripe_subscription_id, {
        default_payment_method: paymentMethodId,
      });
      await admin
        .from("association")
        .update({ stripe_payment_method_id: paymentMethodId })
        .eq("id_association", asso.id_association);
      return Response.json({ ok: true });
    }
  }

  const subscription = await stripe.subscriptions.create({
    customer: asso.stripe_customer_id,
    items: [{ price: ASSOCIATION_ANNUAL_PRICE_ID }],
    default_payment_method: paymentMethodId,
    trial_period_days: TRIAL_DAYS,
    payment_settings: {
      payment_method_types: ["sepa_debit", "card"],
      save_default_payment_method: "on_subscription",
    },
  });

  await admin
    .from("association")
    .update({
      stripe_subscription_id: subscription.id,
      stripe_subscription_status: subscription.status,
      stripe_payment_method_id: paymentMethodId,
      subscription_current_period_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq("id_association", asso.id_association);

  return Response.json({ ok: true, status: subscription.status });
}
