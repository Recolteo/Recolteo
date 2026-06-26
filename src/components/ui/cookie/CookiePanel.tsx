"use client";

import { motion } from "motion/react";
import { X } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import CookieCategory from "@/src/components/ui/cookie/CookieCategory";
import type { CookieConsent } from "@/src/lib/cookie-consent";

interface CookiePanelProps {
  draft: CookieConsent;
  onDraftChange: (consent: CookieConsent) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

export default function CookiePanel({
  draft,
  onDraftChange,
  onAcceptAll,
  onRejectAll,
  onClose,
}: CookiePanelProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-cream/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-cream rounded-2xl w-full max-w-md shadow-2xl border border-sapin/10 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-sapin/10 shrink-0">
            <h2 className="font-black text-sapin text-lg">
              Gestion des cookies
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="text-sapin/50 hover:text-sapin transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-2 overflow-y-auto flex-1">
            <p className="text-sm text-sapin/60 leading-relaxed pt-2 pb-1">
              Choisissez les cookies que vous autorisez. Les modifications sont
              appliquées instantanément.
            </p>

            <CookieCategory
              label="Nécessaires"
              description="Indispensables au fonctionnement du site (session, sécurité, authentification). Ne peuvent pas être désactivés."
              checked={true}
              onChange={() => {}}
              disabled
              badge="Toujours actifs"
            />
            <CookieCategory
              label="Analytiques"
              description="Permettent de mesurer l'audience et d'améliorer le site (pages vues, parcours, erreurs). Données anonymisées, sans pistage individuel."
              checked={draft.analytiques}
              onChange={(v) => onDraftChange({ ...draft, analytiques: v })}
            />
            <CookieCategory
              label="Fonctionnels"
              description="Mémorisent vos préférences pour améliorer votre expérience (filtres actifs, affichage). Aucune donnée transmise à des tiers."
              checked={draft.fonctionnels}
              onChange={(v) => onDraftChange({ ...draft, fonctionnels: v })}
            />
            <CookieCategory
              label="Géolocalisation"
              description="Permet aux associations de filtrer les lots par proximité géographique en géocodant leur adresse via l'API de la Base Adresse Nationale (data.gouv.fr). Aucune donnée de position GPS n'est collectée."
              checked={draft.geolocalisation}
              onChange={(v) => onDraftChange({ ...draft, geolocalisation: v })}
            />
          </div>

          <div className="px-6 py-5 flex flex-col sm:flex-row gap-2 border-t border-sapin/10">
            <Button
              label="Tout refuser"
              onClick={onRejectAll}
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
    </>
  );
}
