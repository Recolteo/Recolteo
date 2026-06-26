import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { stripe } from "@/src/lib/stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const entityType = body?.entityType;
  if (entityType !== "association" && entityType !== "commercant")
    return Response.json({ error: "Type invalide" }, { status: 400 });

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();
  if (!userRow) return Response.json({ error: "Introuvable" }, { status: 404 });

  let entityId: number;
  let name: string;
  let email: string;
  let existingCustomerId: string | null;

  if (entityType === "association") {
    const { data } = await admin
      .from("association")
      .select("id_association, name_entreprise, email, stripe_customer_id")
      .eq("id_user", userRow.id_user)
      .maybeSingle();
    if (!data) return Response.json({ error: "Introuvable" }, { status: 404 });
    entityId = data.id_association;
    name = data.name_entreprise;
    email = data.email;
    existingCustomerId = data.stripe_customer_id;
  } else {
    const { data } = await admin
      .from("commercant")
      .select("id_commercant, name_entreprise, email, stripe_customer_id")
      .eq("id_user", userRow.id_user)
      .maybeSingle();
    if (!data) return Response.json({ error: "Introuvable" }, { status: 404 });
    entityId = data.id_commercant;
    name = data.name_entreprise;
    email = data.email;
    existingCustomerId = data.stripe_customer_id;
  }

  let customerId = existingCustomerId ?? "";
  if (!customerId) {
    const customer = await stripe.customers.create({
      name,
      email,
      metadata: { entityType, entityId: String(entityId) },
    });
    customerId = customer.id;
    const table = entityType === "association" ? "association" : "commercant";
    const idCol = entityType === "association" ? "id_association" : "id_commercant";
    await admin.from(table).update({ stripe_customer_id: customerId }).eq(idCol, entityId);
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["sepa_debit", "card"],
    usage: "off_session",
  });

  return Response.json({ clientSecret: setupIntent.client_secret });
}
