"use client";

import { useEffect } from "react";
import { Check } from "@deemlol/next-icons";
import { type DocType } from "@/src/lib/supabase/documents-types";
import Button from "@/src/components/ui/primitives/Button";
import { useDocsTab } from "../../_hooks/useDocsTab";
import DocCard from "./DocCard";
import AdminDocsView from "./AdminDocsView";

const DOC_TYPES: DocType[] = ["rib", "kbis", "identite"];

export default function DocsTab({ role }: { role: "commercant" | "association" | "admin" }) {
  const {
    notifying,
    notifyError,
    notifyDone,
    showConfirmButton,
    refreshStatus,
    handleNotify,
  } = useDocsTab();

  useEffect(() => {
    if (role !== "admin") refreshStatus();
  }, [role, refreshStatus]);

  if (role === "admin") return <AdminDocsView />;

  return (
    <div>
      <p className="text-sapin/50 mb-5">
        Vos documents sont chiffrés (AES-256-GCM) et accessibles uniquement par l'équipe Récoltéo.
      </p>
      {DOC_TYPES.map((type) => <DocCard key={type} type={type} onChanged={refreshStatus} />)}

      {notifyDone && (
        <div className="mt-6 pt-5 border-t border-sapin/8">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-lime border border-sapin/20">
            <Check size={16} className="text-sapin shrink-0" />
            <p className="text-sm font-semibold text-sapin">
              L'équipe Récoltéo a été notifiée et va re-vérifier vos documents.
            </p>
          </div>
        </div>
      )}

      {showConfirmButton && !notifyDone && (
        <div className="mt-6 pt-5 border-t border-sapin/8">
          <p className="text-sapin/60 mb-3">
            Déposez vos 3 documents puis confirmez pour notifier l'équipe Récoltéo.
          </p>
          <Button
            label={notifying ? "Envoi en cours…" : "Confirmer les modifications"}
            onClick={handleNotify}
            disabled={notifying}
            variant="sapin"
            showArrow={false}
            className="w-full justify-center"
          />
          {notifyError && (
            <p className="mt-2 text-sapin/60">{notifyError}</p>
          )}
        </div>
      )}
    </div>
  );
}
