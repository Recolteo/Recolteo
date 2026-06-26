"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Euro } from "@deemlol/next-icons";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import { fetchSetupIntentSecret } from "../../_hooks/useStripeSetup";
import { getCommercantPaymentMethod, saveCommercantPaymentMethod } from "../../actions";
import type { PaymentMethodInfo } from "../../actions";
import ValueCard from "@/src/components/ui/cards/ValueCard";

const StripePaymentSetup = dynamic(() => import("../StripePaymentSetup"), { ssr: false });

export default function PaiementCommercantTab() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<PaymentMethodInfo | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const reload = useCallback(() => {
    setInfo(null);
    setClientSecret(null);
    setFetchCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCommercantPaymentMethod().then((d: PaymentMethodInfo) => {
      if (!cancelled) setInfo(d);
    });
    return () => { cancelled = true; };
  }, [fetchCount]);

  useEffect(() => {
    if (open && info !== null && !clientSecret) {
      fetchSetupIntentSecret("commercant").then((s) => {
        if (s) setClientSecret(s);
      });
    }
  }, [open, info, clientSecret]);

  const toggle = () => {
    const savedY = window.scrollY;
    setOpen((prev) => !prev);
    requestAnimationFrame(() => window.scrollTo(0, savedY));
  };

  const loading = info === null;
  const statusLabel = info?.hasPaymentMethod
    ? (info.type === "sepa_debit"
        ? `Prélèvement SEPA •••• ${info.last4 ?? ""}`
        : `Carte bancaire •••• ${info.last4 ?? ""}`)
    : "Non renseigné";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        onMouseDown={(e) => e.preventDefault()}
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-6 py-3.5 border-b border-sapin/8"
      >
        <span className="text-[11px] font-black uppercase tracking-widest text-sapin/40 shrink-0">
          Paiement
        </span>
        <div className="flex items-center gap-3 shrink-0">
          {!loading && (
            <span className="font-semibold text-sapin leading-snug">{statusLabel}</span>
          )}
          <ChevronDown
            size={20}
            className={`text-sapin transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pt-4 pb-5 pr-1 flex flex-col gap-4">
            {loading ? (
              <LoadingSpinner />
            ) : clientSecret ? (
              <>
                <ValueCard
                  icon={<Euro size={20} />}
                  title="Facilitez vos moyens de paiement"
                  description="Bénéficiez d'une exonération de 50% sur vos impôts"
                />
                <StripePaymentSetup
                  clientSecret={clientSecret}
                  submitLabel="Enregistrer mes modifications"
                  onPaymentMethodId={async (pmId) => {
                    const r = await saveCommercantPaymentMethod(pmId);
                    return { ok: r.success, error: r.error };
                  }}
                  onSuccess={reload}
                />
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
