"use client";

import { useState, useTransition } from "react";
import { Clock, UserX, Shield } from "@deemlol/next-icons";
import { signOut } from "@/src/app/login/actions";
import Button from "@/src/components/ui/primitives/Button";
import TabToggle from "@/src/components/ui/primitives/TabToggle";
import ValueCard from "@/src/components/ui/cards/ValueCard";
import Reveal from "@/src/components/animations/Reveal";
import ProfilHeader from "./ProfilHeader";
import InfoTab, { type EntityInfo } from "./InfoTab";
import DocsTab from "./DocsTab";
import DeleteConfirmModal from "./DeleteConfirmModal";

type Tab = "info" | "docs" | "historique";

const TABS = [
  { value: "info", label: "Informations" },
  { value: "docs", label: "Documents" },
  { value: "historique", label: "Historique" },
];

const ROLE_SUBTITLE: Record<"commercant" | "association" | "admin", string> = {
  admin:
    "Gérez les membres, validez les documents et administrez la plateforme Récoltéo.",
  commercant:
    "Gérez vos informations, déposez vos justificatifs et suivez votre activité.",
  association:
    "Gérez vos informations, déposez vos justificatifs et développez vos partenariats.",
};

interface ProfilLayoutProps {
  nom: string;
  role: "commercant" | "association" | "admin";
  authId: string;
  entityInfo: EntityInfo | null;
}

export default function ProfilLayout({
  nom,
  role,
  authId,
  entityInfo,
}: ProfilLayoutProps) {
  const [tab, setTab] = useState<Tab>("info");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isPendingSignOut, startSignOut] = useTransition();

  return (
    <div className="flex flex-col gap-8">
      <Reveal delay={0}>
        <ProfilHeader nom={nom} role={role} />
      </Reveal>

      <Reveal delay={0.08}>
        <p className="text-sapin/65 leading-relaxed">{ROLE_SUBTITLE[role]}</p>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="flex flex-col gap-5">
          <TabToggle
            tabs={TABS}
            active={tab}
            onChange={(v) => setTab(v as Tab)}
            fullWidth
          />
          <div className="min-h-72">
            {tab === "info" && <InfoTab entityInfo={entityInfo} />}
            {tab === "docs" && <DocsTab role={role} authId={authId} />}
            {tab === "historique" && (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-sapin/5 border border-dashed border-sapin/20 flex items-center justify-center">
                  <Clock size={26} className="text-sapin/30" />
                </div>
                <div>
                  <p className="font-bold text-sapin/60">Bientôt disponible</p>
                  <p className="text-sapin/40 mt-1 max-w-xs">
                    L'historique de vos activités sera disponible dans une
                    prochaine version.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.24}>
        <ValueCard
          icon={<Shield size={20} />}
          title="Données protégées"
          description="Vos informations sont chiffrées et accessibles uniquement par l'équipe Récoltéo."
        />
      </Reveal>

      <Reveal delay={0.3}>
        <div className="border-t border-sapin/10 pt-6 flex flex-col gap-3">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-peach/25 text-peach font-bold hover:bg-peach hover:text-cream hover:border-peach transition-all"
          >
            <UserX size={20} />
            Supprimer mon compte et mes données
          </button>
          <Button
            label={isPendingSignOut ? "Déconnexion…" : "Se déconnecter"}
            variant="sapin"
            showArrow={false}
            disabled={isPendingSignOut}
            onClick={() => startSignOut(() => signOut())}
            className="w-full justify-center"
          />
        </div>
      </Reveal>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
