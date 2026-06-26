import "server-only";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { stripe } from "@/src/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return Response.json({ error: "Introuvable" }, { status: 404 });

  const { data: asso } = await admin
    .from("association")
    .select("id_association, stripe_subscription_id")
    .eq("id_user", userRow.id_user)
    .maybeSingle();
  if (!asso?.stripe_subscription_id)
    return Response.json({ error: "Aucun abonnement actif" }, { status: 400 });

  await stripe.subscriptions.update(asso.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  return Response.json({ ok: true });
}
