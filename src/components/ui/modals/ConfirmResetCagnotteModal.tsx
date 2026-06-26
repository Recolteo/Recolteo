"use client";

import { useEffect, useTransition } from "react";
import { RotateCcw, X } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";

interface ConfirmResetCagnotteModalProps {
  associationName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResetCagnotteModal({
  associationName,
  onConfirm,
  onCancel,
}: ConfirmResetCagnotteModalProps) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleConfirm = () => {
    startTransition(() => {
      onConfirm();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative z-10 w-full max-w-sm bg-white rounded-2xl border-2 border-sapin/10 shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-peach/8 border-b border-peach/15 px-6 py-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-peach/15 border border-peach/25 flex items-center justify-center shrink-0">
              <RotateCcw size={16} className="text-peach" />
            </div>
            <div>
              <h3 className="font-black text-sapin text-sm">
                Réinitialiser la cagnotte
              </h3>
              <p className="text-sapin/50 text-xs mt-0.5">
                Action irréversible
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={pending}
            className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-sapin/70 leading-relaxed">
            Vous êtes sur le point de remettre à zéro la cagnotte de{" "}
            <span className="font-bold text-sapin">&quot;{associationName}&quot;</span>.
            <br />
            Les futures collectes reconstruiront la cagnotte depuis ce point.
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button
            label="Annuler"
            onClick={onCancel}
            disabled={pending}
            variant="sapin-outline"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
          <Button
            label={pending ? "Réinitialisation…" : "Réinitialiser"}
            onClick={handleConfirm}
            disabled={pending}
            variant="peach"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
        </div>
      </div>
    </div>
  );
}
