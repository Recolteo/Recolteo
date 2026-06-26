"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";

function ModalContent({
  periodEnd,
  onConfirm,
  onCancel,
}: {
  periodEnd: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-200 bg-cream/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel}
      />
      <motion.div
        className="fixed inset-0 z-201 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="pointer-events-auto w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl border-2 border-sapin/10 shadow-[6px_6px_0_0_#04251c] overflow-hidden"
          initial={{ y: 60, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b-2 border-sapin/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach border border-peach shadow-[2px_2px_0_0_#d54a00] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-cream" />
              </div>
              <h3 className="font-black text-sapin">Résilier l'abonnement</h3>
            </div>
            <button
              onClick={onCancel}
              className="w-9 h-9 rounded-xl border-2 border-sapin/15 text-sapin flex items-center justify-center hover:bg-sapin hover:text-cream hover:border-sapin transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            <div className="bg-peach/8 border border-peach/20 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={16} className="text-peach shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="block font-black text-sapin">
                  Résiliation à l'échéance
                </span>
                <span className="block text-sapin/65 leading-snug">
                  Votre abonnement sera résilié à la fin de la période en cours
                  {periodEnd ? (
                    <>
                      {" "}
                      (<span className="font-bold text-sapin">{periodEnd}</span>
                      )
                    </>
                  ) : null}
                  . Vous conservez l'accès jusqu'à cette date.
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                label="Annuler"
                variant="sapin-outline"
                showArrow={false}
                onClick={onCancel}
                className="flex-1 justify-center"
              />
              <Button
                label={isPending ? "En cours…" : "Résilier"}
                variant="peach"
                showArrow={false}
                disabled={isPending}
                onClick={() => startTransition(() => onConfirm())}
                className="flex-1 justify-center"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function ConfirmCancelSubscriptionModal({
  isOpen,
  periodEnd,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  periodEnd: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted] = useState(() => typeof window !== "undefined");
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalContent
          key="modal"
          periodEnd={periodEnd}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}
