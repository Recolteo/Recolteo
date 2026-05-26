"use client";

import { useState, useTransition } from "react";
import { Clock, UserX, Shield } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import { signOut } from "@/src/app/login/actions";
import Button from "@/src/components/ui/primitives/Button";
import TabToggle from "@/src/components/ui/primitives/TabToggle";
import ValueCard from "@/src/components/ui/cards/ValueCard";
import Reveal from "@/src/components/animations/Reveal";
import ProfilHeader from "./ProfilHeader";
import InfoTab, { type EntityInfo } from "./InfoTab";
import DocsTab from "./DocsTab";
import BreachTab from "./BreachTab";
import CollectesTab from "./CollectesTab";
import HistoriqueCommercantTab from "./HistoriqueCommercantTab";
import HistoriqueAssociationTab from "./HistoriqueAssociationTab";
import DeleteConfirmModal from "./DeleteConfirmModal";

type Tab = "info" | "docs" | "collectes" | "historique" | "securite";

const BASE_TABS = [
  { value: "info", label: "Informations" },
  { value: "docs", label: "Documents" },
  { value: "historique", label: "Historique" },
];

const COMMERCANT_TABS = [
  { value: "info", label: "Informations" },
  { value: "docs", label: "Documents" },
  { value: "collectes", label: "Collectes" },
  { value: "historique", label: "Historique" },
];

const ADMIN_TABS = [
  { value: "info", label: "Informations" },
  { value: "historique", label: "Historique" },
  { value: "securite", label: "Sécurité" },
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
            tabs={
              role === "admin"
                ? ADMIN_TABS
                : role === "commercant"
                  ? COMMERCANT_TABS
                  : BASE_TABS
            }
            active={tab}
            onChange={(v) => setTab(v as Tab)}
            fullWidth
          />
          <div className="min-h-72">
            {tab === "info" && <InfoTab entityInfo={entityInfo} />}
            {tab === "docs" && <DocsTab role={role} authId={authId} />}
            {tab === "collectes" && role === "commercant" && <CollectesTab />}
            {tab === "securite" && role === "admin" && <BreachTab />}
            {tab === "historique" && role === "commercant" && (
              <HistoriqueCommercantTab />
            )}
            {tab === "historique" && role === "association" && (
              <HistoriqueAssociationTab />
            )}
            {tab === "historique" && role === "admin" && (
              <EmptyState
                icon={<Clock size={32} className="text-sapin/30" />}
                title="Bientôt disponible"
                description="L'historique de vos activités sera disponible dans une prochaine version."
              />
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
