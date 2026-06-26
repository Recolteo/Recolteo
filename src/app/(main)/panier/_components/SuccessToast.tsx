"use client";

import { useEffect } from "react";
import { CheckCircle, X } from "@deemlol/next-icons";

export default function SuccessToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-sapin text-cream rounded-2xl px-5 py-4 shadow-[4px_4px_0_0_#04251c] max-w-sm">
      <div className="w-8 h-8 rounded-xl bg-lime flex items-center justify-center shrink-0">
        <CheckCircle size={18} className="text-sapin" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">Réservation confirmée !</p>
        <p className="text-cream/70 text-xs mt-0.5">
          Vos codes de retrait ont été envoyés par email.
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-cream/50 hover:text-cream hover:bg-cream/10 transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
