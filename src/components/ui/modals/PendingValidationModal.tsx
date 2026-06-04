"use client";

import { useTransition } from "react";
import { Clock, Mail } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import { signOut } from "@/src/app/(public)/login/actions";

export default function PendingValidationModal() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl border-2 border-sapin shadow-[8px_8px_0_0_#04251c]">
      <div className="bg-sapin px-6 pt-10 pb-18 flex flex-col items-center gap-5 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border-2 border-lime/20 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-lime/10 border-2 border-lime/50 flex items-center justify-center">
            <Clock size={40} color="#c9f242" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-cream text-xl sm:text-2xl font-bold leading-snug">
            Profil en cours de validation
          </h2>
          <p className="text-cream/60 text-base">
            Votre dossier a bien été soumis
          </p>
        </div>
      </div>

      <div className="bg-white px-6 pt-6 pb-7 flex flex-col gap-6">
        <div className="-mt-18 bg-white border-2 border-sapin/10 rounded-xl p-4 shadow-[3px_3px_0_0_#06573f20] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-sapin/50 uppercase tracking-wider">
              Progression
            </span>
            <span className="text-xs font-bold text-sapin bg-lime/30 px-2 py-0.5 rounded-full">
              Étape 2 / 3
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-sapin/8 overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-lime" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sapin/40 line-through">Inscription</span>
            <span className="text-sapin font-bold">Validation</span>
            <span className="text-sapin/30">Accès complet</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-9 h-9 bg-lime border border-sapin rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
            <Mail size={20} color="#06573f" />
          </div>
          <p className="text-sapin/65 text-sm leading-relaxed pt-1.5">
            Vous recevrez un e-mail dès que votre profil sera approuvé par
            l'équipe Recolteo.
          </p>
        </div>

        <div className="border-t border-sapin/10 pt-4 flex flex-col">
          <Button
            label={isPending ? "Déconnexion…" : "Se déconnecter"}
            onClick={() => startTransition(() => signOut())}
            variant="sapin"
            showArrow={false}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}
