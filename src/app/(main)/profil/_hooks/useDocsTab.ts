"use client";

import { useState, useCallback } from "react";
import { notifyDocumentsModified } from "../doc-actions";

type DocStatus = {
  rib: boolean;
  kbis: boolean;
  identite: boolean;
  rib_validated: boolean;
  kbis_validated: boolean;
  piece_identite_validated: boolean;
  notification_sent: boolean;
};

export function useDocsTab() {
  const [status, setStatus] = useState<DocStatus | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [notifyDone, setNotifyDone] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/docs/status");
      if (res.ok) setStatus(await res.json());
    } catch {
      // silently ignore status fetch errors
    }
  }, []);

  const handleNotify = async () => {
    setNotifying(true);
    setNotifyError(null);
    const result = await notifyDocumentsModified();
    if (result.success) {
      setNotifyDone(true);
      await refreshStatus();
    } else {
      setNotifyError(result.error ?? "Une erreur est survenue.");
    }
    setNotifying(false);
  };

  const anyDocPresent = status !== null && (status.rib || status.kbis || status.identite);
  const showConfirmButton = anyDocPresent && !status!.notification_sent;

  return {
    status,
    notifying,
    notifyError,
    notifyDone,
    showConfirmButton,
    refreshStatus,
    handleNotify,
  };
}
