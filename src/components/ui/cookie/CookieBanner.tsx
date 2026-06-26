"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/src/components/ui/primitives/Button";

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export default function CookieBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: CookieBannerProps) {
  return (
    <motion.div
      exit={{ y: "calc(100% + 12px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-3 left-0 right-0 z-50 px-4"
    >
      <div className="max-w-5xl mx-auto bg-cream/90 backdrop-blur-sm border-2 border-sapin/10 rounded-2xl shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1 text-sapin">
            Nous utilisons des cookies
          </p>
          <p className="text-sapin/60 text-xs leading-relaxed">
            Récoltéo utilise des cookies pour le bon fonctionnement du site et,
            avec votre accord, pour analyser l'audience. Aucun cookie
            publicitaire n'est utilisé.{" "}
            <Link
              href="/politique-de-confidentialite"
              className="underline hover:text-sapin transition-colors"
            >
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            label="Tout refuser"
            onClick={onRejectAll}
            variant="sapin-outline"
            showArrow={false}
            size="sm"
          />
          <Button
            label="Personnaliser"
            onClick={onCustomize}
            variant="sapin-outline"
            showArrow={false}
            size="sm"
          />
          <Button
            label="Tout accepter"
            onClick={onAcceptAll}
            variant="sapin"
            showArrow={false}
            size="sm"
          />
        </div>
      </div>
    </motion.div>
  );
}
