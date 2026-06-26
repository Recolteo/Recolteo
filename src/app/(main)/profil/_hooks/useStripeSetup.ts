export async function fetchSetupIntentSecret(
  entityType: "association" | "commercant",
): Promise<string | null> {
  const res = await fetch("/api/stripe/setup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityType }),
  });
  const data = (await res.json()) as { clientSecret?: string };
  return data.clientSecret ?? null;
}

export async function activateSubscription(
  paymentMethodId: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/stripe/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentMethodId }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string };
  return { ok: res.ok && !!data.ok, error: data.error };
}

export async function requestCancelSubscription(): Promise<boolean> {
  const res = await fetch("/api/stripe/cancel-subscription", {
    method: "POST",
  });
  return res.ok;
}

export async function requestReactivateSubscription(): Promise<boolean> {
  const res = await fetch("/api/stripe/reactivate-subscription", {
    method: "POST",
  });
  return res.ok;
}
