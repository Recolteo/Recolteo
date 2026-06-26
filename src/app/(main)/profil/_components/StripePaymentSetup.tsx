"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "@/src/components/ui/primitives/Button";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface FormProps {
  submitLabel: string;
  onPaymentMethodId: (pmId: string) => Promise<{ ok: boolean; error?: string }>;
  onSuccess: () => void;
  beforeSubmit?: React.ReactNode;
}

function InnerForm({ submitLabel, onPaymentMethodId, onSuccess, beforeSubmit }: FormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || pending) return;
    setError(null);
    setPending(true);
    try {
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: `${window.location.origin}/profil` },
        redirect: "if_required",
      });
      if (confirmError) {
        setError(confirmError.message ?? "Erreur.");
        return;
      }
      const pmId =
        typeof setupIntent?.payment_method === "string"
          ? setupIntent.payment_method
          : setupIntent?.payment_method?.id;
      if (!pmId) {
        setError("Moyen de paiement indisponible.");
        return;
      }
      const result = await onPaymentMethodId(pmId);
      if (!result.ok) {
        setError(result.error ?? "Erreur.");
        return;
      }
      onSuccess();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement
        options={{
          layout: "tabs",
          terms: { sepaDebit: "never", card: "never" },
        }}
      />
      <p className="text-xs text-sapin/80 leading-relaxed">
        En validant, vous autorisez Récoltéo à débiter votre compte via
        prélèvement SEPA ou carte, et votre banque à en exécuter l'instruction.
        Remboursable sous 8 semaines auprès de votre banque.
      </p>
      {error && <p className="text-sm text-peach font-semibold">{error}</p>}
      {beforeSubmit}
      <Button
        label={pending ? "En cours…" : submitLabel}
        type="submit"
        variant="sapin"
        showArrow={false}
        disabled={pending || !stripe || !elements}
        className="w-full justify-center"
      />
    </form>
  );
}

interface StripePaymentSetupProps extends FormProps {
  clientSecret: string;
}

export default function StripePaymentSetup({
  clientSecret,
  ...props
}: StripePaymentSetupProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" }, locale: "fr" }}
    >
      <InnerForm {...props} />
    </Elements>
  );
}
  