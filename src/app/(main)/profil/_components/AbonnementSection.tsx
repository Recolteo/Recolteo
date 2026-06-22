"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Calendar } from "@deemlol/next-icons";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import Button from "@/src/components/ui/primitives/Button";
import ValueCard from "@/src/components/ui/cards/ValueCard";
import ConfirmCancelSubscriptionModal from "@/src/components/ui/modals/ConfirmCancelSubscriptionModal";
import {
  fetchSetupIntentSecret,
  activateSubscription,
  requestCancelSubscription,
  requestReactivateSubscription,
} from "../_hooks/useStripeSetup";
import { getAssociationSubscription } from "../actions";
import type { SubscriptionInfo } from "../actions";

const StripePaymentSetup = dynamic(() => import("./StripePaymentSetup"), {
  ssr: false,
});

const STATUS_LABELS: Record<string, string> = {
  trialing: "Période d'essai",
  active: "Actif",
  past_due: "Renouvellement en échec",
  canceled: "Résilié",
  incomplete: "En attente",
  none: "Non activé",
};

export default function AbonnementSection() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reactivatePending, startReactivate] = useTransition();

  const reload = useCallback(() => {
    setInfo(null);
    setClientSecret(null);
    setFetchCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getAssociationSubscription().then((d) => {
      if (!cancelled) setInfo(d);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  const loading = info === null;
  const status = info?.status ?? "none";
  const isActive = status === "active" || status === "trialing";
  const periodEnd = info?.currentPeriodEnd
    ? new Date(info.currentPeriodEnd).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const toggle = () => {
    const savedY = window.scrollY;
    const next = !open;
    setOpen(next);
    if (next && info && !clientSecret) {
      fetchSetupIntentSecret("association").then((s) => {
        if (s) setClientSecret(s);
      });
    }
    requestAnimationFrame(() => window.scrollTo(0, savedY));
  };

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
          Abonnement
        </span>
        <div className="flex items-center gap-3 shrink-0">
          {!loading && (
            <span className="font-semibold text-sapin leading-snug">
              {STATUS_LABELS[status] ?? status}
            </span>
          )}
          <ChevronDown
            size={20}
            className={`text-sapin transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-4 pb-5 pr-1 flex flex-col gap-4">
            {loading ? (
              <LoadingSpinner />
            ) : isActive ? (
              <>
                {periodEnd && (
                  <div className="rounded-xl border border-sapin/15 bg-sapin/5 p-4 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-sapin/50 uppercase tracking-widest">
                      {status === "trialing"
                        ? "Fin de la période d'essai"
                        : "Prochain renouvellement"}
                    </p>
                    <p className="font-bold text-sapin">{periodEnd}</p>
                    {info?.annualPrice != null && (
                      <p className="text-xs text-sapin/50 mt-0.5">
                        {status === "trialing"
                          ? `Le prélèvement annuel de ${info.annualPrice} € sera effectué automatiquement à cette date.`
                          : `${info.annualPrice} € / an`}
                      </p>
                    )}
                  </div>
                )}
                {clientSecret ? (
                  <StripePaymentSetup
                    clientSecret={clientSecret}
                    submitLabel="Enregistrer mes modifications"
                    onPaymentMethodId={activateSubscription}
                    onSuccess={reload}
                    beforeSubmit={
                      info?.cancelAtPeriodEnd ? (
                        <div className="rounded-xl border border-sapin/15 bg-sapin/5 p-4 flex flex-col gap-2">
                          <p className="text-sm text-sapin/70">
                            Résiliation effective le {periodEnd}. Votre accès reste
                            actif jusqu'à cette date.
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              startReactivate(async () => {
                                await requestReactivateSubscription();
                                reload();
                              })
                            }
                            disabled={reactivatePending}
                            className="text-sm text-sapin/40 hover:text-sapin/70 transition-colors underline underline-offset-2 text-left w-fit"
                          >
                            {reactivatePending ? "En cours…" : "Réactiver mon abonnement"}
                          </button>
                        </div>
                      ) : (
                        <Button
                          label="Résilier mon abonnement"
                          onClick={() => setShowCancelModal(true)}
                          variant="peach-outline"
                          showArrow={false}
                        />
                      )
                    }
                  />
                ) : (
                  <LoadingSpinner />
                )}
              </>
            ) : clientSecret ? (
              <>
                <ValueCard
                  icon={<Calendar size={20} />}
                  title="6 mois d'essai gratuit"
                  description={`Puis ${info?.annualPrice != null ? `${info.annualPrice} €` : "—"} / an. Accès complet à la plateforme, résiliable à l'échéance.`}
                />
                <StripePaymentSetup
                  clientSecret={clientSecret}
                  submitLabel="Activer mon abonnement"
                  onPaymentMethodId={activateSubscription}
                  onSuccess={reload}
                />
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
      <ConfirmCancelSubscriptionModal
        isOpen={showCancelModal}
        periodEnd={periodEnd}
        onConfirm={async () => {
          await requestCancelSubscription();
          setShowCancelModal(false);
          reload();
        }}
        onCancel={() => setShowCancelModal(false)}
      />
    </>
  );
}
